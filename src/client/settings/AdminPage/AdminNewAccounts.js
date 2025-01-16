import React from 'react';
import classNames from 'classnames';
import Affix from '../../components/Utils/Affix';
import LeftSidebar from '../../app/Sidebar/LeftSidebar';
import './AdminPage.less';

const AdminNewAccounts = () => (
  <div className=" shifted">
    <div className="container settings-layout">
      <Affix className="leftContainer" stickPosition={77}>
        <div className="left">
          <LeftSidebar />
        </div>
      </Affix>
      <div className={classNames('center')}>
        {
          <div className="">
            <div className={'AdminPage'}>
              <div className={'AdminPage__title-wrap'}>
                <div className={'AdminPage__title no-mb'}>Website New Accounts</div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  </div>
);

export default AdminNewAccounts;
