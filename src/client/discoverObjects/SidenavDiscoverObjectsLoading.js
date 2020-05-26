import React from 'react';

const SidenavDiscoverObjectsLoading = () => (
  <div className="SidenavDiscoverObjectsLoading">
    <span className="ant-card-loading-block" style={{ width: '30%', margin: '0 10px 10px 0' }} />
    <div className="InstrumentCardLoader__header">
      <div className="InstrumentCardLoader__header__text" style={{ width: '100%' }}>
        <p className="ant-card-loading-block" style={{ width: '40%' }} />
        <p className="ant-card-loading-block" style={{ width: '95%' }} />
        <p className="ant-card-loading-block" style={{ width: '100%' }} />
      </div>
    </div>
  </div>
);

export default SidenavDiscoverObjectsLoading;
