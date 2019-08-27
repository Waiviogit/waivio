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
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err && !_.isEmpty(this.state.requiredObject) && !_.isEmpty(this.state.objectsToAction)) {
        createCampaign(this.prepareSubmitData(values))
          .then(data => {
            this.setState({ propositions: data.campaigns, hasMore: data.hasMore, loading: false });
            message.success("Campaign 'Name' - has been created");
          })
          .catch(error => {
            console.log(error);
            message.error("Can't crate campaign 'Name', try again later");
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
    const userUSDBalance = parseFloat(user.balance) * currentSteemDollarPrice;
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
          defaultMessage: 'Budget overprices your wallet balance',
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
          defaultMessage: 'Reward should not exceed the budget',
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
          id: 'reserve_period_period_one_day',
          defaultMessage: 'Reservation period must be at least one day',
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
          id: 'must_have_one_photo',
          defaultMessage: 'Reputation should be from -100 to 100',
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
          id: 'not_less_zero_followes',
          defaultMessage: 'Should not be less than zero followes',
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
          id: 'not_less_one_day',
          defaultMessage: 'Should not be less than one day',
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
          defaultMessage: 'Should not be less than zero posts',
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
                  defaultMessage: 'Campaign name must be no longer then 100 symbols',
                }),
              },
              {
                validator: this.checkNameFieldIsEmpty,
              },
            ],
          })(<Input disabled={loading} />)}
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
                id: 'select_option_change_input_text',
                defaultMessage: 'Select an option and change input text above',
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
              <Option value="activity">
                {intl.formatMessage({
                  id: 'activity',
                  defaultMessage: 'Activity',
                })}
              </Option>
            </Select>,
          )}
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
            id: 'budget',
            defaultMessage: 'Budget',
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
          })(<Input type="number" disabled={loading} />)}
          {intl.formatMessage({
            id: 'sbd_per_month',
            defaultMessage: 'SBD per month',
          })}
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({
            id: 'reward',
            defaultMessage: 'Reward',
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
          })(<Input type="number" disabled={loading} />)}
          {intl.formatMessage({
            id: 'sbd_per_review',
            defaultMessage: 'SBD per review',
          })}
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({
            id: 'reservation_period',
            defaultMessage: 'Reservation period',
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
          {intl.formatMessage({
            id: 'days',
            defaultMessage: 'Days',
          })}
        </Form.Item>
        <div className="CreateReward__block-title">
          {intl.formatMessage({
            id: 'review_requirements',
            defaultMessage: 'Review requirements',
          })}
          :
        </div>
        <Form.Item
          label={intl.formatMessage({
            id: 'min_original_photos',
            defaultMessage: 'Min # of original photos',
          })}
        >
          {getFieldDecorator('minPhotos', {
            rules: [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'set_minimal_photos!',
                  defaultMessage: 'Please, set minimal count of photos!',
                }),
              },
              {
                validator: this.checkPhotosQuantity,
              },
            ],
            initialValue: 0,
          })(<Input type="number" disabled={loading} />)}
          {intl.formatMessage({
            id: 'per_review',
            defaultMessage: 'per review',
          })}
        </Form.Item>
        <div className="CreateReward__item-title ant-form-item-required">
          {intl.formatMessage({
            id: 'required_business_object',
            defaultMessage: 'Required object (Your business object)',
          })}
        </div>
        <SearchObjectsAutocomplete
          allowClear={false}
          itemsIdsToOmit={this.getObjectsToOmit()}
          style={{ width: '100%' }}
          placeholder="Please select"
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
            defaultMessage: 'Please, select an object',
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
            id: 'objects_review',
            defaultMessage: 'Objects to review',
          })}
        </div>
        <SearchObjectsAutocomplete
          allowClear={false}
          itemsIdsToOmit={this.getObjectsToOmit()}
          style={{ width: '100%' }}
          placeholder="Please select"
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
            defaultMessage: 'Please, select one object or more',
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
            defaultMessage: 'Min STEEM reputation',
          })}
        >
          {getFieldDecorator('minStReputation', {
            rules: [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'set_minimal_reputation_for_users',
                  defaultMessage: 'Please, set minimal reputation for eligible users!',
                }),
              },
              {
                validator: this.checkSteemReputation,
              },
            ],
            initialValue: -10,
          })(<Input type="number" disabled={loading} />)}
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({
            id: 'min_followers',
            defaultMessage: 'Min followers',
          })}
        >
          {getFieldDecorator('minFollowers', {
            rules: [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'set_minimal_followers_for_users',
                  defaultMessage: 'Please set minimal followers count for eligible users!',
                }),
              },
              {
                validator: this.checkFollowersQuantity,
              },
            ],
            initialValue: 0,
          })(<Input type="number" disabled={loading} />)}
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({
            id: 'min_posts',
            defaultMessage: 'Min # of posts',
          })}
        >
          {getFieldDecorator('minPosts', {
            rules: [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'set_minimal_posts_for_users',
                  defaultMessage: 'Please set minimal posts count for eligible users!',
                }),
              },
              {
                validator: this.checkPostsQuantity,
              },
            ],
            initialValue: 0,
          })(<Input type="number" disabled={loading} />)}
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
            defaultMessage: 'Note to reviewers',
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
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({
            id: 'expired_automatically',
            defaultMessage: 'Expired automatically at',
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
