import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Select, Checkbox, Button, DatePicker } from 'antd';
import * as ApiClient from '../../../waivioApi/ApiClient';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../objectCard/ObjectCardView';

const { Option } = Select;

@Form.create()
class CreateRewardForm extends React.Component {
  static propTypes = {
    userName: PropTypes.string,
    form: PropTypes.shape().isRequired,
  };
  static defaultProps = {
    userName: '',
  };
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    objectsToAction: [],
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        ApiClient.createCampaign(this.prepareSubmitData(values)).then(data => {
          this.setState({ propositions: data.campaigns, hasMore: data.hasMore });
        });
      }
    });
  };

  prepareSubmitData = data => {
    const objects = _.map(this.state.objectsToAction, o => o.id);
    const finalData = {
      guideName: this.props.userName,
      name: data.campaignName,
      description: data.description,
      type: data.type,
      budget: data.budget,
      reward: data.reward,
      requirements: { minPhotos: data.minPhotos },
      userRequirements: {
        minFollowers: data.minFollowers,
        minPosts: data.maxReviews,
      },
      objects,
      expired_at: data.expiredAt.format(),
    };
    console.log('Received values of form: ', finalData);
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

  render() {
    const { getFieldDecorator } = this.props.form;
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
                max: 50,
                message: 'Campaign name must be no longer then 50 symbols!',
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
              // {
              //   validator: val => val <= 500,
              //   message: 'Please should not be more then 500',
              // },
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
            ],
          })(<Input type="number" />)}
          Days
        </Form.Item>
        <div className="CreateReward__block-title">RewiewRequirements:</div>
        <Form.Item label="Min # of original photos">
          {getFieldDecorator('minPhotos', {
            rules: [
              {
                required: true,
                message: 'Please set minimal count of photos!',
              },
            ],
          })(<Input type="number" />)}
          per review
        </Form.Item>
        Required objects
        <SearchObjectsAutocomplete
          allowClear={false}
          itemsIdsToOmit={[]}
          style={{ width: '100%' }}
          placeholder="Please select"
          handleSelect={this.handleAddObjectToList}
        />
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
            ],
          })(<Input type="number" />)}
        </Form.Item>
        <Form.Item label="Max # of reviews">
          {getFieldDecorator('maxReviews', {
            rules: [
              {
                required: true,
                message: 'Please set maximal count of reviews for one user!',
              },
            ],
          })(<Input type="number" />)}
          per month
        </Form.Item>
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
            rules: [{ type: 'object', required: true, message: 'Please select time!' }],
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
