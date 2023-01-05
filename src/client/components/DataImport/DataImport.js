import React, { useEffect, useState } from 'react';
import { Button, Modal, Switch } from 'antd';
import { useSelector } from 'react-redux';

import ChangeVotingModal from '../../widgets/ChangeVotingModal/ChangeVotingModal';
import ImportModal from './ImportModal/ImportModal';
import DynamicTbl from '../Tools/DynamicTable/DynamicTable';
import { configHistoryTable, configProductTable } from './tableConfig';
import { MATCH_BOTS_TYPES, redirectAuthHiveSigner } from '../../../common/helpers/matchBotsHelpers';
import {
  getAuthenticatedUserName,
  getIsConnectMatchBot,
} from '../../../store/authStore/authSelectors';

import {
  deleteObjectImport,
  getHistoryImportedObjects,
  getImportedObjects,
  getImportVote,
  setImportVote,
  setObjectImport,
} from '../../../waivioApi/importApi';

import './DataImport.less';

const DataImport = () => {
  const isAuthBot = useSelector(state =>
    getIsConnectMatchBot(state, { botType: MATCH_BOTS_TYPES.IMPORT }),
  );
  const authUserName = useSelector(getAuthenticatedUserName);
  const handleRedirect = () => redirectAuthHiveSigner(isAuthBot, 'waivio.import');
  const [visible, setVisible] = useState(false);
  const [visibleVoting, setVisibleVoting] = useState(false);
  const [votingValue, setVotingValue] = useState(100);
  const [importedObject, setImportedObject] = useState([]);
  const [history, setHistoryImportedObject] = useState([]);

  const getImportList = () =>
    getImportedObjects(authUserName).then(res => {
      setImportedObject(res);
    });

  useEffect(() => {
    getImportVote(authUserName).then(res => {
      setVotingValue(res.minVotingPower / 100);
    });
    getImportList();
    getHistoryImportedObjects(authUserName).then(res => {
      setHistoryImportedObject(res);
    });
  }, []);

  const toggleModal = () => setVisible(!visible);

  const toggleVotingModal = () => setVisibleVoting(!visibleVoting);

  const handleSetMinVotingPower = voting => {
    setImportVote(authUserName, voting * 100);
    setVotingValue(voting);
    toggleVotingModal();
  };

  const handleChangeStatus = (e, item) => {
    const status = item.status === 'active' ? 'onHold' : 'active';

    setObjectImport(authUserName, status, item.importId).then(() => {
      getImportList();
    });
  };

  const handleDeleteObject = item => {
    Modal.confirm({
      title: 'Stop JSON data file import',
      content:
        'Once stopped, the import cannot be resumed. To temporarily suspend/resume the data import, please consider using the Active checkbox.',
      onOk: () => {
        deleteObjectImport(authUserName, item.importId).then(() => {
          getImportedObjects(authUserName).then(res => {
            setImportedObject(res);
          });
        });
      },
      okText: 'Stop import',
    });
  };

  return (
    <div className="DataImport">
      <div className="DataImport__title">
        <h2>Data import bot</h2>
        <Switch checked={isAuthBot} onChange={handleRedirect} />
      </div>
      <p>
        The data import bot automatically creates or updates objects on the Hive blockchain using
        the JSON data files generated in accordance with the following data schema.
        (https://developer.datafiniti.co/docs/product-data-schema). Product, people and business
        data files downloaded from the Datafiniti.io service are compliant.
      </p>
      <p>
        Each object consists of multiple updates (e.g., title, description, price, address, etc.),
        which are posted on the Hive blockchain as individual records. Each update must be approved
        by the user who initiated the data import with an upvote equivalent to $0.001 in WAIV power.
      </p>
      <p>
        If the WAIV power on the account is insufficient to cast a $0.001 USD vote, or if the WAIV
        power reaches the specified threshold, the data import process will continue at a slower
        pace.
      </p>
      <hr />
      <p>
        <b>
          The Data import bot requires authorization to upvote data updates on your behalf:{' '}
          <a onClick={handleRedirect}>Authorize now</a>
        </b>
        <br />
        <b>The authorization is completed via HiveSigner and can be revoked at any time.</b>
      </p>
      <p>
        WAIV voting power threshold: {votingValue}% (<a onClick={toggleVotingModal}>change</a>)
        <br />
        The data import bot will pause if WAIV voting power on the account drops below the set
        threshold.
      </p>
      <p>
        <b>Disclaimer:</b> The Data import bot service is provided on as-is / as-available basis.
      </p>
      <hr />
      <Button type="primary" onClick={toggleModal}>
        Upload new file
      </Button>
      <DynamicTbl
        header={configProductTable}
        bodyConfig={importedObject}
        onChange={handleChangeStatus}
        deleteItem={handleDeleteObject}
      />
      <h3>History</h3>
      <DynamicTbl header={configHistoryTable} bodyConfig={history} />
      {visible && (
        <ImportModal getImportList={getImportList} visible={visible} toggleModal={toggleModal} />
      )}
      {visibleVoting && (
        <ChangeVotingModal
          handleSetMinVotingPower={handleSetMinVotingPower}
          visible={visibleVoting}
          handleOpenVoteModal={toggleVotingModal}
          minVotingPower={votingValue}
        />
      )}
    </div>
  );
};

export default DataImport;
