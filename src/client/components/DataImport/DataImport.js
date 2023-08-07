import React, { useEffect, useState } from 'react';
import { Button, Modal, Switch } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

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
import { closeImportSoket, getImportUpdate } from '../../../store/settingsStore/settingsActions';

import './DataImport.less';
import VoteInfoBlock from './VoteInfoBlock';

const limit = 30;

const DataImport = ({ intl }) => {
  const isAuthBot = useSelector(state =>
    getIsConnectMatchBot(state, { botType: MATCH_BOTS_TYPES.IMPORT }),
  );
  const authUserName = useSelector(getAuthenticatedUserName);
  const dispatch = useDispatch();
  const handleRedirect = () => redirectAuthHiveSigner(isAuthBot, 'waivio.import');
  const [visible, setVisible] = useState(false);
  const [visibleVoting, setVisibleVoting] = useState(false);
  const [votingValue, setVotingValue] = useState(100);
  const [importedObject, setImportedObject] = useState([]);
  const [hasMoreImports, setHasMoreImports] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const [history, setHistoryImportedObject] = useState([]);
  const setHasMore = list => list.length === limit;

  const getImportList = () =>
    getImportedObjects(authUserName, 0, limit).then(res => {
      setImportedObject(res);
      setHasMoreImports(setHasMore(res));
    });

  const updateImportDate = () => {
    getImportedObjects(authUserName, 0, limit).then(res => {
      getHistoryImportedObjects(authUserName, 0, limit).then(his => {
        setHistoryImportedObject(his);
        setHasMoreHistory(setHasMore(his));
      });
      setImportedObject(res);
      setHasMoreImports(setHasMore(res));
    });
  };

  const loadMoreImportDate = () =>
    getImportedObjects(authUserName, importedObject.length, limit).then(res => {
      setHasMoreImports(setHasMore(res));

      setImportedObject([...importedObject, ...res]);
    });
  const loadMoreHistoryDate = () =>
    getHistoryImportedObjects(authUserName, history.length, limit).then(his => {
      setHasMoreHistory(setHasMore(his));

      setHistoryImportedObject([...history, ...his]);
    });

  useEffect(() => {
    getImportVote(authUserName).then(res => {
      setVotingValue(res.minVotingPower / 100);
    });

    getImportedObjects(authUserName, 0, limit).then(res => {
      setImportedObject(res);
      setHasMoreImports(setHasMore(res));
    });
    getHistoryImportedObjects(authUserName, 0, limit).then(his => {
      setHistoryImportedObject(his);
      setHasMoreHistory(setHasMore(his));
    });

    dispatch(getImportUpdate(updateImportDate));

    return () => dispatch(closeImportSoket());
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
      getImportedObjects(authUserName, 0, importedObject.length).then(res => {
        setImportedObject(res);
      });
    });
  };

  const handleDeleteObject = item => {
    Modal.confirm({
      title: intl.formatMessage({
        id: 'stop_json_title',
        defaultMessage: 'Stop JSON data file import',
      }),
      content: intl.formatMessage({
        id: 'stop_json_message',
        defaultMessage:
          'Once stopped, the import cannot be resumed. To temporarily suspend/resume the data import, please consider using the Active checkbox.',
      }),
      onOk: () => {
        deleteObjectImport(authUserName, item.importId).then(() => {
          getImportedObjects(authUserName, 0, importedObject.length).then(res => {
            setImportedObject(res);
          });
        });
      },
      okText: intl.formatMessage({ id: 'stop_import_ok_button', defaultMessage: 'Stop import' }),
      cancelText: intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' }),
    });
  };

  return (
    <div className="DataImport">
      <div className="DataImport__title">
        <h2>
          {intl.formatMessage({ id: 'data_import_title', defaultMessage: 'Data import bot' })}
        </h2>
        <Switch checked={isAuthBot} onChange={handleRedirect} />
      </div>
      <p>
        {intl.formatMessage({
          id: 'data_import_description1',
          defaultMessage:
            'The data import bot automatically creates or updates objects on the Hive blockchain using the JSON data files generated in accordance with the following data schema. (https://developer.datafiniti.co/docs/product-data-schema). Product, people and business data files downloaded from the Datafiniti.io service are compliant.',
        })}
      </p>
      <p>
        {intl.formatMessage({
          id: 'data_import_description2',
          defaultMessage:
            'Each object consists of multiple updates (e.g., title, description, price, address, etc.), which are posted on the Hive blockchain as individual records. Each update must be approved by the user who initiated the data import with an upvote equivalent to $0.001 in WAIV power.',
        })}
      </p>
      <p>
        {intl.formatMessage({
          id: 'data_import_description3',
          defaultMessage:
            'If the WAIV power on the account is insufficient to cast a $0.001 USD vote, or if the WAIV power reaches the specified threshold, the data import process will continue at a slower pace.',
        })}
      </p>
      <hr />
      <p>
        <b>
          {intl.formatMessage({
            id: 'data_import_requires_auth',
            defaultMessage:
              'The Data import bot requires authorization to upvote data updates on your behalf',
          })}
          :{' '}
          <a onClick={handleRedirect}>
            {isAuthBot
              ? intl.formatMessage({
                  id: 'match_bots_unauth_link',
                  defaultMessage: 'Remove authorization',
                })
              : intl.formatMessage({ id: 'match_bots_auth_link', defaultMessage: 'Authorize now' })}
          </a>
        </b>
        <br />
        <b>
          {intl.formatMessage({
            id: 'matchBot_authorization_completed_steemconnect_can_revoked_any_time',
            defaultMessage:
              'The authorization is completed via HiveSigner and can be revoked at any time.',
          })}
        </b>
      </p>
      <p>
        {intl.formatMessage({
          id: 'waiv_voting_power_threshold',
          defaultMessage: 'WAIV voting power threshold',
        })}
        : {votingValue}% (
        <a onClick={toggleVotingModal}>
          {intl.formatMessage({ id: 'change', defaultMessage: 'change' })}
        </a>
        )
        <br />
        {intl.formatMessage({
          id: 'data_import_pause',
          defaultMessage:
            'The data import bot will pause if WAIV voting power on the account drops below the set threshold.',
        })}
      </p>
      <VoteInfoBlock />
      <hr />
      <Button type="primary" onClick={toggleModal}>
        {intl.formatMessage({ id: 'upload_new_file', defaultMessage: 'Upload new file' })}
      </Button>
      <DynamicTbl
        handleShowMore={loadMoreImportDate}
        showMore={hasMoreImports}
        header={configProductTable}
        bodyConfig={importedObject}
        onChange={handleChangeStatus}
        deleteItem={handleDeleteObject}
      />
      <h3>{intl.formatMessage({ id: 'history', defaultMessage: 'History' })}</h3>
      <DynamicTbl
        handleShowMore={loadMoreHistoryDate}
        showMore={hasMoreHistory}
        header={configHistoryTable}
        bodyConfig={history}
      />
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

DataImport.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(DataImport);
