import React, { useState } from 'react';
import { Modal, Checkbox, Input } from 'antd';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { createMessage } from '../../../waivioApi/importApi';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

import '../DataImport/ImportModal/ImportModal.less';
import SearchObjectsAutocomplete from '../EditorObject/SearchObjectsAutocomplete';
import { getUsedLocale } from '../../../store/appStore/appSelectors';
import { getObjectName } from '../../../common/helpers/wObjectHelper';
import ObjectSearchCard from '../ObjectSearchCard/ObjectSearchCard';

const MessageBotImportModal = ({ visible, toggleModal, intl, onClose, updateMessagesList }) => {
  const authName = useSelector(getAuthenticatedUserName);
  const locale = useSelector(getUsedLocale);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [limit, setLimit] = useState('');
  const [skip, setSkip] = useState('');
  const [group, setGroup] = useState('');
  const [page, setPage] = useState('');
  const [repeatedMessages, setRepeatedMessages] = useState(true);

  const handleSubmit = () => {
    setLoading(true);
    createMessage(
      group.author_permlink,
      page.author_permlink,
      isEmpty(amount) ? 0 : amount,
      isEmpty(limit) ? 0 : limit,
      isEmpty(skip) ? 0 : skip,
      authName,
      repeatedMessages,
      locale,
    ).then(() => {
      onClose();
      setLoading(false);
      updateMessagesList();
    });
  };

  return (
    <Modal
      visible={visible}
      title={intl.formatMessage({ id: 'message_bot', defaultMessage: 'Message bot' })}
      className={'MessageBot'}
      onCancel={toggleModal}
      onOk={handleSubmit}
      okButtonProps={{
        disabled: isEmpty(page) || isEmpty(group),
        loading,
      }}
      okText={intl.formatMessage({ id: 'submit', defaultMessage: 'Submit' })}
    >
      <div>
        <h4>{intl.formatMessage({ id: 'group', defaultMessage: 'Group' })}:</h4>
        {!isEmpty(group) && (
          <div className={'MessageBot__resulItem'}>
            <ObjectSearchCard object={group} name={getObjectName(group)} type={'group'} />
          </div>
        )}
        <SearchObjectsAutocomplete
          autoFocus
          objectType={'group'}
          placeholder={'Find a group'}
          handleSelect={setGroup}
        />
      </div>

      <div>
        <h4>
          {intl.formatMessage({
            id: 'page',
            defaultMessage: 'Page',
          })}
          :
        </h4>
        {!isEmpty(page) && (
          <div className={'MessageBot__resulItem'}>
            <ObjectSearchCard object={page} name={getObjectName(page)} type={'page'} />
          </div>
        )}
        <SearchObjectsAutocomplete
          autoFocus={false}
          objectType={'page'}
          placeholder={'Find a page'}
          handleSelect={setPage}
        />
      </div>
      <div>
        <h4>
          {intl.formatMessage({
            id: 'daily_posting_amount',
            defaultMessage: 'Daily posting amount (optional)',
          })}
          :
        </h4>
        <Input
          onChange={e => setAmount(e.target.value)}
          value={amount}
          placeholder={'Enter the amount'}
        />
        <p>Specify how many posts will be published per day.</p>
      </div>
      <div>
        <h4>
          {intl.formatMessage({ id: 'daily_posting_limit', defaultMessage: 'Limit (optional)' })}:
        </h4>
        <Input
          onChange={e => setLimit(e.target.value)}
          value={limit}
          placeholder={'Enter the amount'}
        />
        <p>Specify the number of users who will receive the message.</p>
      </div>
      <div>
        <h4>
          {intl.formatMessage({ id: 'daily_posting_skip', defaultMessage: 'Skip (optional)' })}:
        </h4>
        <Input
          onChange={e => setSkip(e.target.value)}
          value={limit}
          placeholder={'Enter the amount'}
        />
        <p>
          Skip a set number of users (e.g., skipping 10 means the first 10 won’t receive the
          message).
        </p>
      </div>
      <div className="MessageBot__checkbox-wrap">
        <Checkbox checked={repeatedMessages} onClick={() => setRepeatedMessages(!repeatedMessages)}>
          {intl.formatMessage({
            id: 'avoid_repeated_messages',
            defaultMessage: 'Avoid repeated messages',
          })}
        </Checkbox>
      </div>
    </Modal>
  );
};

MessageBotImportModal.propTypes = {
  visible: PropTypes.string,
  toggleModal: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  updateMessagesList: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(MessageBotImportModal);
