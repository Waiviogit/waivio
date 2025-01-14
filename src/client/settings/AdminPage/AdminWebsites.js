import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { message, Modal } from 'antd';
import { injectIntl } from 'react-intl';
import { get, isEmpty } from 'lodash';
import Affix from '../../components/Utils/Affix';
import LeftSidebar from '../../app/Sidebar/LeftSidebar';
import DynamicTbl from '../../components/Tools/DynamicTable/DynamicTable';
import { websiteStatisticsConfig } from '../../newRewards/constants/adminPageConfigs';
import { deleteSite, getWebsitesInfoForAdmins } from '../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import './AdminPage.less';

const AdminWebsites = ({ intl }) => {
  const [modalState, setModalState] = useState({});
  const [websitesInfo, setWebsitesInfo] = useState([]);
  const authUserName = useSelector(getAuthenticatedUserName);

  useEffect(() => {
    getWebsitesInfoForAdmins(authUserName).then(info => setWebsitesInfo(info));
  }, []);

  return (
    !isEmpty(websitesInfo) && (
      <div className=" shifted">
        <div className="container settings-layout">
          <Affix className="leftContainer" stickPosition={77}>
            <div className="left">
              <LeftSidebar />
            </div>
          </Affix>
          <div className={classNames('center')}>
            <div className="">
              <div className={'AdminPage'}>
                <div className={'AdminPage__title-wrap'}>
                  <div className={'AdminPage__title'}>Website statistics</div>
                </div>
                <DynamicTbl
                  header={websiteStatisticsConfig}
                  bodyConfig={websitesInfo}
                  deleteItem={site =>
                    setModalState({ visible: true, hostInfo: site.websites[0].host })
                  }
                />
                <p className={'AdminPage__info'}>
                  * Daily active users are averaged over the last 7 days.
                </p>
                <p className={'AdminPage__info'}>
                  {' '}
                  ** If the account balance becomes negative, all websites will be suspended. The
                  estimate of the Days remaining is based on the current website usage and is
                  subject to change.
                </p>
              </div>
            </div>
          </div>
        </div>
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
            // rejectAffiliateCodes();

            deleteSite(authUserName, modalState.hostInfo).then(res => {
              setWebsitesInfo(websitesInfo.filter(s => s.websites[0].host !== modalState.hostInfo));
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
    )
  );
};

AdminWebsites.propTypes = {
  intl: PropTypes.shape(),
};

export default injectIntl(AdminWebsites);
