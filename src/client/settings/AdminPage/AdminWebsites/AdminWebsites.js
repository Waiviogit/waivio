import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { message, Modal } from 'antd';
import Cookie from 'js-cookie';
import { injectIntl } from 'react-intl';
import { get, isEmpty, round } from 'lodash';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { websiteStatisticsConfig } from '../../../newRewards/constants/adminPageConfigs';
import { deleteSite, getWebsitesInfoForAdmins } from '../../../../waivioApi/ApiClient';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../../../../store/authStore/authSelectors';
import Loading from '../../../components/Icon/Loading';
import { getCurrentCurrency } from '../../../../store/appStore/appSelectors';
import CreditsModal from '../AdminCredits/CreditsModal';
import CreditsForm from '../AdminCredits/CreditsForm';
import '../AdminPage.less';

const AdminWebsites = ({ intl }) => {
  const [modalState, setModalState] = useState({});
  const [loading, setLoading] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [creditsUser, setCreditsUser] = useState(false);
  const [websitesInfo, setWebsitesInfo] = useState([]);
  const [amount, setAmount] = useState('');
  const authUserName = useSelector(getAuthenticatedUserName);
  const isAuth = useSelector(getIsAuthenticated);
  const currency = useSelector(getCurrentCurrency);
  const title = `Website statistics`;
  const appAdmins = Cookie.get('appAdmins');
  const iaAppAdmin = appAdmins?.includes(authUserName);
  const history = useHistory();
  const getData = () =>
    getWebsitesInfoForAdmins(authUserName).then(info => {
      setWebsitesInfo(info);
      setLoading(false);
    });

  useEffect(() => {
    if (isAuth && iaAppAdmin) {
      setLoading(true);
      getData();
    } else {
      history.push('/');
    }
  }, [isAuth, authUserName]);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="">
          <div className={'AdminPage__wrapper'}>
            <div className={'AdminPage__title-wrap'}>
              <div className={'AdminPage__title no-mb'}>{title}</div>
            </div>
            {!isEmpty(websitesInfo) && (
              <table className="DynamicTable">
                <thead>
                  {websiteStatisticsConfig.map((row, rowIndex) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <tr key={`row-${rowIndex}`}>
                      {row.map((column, colIndex) => {
                        if (!column.intl || !column.id) return null;

                        return (
                          <th
                            // eslint-disable-next-line react/no-array-index-key
                            key={`column-${colIndex}`}
                            rowSpan={column.rowspan || 1}
                            colSpan={column.colspan || 1}
                          >
                            {intl.formatMessage(column.intl, { currency: currency.type })}
                          </th>
                        );
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {websitesInfo.map(row => {
                    const rowSpan = row.websites.length;

                    return (
                      <React.Fragment key={row.userName}>
                        {row.websites.map((website, index) => (
                          <tr key={website.host || index}>
                            {/* Shared cells are rendered only for the first website */}
                            {index === 0 && (
                              <>
                                <td rowSpan={rowSpan}>
                                  <Link to={`/@${row.userName}`}>{row.userName}</Link>
                                  <div
                                    className={'AdminPage__credits'}
                                    onClick={() => {
                                      setCreditsUser(row.userName);
                                      setShowCredits(true);
                                    }}
                                  >
                                    add credits
                                  </div>
                                </td>
                                <td rowSpan={rowSpan}>
                                  {round(row.accountBalance.paid * currency.rate, 2)}
                                </td>
                                <td rowSpan={rowSpan}>{row.accountBalance.avgDau}</td>
                                <td rowSpan={rowSpan}>
                                  {round(row.accountBalance.dailyCost * currency.rate, 2)}
                                </td>
                                <td rowSpan={rowSpan}>{row.accountBalance.remainingDays}</td>
                              </>
                            )}
                            {/* Website-specific cells */}
                            <td>
                              {website.status === 'active' ? (
                                <a
                                  href={`https://${website.host}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {website.host}
                                </a>
                              ) : (
                                website.host
                              )}
                            </td>
                            <td>{website.parent}</td>
                            <td>{website.status}</td>
                            <td>{website.averageDau}</td>
                            <td>
                              {['pending', 'inactive', 'suspended'].includes(website.status) ? (
                                // eslint-disable-next-line jsx-a11y/interactive-supports-focus
                                <a
                                  role="button"
                                  className="DynamicTable__delete"
                                  onClick={() =>
                                    setModalState({ visible: true, hostInfo: website.host })
                                  }
                                >
                                  {intl.formatMessage({
                                    id: 'delete',
                                    defaultMessage: 'Delete',
                                  })}
                                </a>
                              ) : (
                                '-'
                              )}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            )}
            <br />
            <p className={'AdminPage__info'}>
              * Daily active users are averaged over the last 7 days.
            </p>
            <p className={'AdminPage__info'}>
              {' '}
              ** If the account balance becomes negative, all websites will be suspended. The
              estimate of the Days remaining is based on the current website usage and is subject to
              change.
            </p>
            <br />
            <CreditsForm setShowCredits={setShowCredits} setCreditsUser={setCreditsUser} />
          </div>
        </div>
      )}
      <CreditsModal
        updateTable={getData}
        amount={amount}
        creditsUser={creditsUser}
        setAmount={setAmount}
        setShowCredits={setShowCredits}
        showCredits={showCredits}
      />
      <Modal
        visible={modalState.visible}
        title={intl.formatMessage(
          {
            id: 'delete_website_modal_title',
            defaultMessage: 'Delete {host} website',
          },
          {
            host: get(modalState, ['hostInfo'], ''),
          },
        )}
        onCancel={() => setModalState({})}
        onOk={() => {
          deleteSite(authUserName, modalState.hostInfo).then(res => {
            const filteredWebsitesInfo = websitesInfo
              .map(obj => {
                const filteredWebsites = obj.websites.filter(
                  website => website.host !== modalState.hostInfo,
                );

                return filteredWebsites.length > 0 ? { ...obj, websites: filteredWebsites } : null;
              })
              .filter(obj => obj !== null);

            setWebsitesInfo(filteredWebsitesInfo);

            if (res.message)
              message.error(
                intl.formatMessage({
                  id: 'insufficient_balance',
                  defaultMessage: 'Insufficient funds on the balance sheet.',
                }),
              );
          });
          setModalState({
            visible: false,
          });
        }}
      >
        {intl.formatMessage({
          id: 'delete_website_modal_body',
          defaultMessage:
            'Warning: All configuration data and website pages will be removed. The name of the website will be no longer protected.',
        })}
      </Modal>
    </div>
  );
};

AdminWebsites.propTypes = {
  intl: PropTypes.shape(),
};

export default injectIntl(AdminWebsites);
