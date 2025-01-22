import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import Cookie from 'js-cookie';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import Affix from '../../components/Utils/Affix';
import LeftSidebar from '../../app/Sidebar/LeftSidebar';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../../../store/authStore/authSelectors';
import { getAdminVipTickets } from '../../../waivioApi/ApiClient';
import { websiteNewAccountsConfig } from '../../newRewards/constants/adminPageConfigs';
import Loading from '../../components/Icon/Loading';
import './AdminPage.less';
import MobileNavigation from '../../components/Navigation/MobileNavigation/MobileNavigation';

const AdminNewAccounts = ({ intl }) => {
  const [usersInfo, setUsersInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const authUserName = useSelector(getAuthenticatedUserName);
  const isAuth = useSelector(getIsAuthenticated);
  const appAdmins = Cookie.get('appAdmins');
  const isAppAdmin = appAdmins?.includes(authUserName);
  const title = 'New accounts (VIP tickets)';

  useEffect(() => {
    if (isAuth && isAppAdmin) {
      setLoading(true);
      getAdminVipTickets(authUserName).then(data => {
        setUsersInfo(data);
        setLoading(false);
      });
    } else {
      history.push('/');
    }
  }, [isAuth, authUserName]);

  return (
    <div className="shifted">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="container settings-layout">
        <Affix className="leftContainer" stickPosition={77}>
          <div className="left">
            <LeftSidebar />
          </div>
        </Affix>
        <div className={classNames('center')}>
          <MobileNavigation />
          {/* eslint-disable-next-line no-nested-ternary */}
          {loading ? (
            <Loading />
          ) : !isEmpty(usersInfo?.result) ? (
            <div className="">
              <div className={'AdminPage min-width'}>
                <div className={'AdminPage__title-wrap'}>
                  <div className={'AdminPage__title no-mb'}>{title}</div>
                </div>
                <table className="DynamicTable">
                  <thead>
                    {websiteNewAccountsConfig.map((row, rowIndex) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <tr className={'AdminPage__tr'} key={`row-${rowIndex}`}>
                        {row.map((column, colIndex) => {
                          if (!column.intl || !column.id) return null;

                          return (
                            <th
                              // eslint-disable-next-line react/no-array-index-key
                              key={`column-${colIndex}`}
                              rowSpan={column.rowspan || 1}
                              colSpan={column.colspan || 1}
                            >
                              {intl.formatMessage(column.intl)}
                            </th>
                          );
                        })}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {usersInfo.result.map(row => (
                      <tr className={'AdminPage__tr'} key={row.userName}>
                        <td>
                          <Link to={`/@${row.userName}`}>{row.userName}</Link>
                        </td>
                        <td>{row.purchased}</td>
                        <td>{row.used}</td>
                      </tr>
                    ))}
                    <tr className={'AdminPage__tr'} key="total-row">
                      <td>
                        <b>Total</b>
                      </td>
                      <td>
                        <b>{usersInfo.totalPurchased}</b>
                      </td>
                      <td>
                        <b>{usersInfo.totalUsed}</b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>No data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

AdminNewAccounts.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(AdminNewAccounts);
