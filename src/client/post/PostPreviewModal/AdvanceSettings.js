import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Collapse, Select } from 'antd';
import { injectIntl } from 'react-intl';
import { BENEFICIARY_PERCENT } from '../../helpers/constants';
import { rewardsValues } from '../../../common/constants/rewards';
import ObjectWeights from './ObjectWeights';
import './AdvanceSettings.less';

@injectIntl
class AdvanceSettings extends Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    linkedObjects: PropTypes.arrayOf(PropTypes.shape()),
    objPercentage: PropTypes.shape(),
    settings: PropTypes.shape({
      reward: PropTypes.oneOf([rewardsValues.none, rewardsValues.half, rewardsValues.all]),
      beneficiary: PropTypes.bool,
      upvote: PropTypes.bool,
    }).isRequired,
    isUpdating: PropTypes.bool,
    onSettingsChange: PropTypes.func.isRequired,
    onPercentChange: PropTypes.func.isRequired,
  };
  static defaultProps = {
    intl: {},
    isUpdating: false,
    linkedObjects: [],
    objPercentage: {},
    weightBuffer: 0,
  };

  handleRewardChange = reward => this.props.onSettingsChange({ reward });

  handleBeneficiaryChange = e => this.props.onSettingsChange({ beneficiary: e.target.checked });

  handleUpvoteChange = e => this.props.onSettingsChange({ upvote: e.target.checked });

  handlePercentChange = (objId, percent) => {
    this.props.onPercentChange(objId, percent);
  };

  render() {
    const {
      intl,
      isUpdating,
      linkedObjects,
      objPercentage,
      settings: { reward, beneficiary, upvote },
    } = this.props;
    return (
      <Collapse>
        <Collapse.Panel
          header={intl.formatMessage({
            id: 'advance_settings',
            defaultMessage: 'Advance settings',
          })}
        >
          <div className="rewards-settings">
            <div className="rewards-settings__label">
              {intl.formatMessage({ id: 'reward', defaultMessage: 'Reward' })}
            </div>
            <div className="rewards-settings__control">
              <Select
                value={reward}
                dropdownClassName="rewards-settings__dropdown"
                onChange={this.handleRewardChange}
                disabled={isUpdating}
              >
                <Select.Option value={rewardsValues.all}>
                  {intl.formatMessage({
                    id: 'reward_option_100',
                    defaultMessage: '100% Steem Power',
                  })}
                </Select.Option>
                <Select.Option value={rewardsValues.half}>
                  {intl.formatMessage({
                    id: 'reward_option_50',
                    defaultMessage: '50% SBD and 50% HP',
                  })}
                </Select.Option>
                <Select.Option value={rewardsValues.none}>
                  {intl.formatMessage({ id: 'reward_option_0', defaultMessage: 'Declined' })}
                </Select.Option>
              </Select>
            </div>
          </div>
          {!isUpdating && (
            <div className="beneficiary-settings">
              <Checkbox
                checked={beneficiary}
                onChange={this.handleBeneficiaryChange}
                disabled={isUpdating}
              >
                {intl.formatMessage(
                  {
                    id: 'add_waivio_beneficiary',
                    defaultMessage: 'Share {share}% of this post rewards with InvestArena',
                  },
                  { share: BENEFICIARY_PERCENT / 100 },
                )}
              </Checkbox>
            </div>
          )}
          <div className="upvote-settings">
            <Checkbox checked={upvote} onChange={this.handleUpvoteChange} disabled={isUpdating}>
              {intl.formatMessage({ id: 'like_post', defaultMessage: 'Like this post' })}
            </Checkbox>
          </div>
          {linkedObjects.length > 1 && (
            <ObjectWeights
              intl={intl}
              linkedObjects={linkedObjects}
              objPercentage={objPercentage}
              onPercentChange={this.handlePercentChange}
            />
          )}
        </Collapse.Panel>
      </Collapse>
    );
  }
}

export default AdvanceSettings;
