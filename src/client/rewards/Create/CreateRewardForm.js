import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Checkbox, DatePicker, Form, Icon, Input, message, Select } from 'antd';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../objectCard/ObjectCardView';
import ModalEligibleUsers from './ModalEligibleUsers/ModalEligibleUsers';
import { createCampaign } from '../../../waivioApi/ApiClient';
import './CreateReward.less';
import ReviewObjectItem from './ReviewObjectItem';

const { Option } = Select;

@Form.create()
class CreateRewardForm extends React.Component {
  static propTypes = {
    userName: PropTypes.string,
    user: PropTypes.shape(),
    form: PropTypes.shape(),
    intl: PropTypes.shape(),
    currentSteemDollarPrice: PropTypes.number,
  };
  static defaultProps = {
    userName: '',
    user: {},
    intl: {},
    form: {},
    currentSteemDollarPrice: 0,
  };
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    objectsToAction: [],
    requiredObject: {},
    isModalEligibleUsersOpen: false,
    hasRequireObject: false,
    hasReviewObject: false,
    loading: false,
  };

  setRequiredObject = obj => {
    this.setState({ requiredObject: obj, hasRequireObject: false });
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

  handleSubmit = e => {
    this.setState({ loading: true });
    e.preventDefault();
    this.checkOptionFields();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err && !_.isEmpty(this.state.requiredObject) && !_.isEmpty(this.state.objectsToAction)) {
        createCampaign(this.prepareSubmitData(values))
          .then(data => {
            this.setState({ propositions: data.campaigns, hasMore: data.hasMore, loading: false });
            message.success(`Campaign '${values.campaignName}' - has been created`);
          })
          .catch(error => {
            console.log(error);
            message.error(`Can't crate campaign '${values.campaignName}', try again later`);
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
      },
      objects,
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
    if (value && value.unix() * 1000 - Date.now() < 86400000) {
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
            <ReviewObjectItem
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
        <Button type="primary" disabled={loading} onClick={this.toggleModalEligibleUsers}>
          {intl.formatMessage({
            id: 'show_eligible_users',
            defaultMessage: 'Show eligible users',
          })}
        </Button>
        {this.state.isModalEligibleUsersOpen && (
          <ModalEligibleUsers
            toggleModal={this.toggleModalEligibleUsers}
            isModalOpen={this.state.isModalEligibleUsersOpen}
            userName={this.props.userName}
            followsCount={this.props.form.getFieldValue('minFollowers')}
            postsCount={this.props.form.getFieldValue('minPosts')}
          />
        )}
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
                  id: 'campaign_description_longer_50_symbols',
                  defaultMessage: 'Campaign description should be no longer then 50 symbols!',
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
          })(<DatePicker />)}
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
              <span className="CreateReward__item-title ant-form-item-required">
                {intl.formatMessage({
                  id: 'have_read',
                  defaultMessage: 'I have read the',
                })}
              </span>
              <a href="">
                {' '}
                {intl.formatMessage({
                  id: 'agreement',
                  defaultMessage: 'agreement',
                })}
              </a>
            </Checkbox>,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
            {intl.formatMessage({
              id: 'create',
              defaultMessage: 'Create',
            })}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default CreateRewardForm;
