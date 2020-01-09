import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Checkbox, message, Modal } from 'antd';
import { setMatchBotRules } from '../../rewardsActions';
import { formatDate } from '../../rewardsHelper';
import getMatchBotMessageData from '../matchBotMessageData';

const MatchBotTableRow = ({ handleEditRule, handleSwitcher, isAuthority, intl, rule }) => {
  const [activationStatus, setActivationStatus] = useState('');
  const [isLoading, setLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAuthVisible, setModalAuthVisible] = useState(false);
  const dispatch = useDispatch();

  const isEnabled = activationStatus ? activationStatus === 'activated' : rule.enabled;
  const mockDate = '2019-12-10T13:42:02.350Z'; // TODO: Remove when backend will ready
  const localizer = (id, defaultMessage) => intl.formatMessage({ id, defaultMessage });
  const messageData = getMatchBotMessageData(localizer);

  const handleChangeModalVisible = () => setModalVisible(!modalVisible);
  const handleChangeAuthModalVisible = () => {
    setModalAuthVisible(!modalAuthVisible);
  };
  const handleOnOkAuth = () => {
    handleSwitcher();
    handleChangeAuthModalVisible();
  };
  const editRule = () => {
    handleEditRule(rule);
  };
  const setTitle = () => {
    if (!isAuthority) return messageData.authorizationRequired;
    if (!isEnabled) return messageData.successRuleActivation;
    return messageData.successRuleInactivation;
  };
  const setModalContent = () => {
    if (!isAuthority) return messageData.matchBotRequiresAuthorizationDistribute;
    if (!isEnabled) return `${messageData.successIntentionRuleActivation} '${rule.sponsor}'?`;
    return `${messageData.successIntentionRuleInactivation} '${rule.sponsor}'?`;
  };
  const changeRuleStatus = () => {
    setLoaded(true);
    dispatch(setMatchBotRules({ sponsor: rule.sponsor, enabled: !isEnabled })).then(() => {
      handleChangeModalVisible();
      if (!isEnabled) {
        setActivationStatus('activated');
        message.success(messageData.ruleActivatedSuccessfully);
      } else {
        message.success(messageData.ruleInactivatedSuccessfully);
        setActivationStatus('inactivated');
      }
      setLoaded(false);
    });
  };

  return (
    <React.Fragment>
      <tr>
        <td>
          <Checkbox
            checked={isEnabled}
            onChange={isAuthority ? handleChangeModalVisible : handleChangeAuthModalVisible}
          />
        </td>
        <td>{rule.sponsor}</td>
        <td>{Math.round(rule.voting_percent * 100)}%</td>
        <td>
          <div className="MatchBotTable__edit" onClick={editRule} role="presentation">
            {messageData.edit}
          </div>
        </td>
        <td>{`${formatDate(intl, mockDate)} mock`}</td>
        <td>{rule.note}</td>
      </tr>
      <Modal
        confirmLoading={isAuthority && isLoading}
        onCancel={isAuthority ? handleChangeModalVisible : handleChangeAuthModalVisible}
        onOk={isAuthority ? changeRuleStatus : handleOnOkAuth}
        okText={!isAuthority && messageData.authorizeNow}
        title={setTitle()}
        visible={isAuthority ? modalVisible : modalAuthVisible}
      >
        {setModalContent()}
      </Modal>
    </React.Fragment>
  );
};

MatchBotTableRow.propTypes = {
  handleEditRule: PropTypes.func.isRequired,
  handleSwitcher: PropTypes.func.isRequired,
  isAuthority: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
  rule: PropTypes.shape().isRequired,
};

export default injectIntl(MatchBotTableRow);
