import React, { useState } from 'react';
import { Checkbox, message, Modal } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { setMatchBotRules } from '../../rewardsActions';

const MatchBotTableRow = ({ intl, rule, handleEditRule }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoaded] = useState(false);
  const [activationStatus, setActivationStatus] = useState('');
  const dispatch = useDispatch();
  const handleChangeModalVisible = () => setModalVisible(!modalVisible);
  const editRule = () => {
    handleEditRule(rule);
  };

  const isEnabled = activationStatus ? activationStatus === 'activated' : rule.enabled;

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
          <Checkbox checked={isEnabled} onChange={handleChangeModalVisible} />
        </td>
        <td>{rule.sponsor}</td>
        <td>{rule.voting_percent * 100}%</td>
        <td>
          <div className="MatchBotTable__edit" onClick={editRule} role="presentation">
            {intl.formatMessage({ id: 'matchBot_table_edit', defaultMessage: `Edit` })}
          </div>
        </td>
        <td>{rule.note}</td>
      </tr>
      <Modal
        title={
          !isEnabled
            ? intl.formatMessage({
                id: 'matchBot_success_rule_activation',
                defaultMessage: 'Rule activation',
              })
            : intl.formatMessage({
                id: 'matchBot_success_rule_inactivation',
                defaultMessage: 'Rule inactivation',
              })
        }
        visible={modalVisible}
        onCancel={handleChangeModalVisible}
        onOk={changeRuleStatus}
        confirmLoading={isLoading}
      >
        {!isEnabled
          ? intl.formatMessage(
              {
                id: 'matchBot_success_intention_rule_activation',
                defaultMessage: "Do you want to activate rule with sponsor '{sponsor}'?",
              },
              {
                sponsor: rule.sponsor,
              },
            )
          : intl.formatMessage(
              {
                id: 'matchBot_success_intention_rule_inactivation',
                defaultMessage: "Do you want to inactivate rule? with sponsor '{sponsor}'?",
              },
              {
                sponsor: rule.sponsor,
              },
            )}
      </Modal>
    </React.Fragment>
  );
};

MatchBotTableRow.propTypes = {
  intl: PropTypes.shape().isRequired,
  rule: PropTypes.shape(),
  handleEditRule: PropTypes.func.isRequired,
};

MatchBotTableRow.defaultProps = {
  rule: {},
};

export default injectIntl(MatchBotTableRow);
