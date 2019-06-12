import React from 'react';
import '../../../../../client/components/Story/StoryLoading.less';

const OpenDealLoading = () => (
  <div className="StoryLoading" style={{ width: '100%' }}>
    <p className="StoryLoading__header__avatar ant-card-loading-block" />
    <div style={{ width: '100%' }}>
      <div>
        <p className="ant-card-loading-block" style={{ width: '44%' }} />
      </div>
      <p className="ant-card-loading-block" style={{ width: '15%' }} />
    </div>
  </div>
);

export default OpenDealLoading;
