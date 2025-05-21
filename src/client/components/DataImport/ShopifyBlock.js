import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Modal, Select } from 'antd';
import LANGUAGES from '../../../common/translations/languages';
import {
  getSyncShopify,
  resumeSyncShopify,
  stopSyncShopify,
  syncShopify,
} from '../../../waivioApi/importApi';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

const ShopifyBlock = ({ shopifySyncs, intl, setShopifySyncs }) => {
  const userName = useSelector(getAuthenticatedUserName);
  const [openSync, setOpenSync] = useState(false);
  const [locale, setLocale] = useState('en-US');
  const [host, setHost] = useState('');
  const [authority, setAuthority] = useState('administrative');
  const refreshSyncs = () =>
    setTimeout(() => getSyncShopify(userName).then(r => setShopifySyncs(r)), 2000);
  const onSyncActionClick = sync => {
    setHost(sync.waivioHostName);
    if (sync.status === 'pending') {
      setOpenSync(true);
    } else {
      Modal.confirm({
        className: 'Shopify-confirm',
        title: 'Stop synchronization',
        content: `Are you sure you want to stop the synchronization process from ${sync.waivioHostName}?`,
        onOk: () => {
          stopSyncShopify(userName, sync.waivioHostName).then(() => refreshSyncs());
        },
        okText: intl.formatMessage({ id: 'stop', defaultMessage: 'Stop' }),
        cancelText: intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' }),
      });
    }
  };

  const onResumeClick = sync => {
    setHost(sync.waivioHostName);
    Modal.confirm({
      className: 'Shopify-confirm',
      title: 'Resume synchronization',
      content: `Are you sure you want to resume the synchronization process from ${sync.waivioHostName}?`,
      onOk: () => {
        resumeSyncShopify(userName, sync.waivioHostName).then(() => refreshSyncs());
      },
      okText: intl.formatMessage({ id: 'resume', defaultMessage: 'Resume' }),
      cancelText: intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' }),
    });
  };

  const onSubmit = () => {
    syncShopify(userName, host, authority, locale).then(() => refreshSyncs());
    setOpenSync(false);
  };

  return (
    <div className="MatchBots__text-content">
      <div className={classNames('MatchBots__highlighted-block')}>
        <b>Shopify</b>
        <p>
          Connect your Shopify store to import products. To get started, fill in the information in
          the site&apos;s management section under the Shopify tab. Once filled, the store will
          automatically appear here, and the synchronization process can begin.
        </p>

        {shopifySyncs.map(sync => (
          <div key={sync._id} className="MatchBots__hostName">
            <span>{sync.hostName} </span>(<Link to={`/${sync.waivioHostName}/shopify`}>change</Link>
            ):&nbsp;
            <span className="WalletTable__csv-button" onClick={() => onResumeClick(sync)}>
              {' '}
              {sync.status === 'onHold' && 'Resume/ '}
            </span>
            <span className="WalletTable__csv-button" onClick={() => onSyncActionClick(sync)}>
              {sync.status === 'pending' ? 'Start synchronization' : 'Stop synchronization'}
            </span>
          </div>
        ))}
      </div>
      {openSync && (
        <Modal
          visible={openSync}
          title={'Synchronization'}
          className={'ImportModal'}
          onCancel={() => setOpenSync(false)}
          onOk={onSubmit}
          okText={'Synchronize'}
        >
          <>
            <div>
              <h4>
                {intl.formatMessage({ id: 'select_locale', defaultMessage: 'Select locale' })}:
              </h4>
              <Select defaultValue={'en-US'} onSelect={setLocale}>
                {LANGUAGES.map(lang => (
                  <Select.Option key={lang.id}>{lang.name}</Select.Option>
                ))}
              </Select>
            </div>
            <div>
              <h4>
                {intl.formatMessage({ id: 'claim_authority', defaultMessage: 'Claim authority' })}:
              </h4>
              <Select defaultValue={'administrative'} onSelect={setAuthority}>
                {['administrative', 'ownership'].map(type => (
                  <Select.Option key={type}>{type}</Select.Option>
                ))}
              </Select>
              <p className={'ImportModal__disclaimer'}>
                {intl.formatMessage({
                  id: 'claim_authority_data_import_note',
                  defaultMessage:
                    'Administrative authority indicates that other non-competing object updates posted by other users are allowed. Ownership authority indicates that all updates by other users must be ignored.',
                })}
              </p>
              <p className={'ImportModal__disclaimer'}>
                Click to start the synchronization process with your Shopify store.
              </p>
            </div>
          </>
        </Modal>
      )}
    </div>
  );
};

ShopifyBlock.propTypes = {
  shopifySyncs: PropTypes.arrayOf(),
  intl: PropTypes.shape(),
  setShopifySyncs: PropTypes.func,
};

export default injectIntl(ShopifyBlock);
