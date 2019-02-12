import React from 'react';
import '../../components/Story/StoryLoading.less';

const StoryLoading = () => (
  <div className="StoryLoading">
    <p>
      <span className="ant-card-loading-block" style={{ width: '80%' }} />
    </p>
    <div className="StoryLoading__header">
      <p className="StoryLoading__header__avatar ant-card-loading-block" />
      <div style={{ width: '100%' }}>
        <div>
          <p className="ant-card-loading-block" style={{ width: '44%' }} />
        </div>
        <p className="ant-card-loading-block" style={{ width: '15%' }} />
      </div>
    </div>
    <div className="StoryLoading__header">
      <p className="StoryLoading__header__avatar ant-card-loading-block" />
      <div style={{ width: '100%' }}>
        <div>
          <p className="ant-card-loading-block" style={{ width: '44%' }} />
        </div>
        <p className="ant-card-loading-block" style={{ width: '15%' }} />
      </div>
    </div>
    <div className="StoryLoading__header">
      <p className="StoryLoading__header__avatar ant-card-loading-block" />
      <div style={{ width: '100%' }}>
        <div>
          <p className="ant-card-loading-block" style={{ width: '44%' }} />
        </div>
        <p className="ant-card-loading-block" style={{ width: '15%' }} />
      </div>
    </div>
  </div>
);

export default StoryLoading;
