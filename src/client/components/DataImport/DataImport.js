import React from 'react';
import { Button, Switch, Tooltip } from 'antd';

import './DataImport.less';
import DynamicTbl from '../Tools/DynamicTable/DynamicTable';
import { configHistoryTable, configProductTable } from './tableConfig';

const DataImport = () => (
  <div className="DataImport">
    <div className="DataImport__title">
      <h2>Data import bot</h2>
      {/* <div className="DataImport__switcher"> */}
      <Tooltip title="ndsndksefnsd">
        <Switch onChange={() => {}} />
      </Tooltip>
      {/* </div> */}
    </div>
    <p>
      The data import bot automatically creates or updates objects on the Hive blockchain using the
      JSON data files generated in accordance with the following data schema.
      (https://developer.datafiniti.co/docs/product-data-schema). Product, people and business data
      files downloaded from the Datafiniti.io service are compliant.
    </p>
    <p>
      Each object consists of multiple updates (e.g., title, description, price, address, etc.),
      which are posted on the Hive blockchain as individual records. Each update must be approved by
      the user who initiated the data import with an upvote equivalent to $0.001 in WAIV power.
    </p>
    <p>
      If the WAIV power on the account is insufficient to cast a $0.001 USD vote, or if the WAIV
      power reaches the specified threshold, the data import process will continue at a slower pace.
    </p>
    <hr />
    <p>
      <b>
        The Data import bot requires authorization to upvote data updates on your behalf:{' '}
        <a>Authorize now</a>.
      </b>
      <br />
      <b>The authorization is completed via HiveSigner and can be revoked at any time.</b>
    </p>
    <p>
      WAIV voting power threshold: 70% (<a>change</a>).
      <br />
      The data import bot will pause if WAIV voting power on the account drops below the set
      threshold.
    </p>
    <p>
      <b>Disclaimer:</b> The Data import bot service is provided on as-is / as-available basis.
    </p>
    <hr />
    <Button type="primary">Upload new file</Button>
    <DynamicTbl header={configProductTable} bodyConfig={[]} />
    <h3>History</h3>
    <DynamicTbl header={configHistoryTable} bodyConfig={[]} />
  </div>
);

export default DataImport;
