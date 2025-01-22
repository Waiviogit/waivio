import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import Cookie from 'js-cookie';
import { useSelector } from 'react-redux';
import Affix from '../../../components/Utils/Affix';
import LeftSidebar from '../../../app/Sidebar/LeftSidebar';
import { getWhitelistForAdmins } from '../../../../waivioApi/ApiClient';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../../../../store/authStore/authSelectors';
import WhitelistContent from './WhitelistContent';
import '../AdminPage.less';

import Loading from '../../../components/Icon/Loading';
import MobileNavigation from '../../../components/Navigation/MobileNavigation/MobileNavigation';

const AdminWhitelist = () => {
  const [whiteListUsers, setWhitelistUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const authUserName = useSelector(getAuthenticatedUserName);
  const isAuth = useSelector(getIsAuthenticated);
  const appAdmins = Cookie.get('appAdmins');
  const iaAppAdmin = appAdmins?.includes(authUserName);
  const title = 'Whitelist';

  useEffect(() => {
    if (isAuth && iaAppAdmin) {
      setLoading(true);
      getWhitelistForAdmins(authUserName).then(data => {
        setWhitelistUsers(data);
        setLoading(false);
      });
    } else {
      history.push('/');
    }
  }, [isAuth, authUserName]);

  return (
    <div className=" shifted">
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
          {loading ? (
            <Loading />
          ) : (
            <div className="">
              <div className={'AdminPage min-width'}>
                <div className={'AdminPage__title-wrap'}>
                  <div className={'AdminPage__title '}>{title}</div>
                </div>
                <WhitelistContent
                  type={'Whitelist'}
                  userList={whiteListUsers}
                  title={'Add user to the whitelist'}
                  caption={
                    <p>Whitelisted users will have access to benefits on the Waivio platform.</p>
                  }
                  setMainList={setWhitelistUsers}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminWhitelist;
