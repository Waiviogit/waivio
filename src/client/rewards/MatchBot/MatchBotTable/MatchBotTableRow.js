import React, { useState } from 'react';
import { Checkbox, message, Modal } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { setMatchBotRules } from '../../rewardsActions';
import { formatDate } from '../../rewardsHelper';

const MatchBotTableRow = ({ intl, rule, handleEditRule, handleSwitcher, isAuthority }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAuthVisible, setModalAuthVisible] = useState(false);
  const [isLoading, setLoaded] = useState(false);
  const [activationStatus, setActivationStatus] = useState('');
  const mockDate = '2019-12-10T13:42:02.350Z'; // TODO: Remove when backend will ready
  const dispatch = useDispatch();
  const handleChangeModalVisible = () => setModalVisible(!modalVisible);
  const editRule = () => {
    handleEditRule(rule);
  };
  const handleChangeAuthModalVisible = () => {
    setModalAuthVisible(!modalAuthVisible);
  };
  const handleOnOkAuth = () => {
    handleSwitcher();
    handleChangeAuthModalVisible();
  };
  const isEnabled = activationStatus ? activationStatus === 'activated' : rule.enabled;

  const setTitle = () => {
    if (!isAuthority)
      return intl.formatMessage({
        id: 'match_bot_authorization_required',
        defaultMessage: 'Authorization is required',
      });

    if (!isEnabled)
      return intl.formatMessage({
        id: 'matchBot_success_rule_activation',
        defaultMessage: 'Rule activation',
      });
    return intl.formatMessage({
      id: 'matchBot_success_rule_inactivation',
      defaultMessage: 'Rule inactivation',
    });
  };

  const setModalContent = () => {
    if (!isAuthority)
      return intl.formatMessage({
        id: 'match_bot_match_bot_requires_authorization_distribute_votes_behalf',
        defaultMessage: 'The match bot requires authorization to distribute upvotes on your behalf',
      });
    if (!isEnabled)
      return intl.formatMessage(
        {
          id: 'matchBot_success_intention_rule_activation',
          defaultMessage: "Do you want to activate rule with sponsor '{sponsor}'?",
        },
        {
          sponsor: rule.sponsor,
        },
      );
    return intl.formatMessage(
      {
        id: 'matchBot_success_intention_rule_inactivation',
        defaultMessage: "Do you want to inactivate rule? with sponsor '{sponsor}'?",
      },
      {
        sponsor: rule.sponsor,
      },
    );
  };

  const changeRuleStatus = () => {
    setLoaded(true);
    dispatch(setMatchBotRules({ sponsor: rule.sponsor, enabled: !isEnabled })).then(() => {
      handleChangeModalVisible();
      if (!isEnabled) {
        setActivationStatus('activated');
        message.success(
          intl.formatMessage({
            id: 'matchBot_success_activated',
            defaultMessage: 'Rule activated successfully',
          }),
        );
      } else {
        message.success(
          intl.formatMessage({
            id: 'matchBot_success_inactivated',
            defaultMessage: 'Rule inactivated successfully',
          }),
        );
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
            {intl.formatMessage({ id: 'matchBot_table_edit', defaultMessage: `Edit` })}
          </div>
        </td>
        <td>{formatDate(intl, mockDate)}</td>
        <td>{rule.note}</td>
      </tr>
      <Modal
        title={setTitle()}
        visible={isAuthority ? modalVisible : modalAuthVisible}
        onCancel={isAuthority ? handleChangeModalVisible : handleChangeAuthModalVisible}
        onOk={isAuthority ? changeRuleStatus : handleOnOkAuth}
        confirmLoading={isAuthority && isLoading}
        okText={
          !isAuthority &&
          intl.formatMessage({
            id: 'match_bot_authorize_now',
            defaultMessage: 'Authorize now',
          })
        }
      >
        {setModalContent()}
      </Modal>
    </React.Fragment>
  );
};

MatchBotTableRow.propTypes = {
  intl: PropTypes.shape().isRequired,
  rule: PropTypes.shape(),
  handleEditRule: PropTypes.func.isRequired,
  handleSwitcher: PropTypes.func.isRequired,
  isAuthority: PropTypes.bool.isRequired,
};

MatchBotTableRow.defaultProps = {
  rule: {},
};

export default injectIntl(MatchBotTableRow);
