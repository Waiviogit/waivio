import React from 'react';
import '../../../components/Story/StoryLoading.less';

const BrokerBalanceLoading = () => (
  <div className="BrokerBalanceLoading">
    <div className="BrokerBalanceLoading__header">
      <p className="BrokerBalanceLoading__header__avatar ant-card-loading-block" />
      <div className="BrokerBalanceLoading__header__text">
        <p className="ant-card-loading-block" />
      </div>
      <p className="BrokerBalanceLoading__header__avatar ant-card-loading-block" />
      <div className="BrokerBalanceLoading__header__text">
        <p className="ant-card-loading-block" />
      </div>
    </div>
  </div>
);

export default BrokerBalanceLoading;
