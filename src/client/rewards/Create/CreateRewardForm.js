import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Icon,
  Input,
  message,
  Select,
  InputNumber,
} from 'antd';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { createCampaign } from '../../../waivioApi/ApiClient';
import './CreateReward.less';
import ReviewItem from './ReviewItem';
import OBJECT_TYPE from '../../object/const/objectTypes';
import TargetDaysTable from './TargetDaysTable/TargetDaysTable';
import SearchUsersAutocomplete from '../../components/EditorUser/SearchUsersAutocomplete';

const { Option } = Select;
@withRouter
@Form.create()
class CreateRewardForm extends React.Component {
  static propTypes = {
    userName: PropTypes.string,
    user: PropTypes.shape(),
    form: PropTypes.shape(),
    intl: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    currentSteemDollarPrice: PropTypes.number,
  };
  static defaultProps = {
    userName: '',
    user: {},
    form: {},
    currentSteemDollarPrice: 0,
  };
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    objectsToAction: [],
    sponsorsToAction: [],
    requiredObject: {},
    pageObjects: [],
    isModalEligibleUsersOpen: false,
    hasRequireObject: false,
    hasReviewObject: false,
    loading: false,
    parentPermlink: '',
    compensationAccount: {},
  };

  setRequiredObject = obj => {
    this.setState({
      requiredObject: obj,
      hasRequireObject: false,
      parentPermlink: obj.author_permlink,
    });
  };

  getObjectsToOmit = () => {
    const objectsToOmit = [];
    if (!_.isEmpty(this.state.requiredObject)) {
      objectsToOmit.push(this.state.requiredObject.id);
    }
    if (!_.isEmpty(this.state.objectsToAction)) {
      _.map(this.state.objectsToAction, obj => objectsToOmit.push(obj.id));
    }
    return objectsToOmit;
  };

  removeRequiredObject = () => {
    this.setState({ requiredObject: {}, hasRequireObject: true });
  };

  removeReviewObject = obj => {
    this.setState(prevState => {
      const objectList = prevState.objectsToAction.filter(el => el.id !== obj.id);
      return {
        objectsToAction: objectList,
        hasReviewObject: !objectList.length,
      };
    });
  };

  removePageObject = obj => {
    this.setState(prevState => {
      const objectList = prevState.pageObjects.filter(el => el.id !== obj.id);
      return {
        pageObjects: objectList,
      };
    });
  };

  removeSponsorObject = obj => {
    this.setState(prevState => {
      const objectList = prevState.sponsorsToAction.filter(el => el.account !== obj.account);
      return {
        sponsorsToAction: objectList,
      };
    });
  };

  removeCompensationAccount = () => {
    this.setState({ compensationAccount: {} });
  };

  handleSubmit = e => {
    this.setState({ loading: true });
    e.preventDefault();
    this.checkOptionFields();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err && !_.isEmpty(this.state.requiredObject) && !_.isEmpty(this.state.objectsToAction)) {
        createCampaign(this.prepareSubmitData(values))
          .then(data => {
            message.success(`'${values.campaignName}' rewards campaign has been created.`);
            this.setState({
              propositions: data.campaigns,
              hasMore: data.hasMore,
              loading: false,
              isSubmit: true,
            });
            this.manageRedirect();
          })
          .catch(error => {
            console.log(error);
            message.error(`${values.campaignName}'rewards campaign has been rejected`);
            this.setState({ loading: false });
          });
      }
      if (err) {
        this.setState({ loading: false });
      }
      this.setState({
        hasRequireObject: _.isEmpty(this.state.requiredObject),
        hasReviewObject: _.isEmpty(this.state.objectsToAction),
        loading: false,
      });
    });
  };

  toggleModalEligibleUsers = () =>
    this.setState({ isModalEligibleUsersOpen: !this.state.isModalEligibleUsersOpen });

  prepareSubmitData = data => {
    const objects = _.map(this.state.objectsToAction, o => o.id);
    const pageObjects =
      this.state.pageObjects.length !== 0 ? _.map(this.state.pageObjects, o => o.id) : [];
    const sponsorAccounts = _.map(this.state.sponsorsToAction, o => o.account);
    return {
      requiredObject: this.state.requiredObject.author_permlink,
      guideName: this.props.userName,
      name: data.campaignName,
      description: data.description,
      type: data.type,
      budget: data.budget,
      reward: data.reward,
      requirements: { minPhotos: data.minPhotos },
      blacklist_users: [],
      whitelist_users: [],
      count_reservation_days: data.reservationPeriod,
      userRequirements: {
        minFollowers: data.minFollowers,
        minPosts: data.minPosts,
        minExpertise: data.minExpertise,
        minSteemReputation: data.minSteemReputation,
      },
      usersLegalNotice: data.usersLegalNotice,
      commissionAgreement: data.commissionAgreement,
      objects,
      pageObjects,
      compensationAccount: this.state.compensationAccount && this.state.compensationAccount.account,
      sponsorAccounts,
      expired_at: data.expiredAt.format(),
    };
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  handleWebsiteChange = value => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  };

  handleSelectChange = value => {
    console.log(value);

    // this.props.form.setFieldsValue({});
  };

  handleAddObjectToList = obj => {
    this.setState({
      objectsToAction: [...this.state.objectsToAction, obj],
      hasReviewObject: false,
    });
  };

  handleAddSponsorToList = obj => {
    const sponsors = [...this.state.sponsorsToAction, obj];
    if (sponsors.length <= 5) {
      this.setState({
        sponsorsToAction: sponsors,
      });
    }
  };

  handleAddPageObject = obj => {
    this.setState({
      pageObjects: [...this.state.pageObjects, obj],
    });
  };

  handleSetCompensationAccount = obj => {
    this.setState({ compensationAccount: obj });
  };

  handleDeleteObjectFromList = obj => {
    let objectsToAction = this.state.objectsToAction;
    objectsToAction = _.filter(objectsToAction, o => o.id !== obj.id);
    this.setState({ objectsToAction });
  };

  compareBudgetValues = (rule, value, callback) => {
    const { user, currentSteemDollarPrice, intl } = this.props;
    const userUSDBalance = parseFloat(user.sbd_balance) * currentSteemDollarPrice;
    if (value <= 0 && value !== '') {
      callback(
        intl.formatMessage({
          id: 'budget_more_than_zero',
          defaultMessage: 'Budget should be more than zero',
        }),
      );
    } else if (userUSDBalance < value) {
      callback(
        intl.formatMessage({
          id: 'budget_overprices_wallet_balance',
          defaultMessage: 'Budget should not exceed your SBD wallet balance',
        }),
      );
    } else {
      callback();
    }
  };

  compareRewardAndBudget = (rule, value, callback) => {
    const { form, intl } = this.props;
    const budgetValue = form.getFieldValue('budget');
    if (value <= 0 && value !== '') {
      callback(
        intl.formatMessage({
          id: 'reward_more_than_zero',
          defaultMessage: 'Reward should be more than zero',
        }),
      );
    } else if (budgetValue < value) {
      callback(
        intl.formatMessage({
          id: 'reward_not_exceed_budget',
          defaultMessage: 'The reward should not exceed the budget',
        }),
      );
    } else {
      callback();
    }
  };

  checkReservationPeriod = (rule, value, callback) => {
    const { intl } = this.props;
    if (value < 1 && value !== '') {
      callback(
        intl.formatMessage({
          id: 'reserve_period_one_day',
          defaultMessage: 'The reservation period must be at least one day',
        }),
      );
    } else {
      callback();
    }
  };

  checkPhotosQuantity = (rule, value, callback) => {
    const { intl } = this.props;
    if (value < 0 && value !== '') {
      callback(
        intl.formatMessage({
          id: 'not_less_zero_photos',
          defaultMessage: 'Should not be less than zero photos',
        }),
      );
    } else {
      callback();
    }
  };

  checkCommissionValue = (rule, value, callback) => {
    const { intl } = this.props;
    if (value < 5 && value !== '') {
      callback(
        intl.formatMessage({
          id: 'not_less_five_commission_value',
          defaultMessage: 'Commissions must not be less than 5%',
        }),
      );
    } else {
      callback();
    }
  };

  checkMinExpertise = (rule, value, callback) => {
    const { intl } = this.props;
    if (value < 0 && value !== '') {
      callback(
        intl.formatMessage({
          id: 'reputation_cannot_be_negative',
          defaultMessage: 'The Waivio reputation cannot be negative',
        }),
      );
    } else {
      callback();
    }
  };

  checkSteemReputation = (rule, value, callback) => {
    const { intl } = this.props;

    if ((value < -100 || value > 100) && value !== '') {
      callback(
        intl.formatMessage({
          id: 'steem_reputation_from_100_to_100',
          defaultMessage: 'The Steem reputation must be from -100 to 100',
        }),
      );
    } else {
      callback();
    }
  };

  checkFollowersQuantity = (rule, value, callback) => {
    const { intl } = this.props;
    if (value < 0) {
      callback(
        intl.formatMessage({
          id: 'not_less_zero_followers',
          defaultMessage: 'Number of followers cannot be negative',
        }),
      );
    } else {
      callback();
    }
  };

  checkExpireDate = (rule, value, callback) => {
    const { intl } = this.props;
    const currentDay = new Date().getDate();
    if ((value && value.unix() * 1000 < Date.now()) || (value && value.date() === currentDay)) {
      callback(
        intl.formatMessage({
          id: 'expiry_date_after_current',
          defaultMessage: 'The expiry date must be after the current date',
        }),
      );
    } else {
      callback();
    }
  };

  checkPostsQuantity = (rule, value, callback) => {
    const { intl } = this.props;
    if (value < 0) {
      callback(
        intl.formatMessage({
          id: 'not_less_zero_posts',
          defaultMessage: 'Number of posts cannot be negative',
        }),
      );
    } else {
      callback();
    }
  };

  checkNameFieldIsEmpty = (rule, value, callback) => {
    const { intl } = this.props;
    if (value && value.match(/^ *$/) !== null) {
      callback(
        intl.formatMessage({
          id: 'not_valid_campaign_name',
          defaultMessage:
            "This doesn't seem to be valid campaign name. Only alphanumeric characters, hyphens, underscores and dots are allowed.",
        }),
      );
    } else {
      callback();
    }
  };

  checkOptionFields = () => {
    const minPhotos = this.props.form.getFieldValue('minPhotos');
    const minSteemReputation = this.props.form.getFieldValue('minSteemReputation');
    const minFollowers = this.props.form.getFieldValue('minFollowers');
    const minPosts = this.props.form.getFieldValue('minPhotos');

    if (minPhotos === '') {
      this.props.form.setFieldsValue({
        minPhotos: 0,
      });
    }
    if (minSteemReputation === '') {
      this.props.form.setFieldsValue({
        minSteemReputation: -100,
      });
    }
    if (minFollowers === '') {
      this.props.form.setFieldsValue({
        minFollowers: 0,
      });
    }
    if (minPosts === '') {
      this.props.form.setFieldsValue({
        minPosts: 0,
      });
    }
  };

  manageRedirect = () => {
    this.props.history.push('/rewards/manage');
  };

  render() {
    const { intl } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { hasRequireObject, hasReviewObject, loading } = this.state;
    return (
      <Form layout="vertical" onSubmit={this.handleSubmit}>
        <Form.Item
          label={intl.formatMessage({
            id: 'campaign_name',
            defaultMessage: 'campaign name',
          })}
        >
          {getFieldDecorator('campaignName', {
            rules: [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'input_campaign_name',
                  defaultMessage: 'Please, input your Campaign name!',
                }),
              },
              {
                max: 100,
                message: intl.formatMessage({
                  id: 'campaign_name_error_long',
                  defaultMessage: 'The name of the campaign should not exceed 100 symbols',
                }),
              },
              {
                validator: this.checkNameFieldIsEmpty,
              },
            ],
          })(<Input disabled={loading} />)}
          <div className="CreateReward__field-caption">
            {intl.formatMessage({
              id: 'campaign_names_used_internal_reports',
              defaultMessage: 'Campaign names are used only for internal reports',
            })}
          </div>
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({
            id: 'campaign_type',
            defaultMessage: 'Campaign type',
          })}
        >
          {getFieldDecorator('type', {
            rules: [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'select_campaign_type',
                  defaultMessage: 'Please, select your campaign type!',
                }),
              },
            ],
          })(
            <Select
              placeholder={intl.formatMessage({
                id: 'select_campaign_type_option',
                defaultMessage: 'Select campaign type',
              })}
              onChange={this.handleSelectChange}
              disabled={loading}
            >
              <Option value="reviews">
                {intl.formatMessage({
                  id: 'reviews',
                  defaultMessage: 'Reviews',
                })}
              </Option>
              {/* <Option value="activity"> */}
              {/*  {intl.formatMessage({ */}
              {/*    id: 'activity', */}
              {/*    defaultMessage: 'Activity', */}
              {/*  })} */}
              {/* </Option> */}
            </Select>,
          )}
          <div className="CreateReward__field-caption">
            {intl.formatMessage({
              id: 'specific_campaign_parameters_type',
              defaultMessage: 'The campaign parameters are specific to the type of campaign',
            })}
          </div>
        </Form.Item>
        {/* <Form.Item label="Status"> */}
        {/* {getFieldDecorator('status', { */}
        {/* rules: [{ required: true, message: 'Please select your campaign status!' }], */}
        {/* })( */}
        {/* <Select */}
        {/* placeholder="Select a option and change input text above" */}
        {/* onChange={this.handleSelectChange} */}
        {/* > */}
        {/* <Option value="inactive">Inactive</Option> */}
        {/* <Option value="active">Active</Option> */}
        {/* <Option value="deleted">Deleted</Option> */}
        {/* </Select>, */}
        {/* )}  */}
        {/* </Form.Item> */}
        <Form.Item
          label={intl.formatMessage({
            id: 'campaign_budget',
            defaultMessage: 'Campaign budget (monthly, SBD)',
          })}
        >
          {getFieldDecorator('budget', {
            rules: [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'set_monthly_budget',
                  defaultMessage: 'Please, set your monthly budget!',
                }),
              },
              {
                validator: this.compareBudgetValues,
              },
            ],
          })(<Input type="number" disabled={loading} step={0.1} />)}
          <div className="CreateReward__field-caption">
            {intl.formatMessage({
              id: 'unused_portion_not_accumulate',
              defaultMessage: 'The unused portion of the budget does not accumulate',
            })}
          </div>
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({
            id: 'reward_per_review_SBD',
            defaultMessage: 'Reward (per review, SBD)',
          })}
        >
          {getFieldDecorator('reward', {
            rules: [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'set_reward',
                  defaultMessage: 'Please, set a reward!',
                }),
              },
              {
                validator: this.compareRewardAndBudget,
              },
            ],
          })(<Input type="number" disabled={loading} step={0.1} />)}
          <div className="CreateReward__field-caption">
            {intl.formatMessage({
              id: 'reward_portion_using_upvotes_registered_accounts',
              defaultMessage:
                'Portion of the reward can be paid using upvotes from registered accounts',
            })}
          </div>
        </Form.Item>
        <div className="CreateReward__item-title simple-text">
          {intl.formatMessage({
            id: 'registered_upvoting_accounts',
            defaultMessage: 'Registered upvoting accounts besides @sponsor (optional)',
          })}
        </div>
        <div className="CreateReward__item-title simple-text">
          {intl.formatMessage({
            id: 'up_to_5_comma_delimited)',
            defaultMessage: '(up to 5, comma delimited)',
          })}
        </div>
        <SearchUsersAutocomplete
          allowClear={false}
          disabled={loading}
          handleSelect={this.handleAddSponsorToList}
          itemsIdsToOmit={
            !_.isEmpty(this.state.sponsorsToAction)
              ? _.map(this.state.sponsorsToAction, obj => obj.account)
              : []
          }
          placeholder={intl.formatMessage({
            id: 'sponsor_auto_complete_placeholder',
            defaultMessage: 'Find sponsor',
          })}
          style={{ width: '100%' }}
        />
        <div className="CreateReward__field-caption">
          {intl.formatMessage({
            id: 'value_of_upvotes_can_be_accumulated_on_compensation_account',
            defaultMessage:
              'The value of upvotes can be accumulated on a dedicated compensation account',
          })}
        </div>
        <div className="CreateReward__objects-wrap">
          {_.map(this.state.sponsorsToAction, user => (
            <ReviewItem
              key={user}
              object={user}
              loading={loading}
              removeReviewObject={this.removeSponsorObject}
              isUser
            />
          ))}
        </div>
        <div className="CreateReward__item-title simple-text">
          {intl.formatMessage({
            id: 'compensation_account_optional',
            defaultMessage: 'Compensation account (optional)',
          })}
        </div>
        <SearchUsersAutocomplete
          allowClear={false}
          disabled={loading}
          handleSelect={this.handleSetCompensationAccount}
          placeholder={intl.formatMessage({
            id: 'compensation_account_auto_complete_placeholder',
            defaultMessage: 'Find compensation account',
          })}
          style={{ width: '100%' }}
        />
        <div className="CreateReward__field-caption">
          {intl.formatMessage({
            id: 'accumulates_value_of_upvotes_from_registered_upvoting_accounts',
            defaultMessage: 'Accumulates the value of upvotes from registered upvoting accounts',
          })}
        </div>
        {!_.isEmpty(this.state.compensationAccount) ? (
          <div className="CreateReward__objects-wrap">
            <ReviewItem
              key={this.state.compensationAccount}
              object={this.state.compensationAccount}
              loading={loading}
              removeReviewObject={this.removeCompensationAccount}
              isUser
            />
          </div>
        ) : null}

        <Form.Item
          label={intl.formatMessage({
            id: 'reservation_period',
            defaultMessage: 'Maximum reservation period (days)',
          })}
        >
          {getFieldDecorator('reservationPeriod', {
            rules: [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'set_period',
                  defaultMessage: 'Please, set a period!',
                }),
              },
              {
                validator: this.checkReservationPeriod,
              },
            ],
            initialValue: 1,
          })(<Input type="number" disabled={loading} />)}
          <div className="CreateReward__field-caption">
            {intl.formatMessage({
              id: 'budget_reduced_amount_rewards_reserved',
              defaultMessage: 'The available budget is reduced by the amount of rewards reserved',
            })}
          </div>
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({
            id: 'target_days_for_reviews',
            defaultMessage: 'Target days for reviews',
          })}
        >
          <TargetDaysTable intl={intl} />
          <div className="CreateReward__field-caption">
            {intl.formatMessage({
              id: 'reservation_period_will_dynamically_adjusted',
              defaultMessage:
                'Reservation period will be dynamically adjusted to match target days',
            })}
          </div>
        </Form.Item>
        <div className="CreateReward__block-title">
          {intl.formatMessage({
            id: 'eligible_reviews',
            defaultMessage: 'Eligible reviews (post requirements)',
          })}
          :
        </div>
        <Form.Item
          label={intl.formatMessage({
            id: 'min_original_photos',
            defaultMessage: 'Minimum number of original photos (per review)',
          })}
        >
          {getFieldDecorator('minPhotos', {
            rules: [
              {
                validator: this.checkPhotosQuantity,
              },
            ],
            initialValue: 0,
          })(<Input type="number" disabled={loading} />)}
        </Form.Item>
        <div className="CreateReward__item-title ant-form-item-required">
          {intl.formatMessage({
            id: 'link_parent_object',
            defaultMessage: 'Link to the primary (parent) object',
          })}
        </div>
        <SearchObjectsAutocomplete
          allowClear={false}
          itemsIdsToOmit={this.getObjectsToOmit()}
          style={{ width: '100%' }}
          placeholder={intl.formatMessage({
            id: 'object_auto_complete_placeholder',
            defaultMessage: 'Find object',
          })}
          handleSelect={this.setRequiredObject}
          isPermlinkValue={false}
          disabled={loading}
        />
        <div
          className={classNames('CreateReward__object-message-validate', {
            'enable-require': hasRequireObject,
          })}
        >
          {intl.formatMessage({
            id: 'select_object',
            defaultMessage: 'Select the primary object',
          })}
        </div>
        <div className="CreateReward__field-caption">
          {intl.formatMessage({
            id: 'example_parent_object',
            defaultMessage: 'Example: business, brand, restaurant, etc.',
          })}
        </div>
        <div className="CreateReward__objects-wrap">
          {!_.isEmpty(this.state.requiredObject) && (
            <React.Fragment>
              <div
                className={classNames('CreateReward__objects-wrap-close-circle', {
                  'disable-element': loading || !_.isEmpty(this.state.objectsToAction),
                })}
              >
                <Icon
                  type="close-circle"
                  onClick={
                    !loading && _.isEmpty(this.state.objectsToAction)
                      ? this.removeRequiredObject
                      : null
                  }
                />
              </div>
              <ObjectCardView wObject={this.state.requiredObject} />
            </React.Fragment>
          )}
        </div>
        <div className="CreateReward__item-title ant-form-item-required">
          {intl.formatMessage({
            id: 'link_secondary_objects',
            defaultMessage: 'Link to one of the secondary objects',
          })}
        </div>
        <SearchObjectsAutocomplete
          allowClear={false}
          itemsIdsToOmit={this.getObjectsToOmit()}
          style={{ width: '100%' }}
          handleSelect={this.handleAddObjectToList}
          isPermlinkValue={false}
          disabled={loading || _.isEmpty(this.state.requiredObject)}
          parentPermlink={this.state.parentPermlink}
          autoFocus={false}
        />
        <div
          className={classNames('CreateReward__object-message-validate', {
            'enable-review': hasReviewObject,
          })}
        >
          {intl.formatMessage({
            id: 'select_more_object',
            defaultMessage: 'Select one or more secondary objects',
          })}
        </div>
        <div className="CreateReward__field-caption">
          {intl.formatMessage({
            id: 'example_secondary_object',
            defaultMessage: 'Example: product, service, dish, etc.',
          })}
        </div>
        <div className="CreateReward__objects-wrap">
          {_.map(this.state.objectsToAction, obj => (
            <ReviewItem
              key={obj.id}
              object={obj}
              loading={loading}
              removeReviewObject={this.removeReviewObject}
            />
          ))}
        </div>
        <div className="CreateReward__block-title">
          {intl.formatMessage({
            id: 'eligible_users',
            defaultMessage: 'Eligible users',
          })}
          :
        </div>
        <Form.Item
          label={intl.formatMessage({
            id: 'min_steem_reputation',
            defaultMessage: 'Minimum Steem reputation (optional)',
          })}
        >
          {getFieldDecorator('minSteemReputation', {
            rules: [
              {
                validator: this.checkSteemReputation,
              },
            ],
            initialValue: 25,
          })(<Input type="number" disabled={loading} />)}
          <div className="CreateReward__field-caption">
            {intl.formatMessage({
              id: 'users_steem_start_reputation',
              defaultMessage: 'New users on Steem start with reputation of 25',
            })}
          </div>
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({
            id: 'minimum_waivio_expertise',
            defaultMessage: 'Minimum Waivio expertise (optional)',
          })}
        >
          {getFieldDecorator('minExpertise', {
            rules: [
              {
                validator: this.checkMinExpertise,
              },
            ],
          })(<Input type="number" disabled={loading} />)}
          <div className="CreateReward__field-caption">
            {intl.formatMessage({
              id: 'users_start_with_zero_expertise',
              defaultMessage: 'New users on Waivio start with expertise of 0',
            })}
          </div>
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({
            id: 'min_followers',
            defaultMessage: 'Minimum number of followers (optional)',
          })}
        >
          {getFieldDecorator('minFollowers', {
            rules: [
              {
                validator: this.checkFollowersQuantity,
              },
            ],
            initialValue: 0,
          })(<Input type="number" disabled={loading} />)}
          <div className="CreateReward__field-caption">
            {intl.formatMessage({
              id: 'users_start_with_zero_followers',
              defaultMessage: 'New users start with 0 followers',
            })}
          </div>
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({
            id: 'min_posts',
            defaultMessage: 'Minimum number of posts (optional)',
          })}
        >
          {getFieldDecorator('minPosts', {
            rules: [
              {
                validator: this.checkPostsQuantity,
              },
            ],
            initialValue: 0,
          })(<Input type="number" disabled={loading} />)}
          <div className="CreateReward__field-caption">
            {intl.formatMessage({
              id: 'users_start_with_zero_posts',
              defaultMessage: 'New users start with 0 posts',
            })}
          </div>
        </Form.Item>
        <Form.Item>
          <h3 className="CreateReward header">
            {intl.formatMessage({
              id: 'legal',
              defaultMessage: 'Legal',
            })}
            :
          </h3>
          <p>
            {intl.formatMessage({
              id: 'reward_payments_made_directly_waivio_provide_information',
              defaultMessage:
                'All reward payments are made directly to users by the campaign creator. Waivio and other partners provide information and discovery services only.',
            })}
          </p>
          <br />
          <p>
            {intl.formatMessage({
              id: 'can_add_link_agreement_govern_relationships',
              defaultMessage:
                'Here you can add a link to the agreement, which will govern the relationship between you and participating users.',
            })}
          </p>
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({
            id: 'note_reviewers',
            defaultMessage: 'Additional review requirements (optional)',
          })}
        >
          {getFieldDecorator('description', {
            rules: [
              {
                max: 250,
                message: intl.formatMessage({
                  id: 'campaign_description_longer_250_symbols',
                  defaultMessage: 'Campaign description should be no longer then 250 symbols!',
                }),
              },
            ],
          })(<Input.TextArea disabled={loading} />)}
          <div className="CreateReward__field-caption">
            {intl.formatMessage({
              id: 'note_shown_to_users_of_reward',
              defaultMessage:
                'This note will be shown to users at the time of reservation of the reward',
            })}
          </div>
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({
            id: 'campaign_expiry_date',
            defaultMessage: 'Campaign expiry date',
          })}
        >
          {getFieldDecorator('expiredAt', {
            rules: [
              {
                type: 'object',
                required: true,
                message: intl.formatMessage({
                  id: 'select_time',
                  defaultMessage: 'Please, select time!',
                }),
              },
              {
                validator: this.checkExpireDate,
              },
            ],
          })(<DatePicker allowClear={false} />)}
        </Form.Item>
        <div className="CreateReward__item-title simple-text">
          {intl.formatMessage({
            id: 'link_agreement',
            defaultMessage: 'Link to the agreement (page object, optional)',
          })}
        </div>
        <SearchObjectsAutocomplete
          className="menu-item-search"
          itemsIdsToOmit={
            !_.isEmpty(this.state.pageObjects) ? _.map(this.state.pageObjects, obj => obj.id) : []
          }
          placeholder="Find page object"
          handleSelect={this.handleAddPageObject}
          objectType={OBJECT_TYPE.PAGE}
          isPermlinkValue={false}
          disabled={loading}
          autoFocus={false}
        />
        <div className="CreateReward__objects-wrap">
          {_.map(this.state.pageObjects, obj => (
            <ReviewItem
              key={obj.id}
              object={obj}
              loading={loading}
              removeReviewObject={this.removePageObject}
            />
          ))}
        </div>
        <Form.Item
          label={intl.formatMessage({
            id: 'legal_notice_users_user',
            defaultMessage: 'Legal notice to users (optional)',
          })}
        >
          {getFieldDecorator('usersLegalNotice', {
            rules: [
              {
                max: 250,
                message: intl.formatMessage({
                  id: 'campaign_description_longer_250_symbols',
                  defaultMessage: 'Campaign description should be no longer then 250 symbols!',
                }),
              },
            ],
          })(<Input.TextArea disabled={loading} />)}
          <div className="CreateReward__field-caption">
            {intl.formatMessage({
              id: 'note_draw_users_attention_specific_terms',
              defaultMessage:
                'This note may be used to draw users attention to the specific terms and conditions of the agreement',
            })}
            .
          </div>
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('agreement', {
            rules: [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'read_agreement',
                  defaultMessage: 'Please, read the agreement and check this field',
                }),
              },
            ],
            valuePropName: 'checked',
          })(
            <Checkbox disabled={loading}>
              <React.Fragment>
                <span className="CreateReward__item-title ant-form-item-required">
                  {intl.formatMessage({
                    id: 'agree_to_the',
                    defaultMessage: 'I agree to the ',
                  })}
                </span>
                <a href="https://waiviodev.com/object/xrj-terms-and-conditions">
                  {intl.formatMessage({
                    id: 'terms_and_conditions',
                    defaultMessage: 'Terms and Conditions ',
                  })}
                </a>
                <span className="CreateReward__item-title simple-text">
                  {intl.formatMessage({
                    id: 'service_acknowledge_campaign_not_violate_laws',
                    defaultMessage:
                      'of the service and acknowledge that this campaign does not violate any laws of British Columbia, Canada.',
                  })}
                </span>
              </React.Fragment>
            </Checkbox>,
          )}
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({
            id: 'agree_to_pay_following_commissions_waivio)',
            defaultMessage: 'I agree to pay the following commissions to Waivio and partners',
          })}
        >
          {getFieldDecorator('commissionAgreement', {
            rules: [
              {
                validator: this.checkCommissionValue,
              },
            ],
            initialValue: 5,
          })(
            <InputNumber
              className="CreateReward ant-input-number"
              min={5}
              max={100}
              formatter={value => `${value}%`}
              parser={value => value.replace('%', '')}
            />,
          )}
          <div className="CreateReward__field-caption">
            {intl.formatMessage({
              id: 'commissions_must_paid_within_14_days',
              defaultMessage:
                'Commissions and rewards to users must be paid in full within 14 days from the occurrence of payment obligations',
            })}
          </div>
        </Form.Item>
        <Form.Item>
          <div className="CreateReward__block-button">
            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
              {intl.formatMessage({
                id: 'create',
                defaultMessage: 'Create',
              })}
            </Button>
            <span>Once created, the campaign can be activated in the Campaigns/Manage tab.</span>
          </div>
        </Form.Item>
      </Form>
    );
  }
}

export default CreateRewardForm;
