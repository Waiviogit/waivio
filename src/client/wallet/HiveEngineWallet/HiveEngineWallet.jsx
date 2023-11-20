import React from 'react';
import HiveEngineSummaryInfo from './HiveEngineSummaryInfo';
import HiveEngineTransferList from './HiveEngineTransferList/HiveEngineTransferList';

const HiveEngineWallet = () => (
  <React.Fragment>
    <HiveEngineSummaryInfo />
    <HiveEngineTransferList />
  </React.Fragment>
);

export default HiveEngineWallet;
