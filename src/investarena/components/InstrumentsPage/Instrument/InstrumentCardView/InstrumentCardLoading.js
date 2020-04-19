import React from 'react';

const InstrumentCardLoading = () => (
  <div className="InstrumentCardLoader">
    <div className="InstrumentCardLoader__header">
      <span className="InstrumentCardLoader__header__avatar ant-card-loading-block" />
      <div className="InstrumentCardLoader__header__text" style={{ width: '100%' }}>
        <p className="ant-card-loading-block" style={{ width: '40%' }} />
        <p className="ant-card-loading-block" style={{ width: '95%' }} />
        <p className="ant-card-loading-block" style={{ width: '100%' }} />
      </div>
    </div>
    <div className="InstrumentCardLoader__content">
      <p className="ant-card-loading-block" />
    </div>
  </div>
);

export default InstrumentCardLoading;
