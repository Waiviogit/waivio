import React from 'react';
import classNames from 'classnames';
import Affix from '../../components/Utils/Affix';
import LeftSidebar from '../../app/Sidebar/LeftSidebar';
import './AdminPage.less';

const AdminNewAccounts = () => (
  <div className="feed-layout container Shop">
    <Affix className="leftContainer" stickPosition={77}>
      <div className="left">
        <LeftSidebar />
      </div>
    </Affix>
    <div className={classNames('center', {})}>AdminNewAccounts</div>
  </div>
);

export default AdminNewAccounts;
