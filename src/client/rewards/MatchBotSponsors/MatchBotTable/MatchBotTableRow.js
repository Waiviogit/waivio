import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Checkbox, message, Modal } from 'antd';
import { setMatchBotRules } from '../../../../store/rewardsStore/rewardsActions';
import { formatDate } from '../../rewardsHelper';
import getMatchBotMessageData from '../matchBotMessageData';

const MatchBotTableRow = ({
  handleEditRule,
  handleSwitcher,
  isAuthority,
  intl,
  rule,
  setIsEnabledRule,
}) => {
  const [activationStatus, setActivationStatus] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAuthVisible, setModalAuthVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (activationStatus) setIsEnabled(activationStatus === 'activated');
    else setIsEnabled(rule.enabled);
  }, [activationStatus]);

  useEffect(() => {
    setIsEnabledRule(isEnabled);
  }, [isEnabled]);

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
  const title = setTitle();
  const setModalContent = () => {
    if (!isAuthority) return messageData.matchBotRequiresAuthorizationDistribute;
    if (!isEnabled)
      return (
        <div>
          {messageData.successIntentionRuleActivation}{' '}
          <Link to={`/@${rule.sponsor}`}>{` @${rule.sponsor}`}</Link>?
        </div>
      );

    return (
      <div>
        {messageData.successIntentionRuleInactivation}{' '}
        <Link to={`/@${rule.sponsor}`}>{` @${rule.sponsor}`}</Link>?
      </div>
    );
  };
  const changeRuleStatus = () => {
    setLoading(true);
    dispatch(setMatchBotRules({ sponsor: rule.sponsor, enabled: !isEnabled })).then(() => {
      handleChangeModalVisible();
      if (!isEnabled) {
        setActivationStatus('activated');
        message.success(messageData.ruleActivatedSuccessfully);
      } else {
        message.success(messageData.ruleInactivatedSuccessfully);
        setActivationStatus('inactivated');
      }
      setLoading(false);
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
        <td>{rule.expiredAt ? formatDate(intl, rule.expiredAt) : messageData.termless}</td>
        <td>{rule.note}</td>
      </tr>
      <Modal
        confirmLoading={isAuthority && isLoading}
        onCancel={isAuthority ? handleChangeModalVisible : handleChangeAuthModalVisible}
        onOk={isAuthority ? changeRuleStatus : handleOnOkAuth}
        okText={!isAuthority ? messageData.authorizeNow : messageData.confirm}
        cancelText={messageData.cancel}
        title={title}
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
  setIsEnabledRule: PropTypes.func.isRequired,
};

export default injectIntl(MatchBotTableRow);
