import React from 'react';

const UserDynamicListLoading = () => (
  <div className="UserDynamicListLoading">
    <div className="UserDynamicListLoading__header">
      <p className="UserDynamicListLoading__header__avatar ant-card-loading-block" />
      <p
        className="ant-card-loading-block"
        style={{ width: '10%', position: 'absolute', left: '50px' }}
      />
      <div className="UserDynamicListLoading__header__text">
        <p className="ant-card-loading-block" />
      </div>
    </div>
  </div>
);

export default UserDynamicListLoading;
