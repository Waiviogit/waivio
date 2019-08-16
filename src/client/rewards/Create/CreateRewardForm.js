import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Form, Input, Select, Checkbox, Button, DatePicker } from 'antd';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../objectCard/ObjectCardView';
import ModalEligibleUsers from './ModalEligibleUsers/ModalEligibleUsers';
import { createCampaign } from '../../../waivioApi/ApiClient';
import './CreateReward.less';

const { Option } = Select;

@Form.create()
class CreateRewardForm extends React.Component {
  static propTypes = {
    userName: PropTypes.string,
    user: PropTypes.shape(),
    form: PropTypes.shape().isRequired,
    intl: PropTypes.shape(),
    currentSteemDollalPrice: PropTypes.shape(),
  };
  static defaultProps = {
    userName: '',
    user: {},
    intl: {},
    currentSteemDollalPrice: {},
  };
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    objectsToAction: [],
    requiredObject: {},
    isModalEligibleUsersOpen: false,
    hasRequireObject: false,
    hasReviewObject: false,
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.requiredObject !== this.state.requiredObject) {
      if (!_.isEmpty(this.state.requiredObject)) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ hasRequireObject: false });
      }
    }
    if (prevState.objectsToAction !== this.state.objectsToAction) {
      if (!_.isEmpty(this.state.objectsToAction)) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ hasReviewObject: false });
      }
    }
  }

  setRequiredObject = obj => {
    this.setState({ requiredObject: obj });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err && !_.isEmpty(this.state.requiredObject) && !_.isEmpty(this.state.objectsToAction)) {
        createCampaign(this.prepareSubmitData(values)).then(data => {
          this.setState({ propositions: data.campaigns, hasMore: data.hasMore });
        });
      } else if (_.isEmpty(this.state.requiredObject) && _.isEmpty(this.state.objectsToAction)) {
        this.setState({ hasRequireObject: true, hasReviewObject: true });
      } else if (_.isEmpty(this.state.requiredObject)) {
        this.setState({ hasRequireObject: true, hasReviewObject: false });
      } else if (_.isEmpty(this.state.objectsToAction)) {
        this.setState({ hasRequireObject: false, hasReviewObject: true });
      }
    });
  };

  toggleModalEligibleUsers = () =>
    this.setState({ isModalEligibleUsersOpen: !this.state.isModalEligibleUsersOpen });

  prepareSubmitData = data => {
    const objects = _.map(this.state.objectsToAction, o => o.id);
    const finalData = {
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
      userRequirements: {
        minFollowers: data.minFollowers,
        minPosts: data.minPosts,
      },
      objects,
      expired_at: data.expiredAt.format(),
    };
    return finalData;
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
    const objectsToAction = this.state.objectsToAction;
    objectsToAction.push(obj);
    this.setState({ objectsToAction });
  };

  handleDeleteObjectFromList = obj => {
    let objectsToAction = this.state.objectsToAction;
    objectsToAction = _.filter(objectsToAction, o => o.id !== obj.id);
    this.setState({ objectsToAction });
  };

  compareBudgetValues = (rule, value, callback) => {
    const { user, currentSteemDollalPrice, intl } = this.props;
    const userUSDBalance = parseFloat(user.balance) * currentSteemDollalPrice;
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
    if (value < 1 && value !== '') {
      callback(
        intl.formatMessage({
          id: 'must_have_one_photo',
          defaultMessage: 'Must have at least one photo',
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
    if (value.unix() * 1000 - Date.now() < 86400000) {
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

  render() {
    const { intl } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { hasRequireObject, hasReviewObject } = this.state;
    return (
      <Form layout="vertical" onSubmit={this.handleSubmit}>
        <Form.Item label="Campaign name">
          {getFieldDecorator('campaignName', {
            rules: [
              {
                required: true,
                message: 'Please input your Campaign name!',
              },
              {
                max: 100,
                message: intl.formatMessage({
                  id: 'campaign_name_error_long',
                  defaultMessage: 'Campaign name must be no longer then 100 symbols',
                }),
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Campaign Type">
          {getFieldDecorator('type', {
            rules: [{ required: true, message: 'Please select your campaign type!' }],
          })(
            <Select
              placeholder="Select a option and change input text above"
              onChange={this.handleSelectChange}
            >
              <Option value="reviews">Rewiews</Option>
              <Option value="activity">Activity</Option>
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
        <Form.Item label="Budget">
          {getFieldDecorator('budget', {
            rules: [
              {
                required: true,
                message: 'Please set your monthly budget!',
              },
              {
                validator: this.compareBudgetValues,
              },
            ],
          })(<Input type="number" />)}
          SBD per month
        </Form.Item>
        <Form.Item label="Reward">
          {getFieldDecorator('reward', {
            rules: [
              {
                required: true,
                message: 'Please set a reward!',
              },
              {
                validator: this.compareRewardAndBudget,
              },
            ],
          })(<Input type="number" />)}
          SBD per review
        </Form.Item>
        <Form.Item label="Reservation period">
          {getFieldDecorator('reservationPeriod', {
            rules: [
              {
                required: true,
                message: 'Please set a period!',
              },
              {
                validator: this.checkReservationPeriod,
              },
            ],
          })(<Input type="number" />)}
          Days
        </Form.Item>
        <div className="CreateReward__block-title">ReviewRequirements:</div>
        <Form.Item label="Min # of original photos">
          {getFieldDecorator('minPhotos', {
            rules: [
              {
                required: true,
                message: 'Please set minimal count of photos!',
              },
              {
                validator: this.checkPhotosQuantity,
              },
            ],
          })(<Input type="number" />)}
          per review
        </Form.Item>
        Required object (Your business object)
        <SearchObjectsAutocomplete
          allowClear={false}
          itemsIdsToOmit={[]}
          style={{ width: '100%' }}
          placeholder="Please select"
          handleSelect={this.setRequiredObject}
        />
        <div
          className={classNames('CreateReward__object-message-validate', {
            'enable-require': hasRequireObject,
          })}
        >
          Please, select an object
        </div>
        <div className="CreateReward__objects-wrap">
          {!_.isEmpty(this.state.requiredObject) && (
            <ObjectCardView wObject={this.state.requiredObject} />
          )}
        </div>
        Objects to review
        <SearchObjectsAutocomplete
          allowClear={false}
          itemsIdsToOmit={[]}
          style={{ width: '100%' }}
          placeholder="Please select"
          handleSelect={this.handleAddObjectToList}
        />
        <div
          className={classNames('CreateReward__object-message-validate', {
            'enable-review': hasReviewObject,
          })}
        >
          Please, select one object or more
        </div>
        <div className="CreateReward__objects-wrap">
          {_.map(this.state.objectsToAction, obj => (
            <ObjectCardView wObject={obj} />
          ))}
        </div>
        <div className="CreateReward__block-title">Eligible users:</div>
        <Form.Item label="Min STEEM reputation">
          {getFieldDecorator('minStReputation', {
            rules: [
              {
                required: true,
                message: 'Please set minimal reputation for eligible users!',
              },
              {
                validator: this.checkSteemReputation,
              },
            ],
          })(<Input type="number" />)}
        </Form.Item>
        <Form.Item label="Min followers">
          {getFieldDecorator('minFollowers', {
            rules: [
              {
                required: true,
                message: 'Please set minimal followers count for eligible users!',
              },
              {
                validator: this.checkFollowersQuantity,
              },
            ],
          })(<Input type="number" />)}
        </Form.Item>
        <Form.Item label="Min # of posts">
          {getFieldDecorator('minPosts', {
            rules: [
              {
                required: true,
                message: 'Please set minimal posts count for eligible users!',
              },
            ],
          })(<Input type="number" />)}
        </Form.Item>
        <Button type="primary" onClick={this.toggleModalEligibleUsers}>
          Show eligible users
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
        <Form.Item label="Note to reviewers">
          {getFieldDecorator('description', {
            rules: [
              {
                max: 250,
                message: 'Campaign description should be no longer then 50 symbols!',
              },
              {
                required: true,
                message: 'Please set minimal followers count for eligible users!',
              },
            ],
          })(<Input.TextArea />)}
        </Form.Item>
        <Form.Item label="Expired automatically at">
          {getFieldDecorator('expiredAt', {
            rules: [
              {
                type: 'object',
                required: true,
                message: 'Please select time!',
              },
              {
                validator: this.checkExpireDate,
              },
            ],
          })(<DatePicker />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('agreement', {
            valuePropName: 'checked',
          })(
            <Checkbox>
              I have read the <a href="">agreement</a>
            </Checkbox>,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save changes
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default CreateRewardForm;
