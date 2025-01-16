import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
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

const AdminWhitelist = () => {
  const [whiteListUsers, setWhitelistUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const authUserName = useSelector(getAuthenticatedUserName);
  const isAuth = useSelector(getIsAuthenticated);
  const appAdmins = Cookie.get('appAdmins');
  const iaAppAdmin = appAdmins?.includes(authUserName);

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
      <div className="container settings-layout">
        <Affix className="leftContainer" stickPosition={77}>
          <div className="left">
            <LeftSidebar />
          </div>
        </Affix>
        <div className={classNames('center')}>
          {loading ? (
            <Loading />
          ) : (
            <div className="">
              <div className={'AdminPage'}>
                <div className={'AdminPage__title-wrap'}>
                  <div className={'AdminPage__title no-mb'}>Whitelist</div>
                </div>
                <WhitelistContent
                  type={'Whitelist'}
                  userList={whiteListUsers}
                  title={'Add user to the whitelist'}
                  caption={
                    <p>
                      Whitelisted users can participate in any campaign (subject to campaign
                      eligibility criteria) sponsored by{' '}
                      <Link to={`/@${authUserName}`}>{authUserName}</Link>
                    </p>
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
