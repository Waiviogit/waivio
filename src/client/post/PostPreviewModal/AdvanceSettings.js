import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Collapse, Select } from 'antd';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { BENEFICIARY_PERCENT } from '../../helpers/constants';
import { rewardsValues } from '../../../common/constants/rewards';
import ObjectWeights from './ObjectWeights';
import {
  resetSearchAutoCompete,
  searchAutoComplete,
  searchUsersAutoCompete,
} from '../../store/searchStore/searchActions';
import BeneficiariesWeights from './BeneficiariesWeights';
import { getHiveBeneficiaryAccount } from '../../store/settingsStore/settingsSelectors';
import { getAutoCompleteSearchResults } from '../../store/searchStore/searchSelectors';

import './AdvanceSettings.less';

@injectIntl
@connect(
  state => ({
    autoCompleteSearchResults: getAutoCompleteSearchResults(state),
    hiveBeneficiaryAccount: getHiveBeneficiaryAccount(state),
  }),
  {
    searchAutoComplete,
    searchUsersAutoCompete,
    resetSearchAutoCompete,
  },
)
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
    isGuest: PropTypes.bool,
    hiveBeneficiaryAccount: PropTypes.string.isRequired,
  };
  static defaultProps = {
    intl: {},
    isUpdating: false,
    linkedObjects: [],
    objPercentage: {},
    isGuest: false,
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
      settings: { reward, upvote },
      isGuest,
      hiveBeneficiaryAccount,
    } = this.props;

    return (
      <Collapse>
        <Collapse.Panel
          key={'advance_settings'}
          header={intl.formatMessage({
            id: 'advance_settings',
            defaultMessage: 'Advanced settings',
          })}
        >
          {!isGuest && (
            <React.Fragment>
              <div className="rewards-settings">
                <div className="rewards-settings__label">
                  {intl.formatMessage({ id: 'reward', defaultMessage: 'Reward' })}
                </div>
                <div className="rewards-settings__control">
                  <Select
                    value={reward}
                    dropdownClassName="rewards-settings__dropdown"
                    onChange={this.handleRewardChange}
                    disabled={isUpdating || isGuest}
                  >
                    <Select.Option value={rewardsValues.all}>
                      {intl.formatMessage({
                        id: 'reward_option_100',
                        defaultMessage: '100% Hive Power',
                      })}
                    </Select.Option>
                    <Select.Option value={rewardsValues.half}>
                      {intl.formatMessage({
                        id: 'reward_option_50',
                        defaultMessage: '50% HBD and 50% HP',
                      })}
                    </Select.Option>
                    <Select.Option value={rewardsValues.none}>
                      {intl.formatMessage({ id: 'reward_option_0', defaultMessage: 'Declined' })}
                    </Select.Option>
                  </Select>
                </div>
              </div>
              <div className="upvote-settings">
                <Checkbox checked={upvote} onChange={this.handleUpvoteChange} disabled={isUpdating}>
                  {intl.formatMessage({ id: 'like_post', defaultMessage: 'Like this post' })}
                </Checkbox>
              </div>
              {!isUpdating && (
                <div className="beneficiary-settings">
                  <BeneficiariesWeights intl={intl} isGuest={isGuest} />
                </div>
              )}
            </React.Fragment>
          )}
          {isGuest && (
            <div>
              <div className="rewards-settings__guest">
                <span>{intl.formatMessage({ id: 'reward', defaultMessage: 'Reward' })}:</span>{' '}
                {intl.formatMessage({
                  id: 'reward_option_100',
                  defaultMessage: '100% Hive Power',
                })}
              </div>
              <div className="rewards-settings__guest">
                <span>
                  {intl.formatMessage({
                    id: 'beneficiaries-weights',
                    defaultMessage: 'Beneficiaries',
                  })}
                  :
                </span>{' '}
                {intl.formatMessage(
                  {
                    id: 'add_waivio_beneficiary',
                    defaultMessage: 'Share {share}% of this post rewards with Waivio',
                  },
                  { share: BENEFICIARY_PERCENT / 100 },
                )}{' '}
                {hiveBeneficiaryAccount &&
                  `${intl.formatMessage({
                    id: 'and',
                    defaultMessage: 'and',
                  })}  97% ${hiveBeneficiaryAccount}`}
              </div>
              <div className="rewards-settings__guest">
                <span>{intl.formatMessage({ id: 'note', defaultMessage: 'Note' })}:</span>{' '}
                {intl.formatMessage({
                  id: 'guest_accounts',
                  defaultMessage: 'Guest accounts can not change these settings',
                })}
              </div>
            </div>
          )}
          <ObjectWeights
            intl={intl}
            linkedObjects={linkedObjects}
            objPercentage={objPercentage}
            onPercentChange={this.handlePercentChange}
          />
        </Collapse.Panel>
      </Collapse>
    );
  }
}

export default AdvanceSettings;
