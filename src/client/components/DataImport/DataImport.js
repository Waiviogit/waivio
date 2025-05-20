import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import MatchBotsService from '../../rewards/MatchBots/MatchBotsService';
import MatchBotsTitle from '../../rewards/MatchBots/MatchBotsTitle';
import ChangeVotingModal from '../../widgets/ChangeVotingModal/ChangeVotingModal';
import ImportModal from './ImportModal/ImportModal';
import DynamicTbl from '../Tools/DynamicTable/DynamicTable';
import { configHistoryTable, configProductTable } from './tableConfig';
import { MATCH_BOTS_TYPES } from '../../../common/helpers/matchBotsHelpers';
import { getAuthenticatedUserName, isGuestUser } from '../../../store/authStore/authSelectors';

import {
  deleteObjectImport,
  getHistoryImportedObjects,
  getImportedObjects,
  getImportVote,
  getSyncShopify,
  setImportVote,
  setObjectImport,
} from '../../../waivioApi/importApi';
import { closeImportSoket, getImportUpdate } from '../../../store/settingsStore/settingsActions';
import VoteInfoBlock from './VoteInfoBlock';

import './DataImport.less';
import ShopifyBlock from './ShopifyBlock';

const limit = 30;

const DataImport = ({ intl }) => {
  const authUserName = useSelector(getAuthenticatedUserName);
  const isGuest = useSelector(isGuestUser);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [visibleVoting, setVisibleVoting] = useState(false);
  const [votingValue, setVotingValue] = useState(100);
  const [importedObject, setImportedObject] = useState([]);
  const [hasMoreImports, setHasMoreImports] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const [history, setHistoryImportedObject] = useState([]);
  const [shopifySyncs, setShopifySyncs] = useState([]);

  const setListAndSetHasMore = (res, list, isLoadMore, setObjs, setMoreObjs) => {
    if (res.length > limit) {
      setMoreObjs(true);
      setObjs(isLoadMore ? [...list, ...res.slice(0, -1)] : res.slice(0, -1));
    } else {
      setObjs(isLoadMore ? [...list, ...res] : res);
      setMoreObjs(false);
    }
  };

  const getImportList = () =>
    getImportedObjects(authUserName, 0, limit + 1).then(res => {
      setListAndSetHasMore(res, importedObject, false, setImportedObject, setHasMoreImports);
    });

  const updateImportDate = () => {
    getImportedObjects(authUserName, 0, limit + 1).then(res => {
      getHistoryImportedObjects(authUserName, 0, limit + 1).then(his => {
        setListAndSetHasMore(his, history, false, setHistoryImportedObject, setHasMoreHistory);
      });
      setListAndSetHasMore(res, importedObject, false, setImportedObject, setHasMoreImports);
    });
  };

  const loadMoreImportDate = () =>
    getImportedObjects(authUserName, importedObject.length, limit + 1).then(res => {
      setListAndSetHasMore(res, importedObject, true, setImportedObject, setHasMoreImports);
    });
  const loadMoreHistoryDate = () =>
    getHistoryImportedObjects(authUserName, history.length, limit + 1).then(his => {
      setListAndSetHasMore(his, history, true, setHistoryImportedObject, setHasMoreHistory);
    });

  useEffect(() => {
    getSyncShopify(authUserName).then(res => {
      setShopifySyncs(res);
    });

    getImportVote(authUserName).then(res => {
      setVotingValue(res.minVotingPower / 100);
    });

    getImportedObjects(authUserName, 0, limit + 1).then(res => {
      setListAndSetHasMore(res, importedObject, false, setImportedObject, setHasMoreImports);
    });
    getHistoryImportedObjects(authUserName, 0, limit + 1).then(his => {
      setListAndSetHasMore(his, history, false, setHistoryImportedObject, setHasMoreHistory);
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
    const status = ['active', 'waitingRecover', 'pending'].includes(item.status)
      ? 'onHold'
      : 'active';

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
      <MatchBotsTitle
        botType={MATCH_BOTS_TYPES.IMPORT}
        botTitle={intl.formatMessage({
          id: 'data_import_title',
          defaultMessage: 'Data import bot',
        })}
      />
      <p>
        {intl.formatMessage({
          id: 'data_import_description1',
          defaultMessage:
            'The data import bot automatically creates or updates objects on the Hive blockchain using the JSON data files generated in accordance with the following',
        })}
        <a
          href="https://docs.datafiniti.co/docs/product-data-schema"
          target="_blank"
          rel="noreferrer"
        >
          {' '}
          {intl.formatMessage({
            id: 'data_import_description_data_schema',
            defaultMessage: 'data schema',
          })}
        </a>
        .{' '}
        {intl.formatMessage({
          id: 'data_import_description1_1',
          defaultMessage:
            'Product, people and business data files downloaded from the Datafiniti.io service are compliant.',
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
      <MatchBotsService botType={MATCH_BOTS_TYPES.IMPORT} botName={'dataimport'} onlyAuth />
      <p>
        {intl.formatMessage({
          id: isGuest ? 'guest_mana_threshold' : 'waiv_voting_power_threshold',
          defaultMessage: isGuest ? 'Guest mana threshold' : 'WAIV voting power threshold',
        })}
        : {votingValue}% (
        <a onClick={toggleVotingModal}>
          {intl.formatMessage({ id: 'change', defaultMessage: 'change' })}
        </a>
        )
        <br />
        {intl.formatMessage({
          id: isGuest ? 'guest_data_import_pause' : 'data_import_pause',
          defaultMessage: `The data import bot will pause if ${
            isGuest ? 'guest mana' : 'WAIV voting power'
          } on the account drops below the set threshold.`,
        })}
      </p>
      <VoteInfoBlock
        info={intl.formatMessage({
          id: 'data_import_service',
          defaultMessage: 'The Data import bot service is provided on as-is / as-available basis.',
        })}
      />
      <ShopifyBlock shopifySyncs={shopifySyncs} setShopifySyncs={setShopifySyncs} />
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
