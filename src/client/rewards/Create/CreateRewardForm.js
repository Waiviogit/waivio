import React from 'react';

import { Form, Input, Select, Checkbox, Button, DatePicker } from 'antd';
import * as ApiClient from '../../../waivioApi/ApiClient';

const { Option } = Select;

@Form.create()
class CreateRewardForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        ApiClient.createCampaign(this.prepareSubmitData(values)).then(data => {
          this.setState({ propositions: data.campaigns, hasMore: data.hasMore });
        });
        console.log('Received values of form: ', values);
      }
    });
  };

  prepareSubmitData = data => {
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
      objects: [
        // "smk-seafood-udon",
        // "kzo-chronic-tacos-granville"
        // // 'xjn-chicken-katsu',
        // // 'cga-french-toast'
      ],
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
  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
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
        <Form.Item label="Status">
          {getFieldDecorator('status', {
            rules: [{ required: true, message: 'Please select your campaign status!' }],
          })(
            <Select
              placeholder="Select a option and change input text above"
              onChange={this.handleSelectChange}
            >
              <Option value="inactive">Inactive</Option>
              <Option value="active">Active</Option>
              <Option value="deleted">Deleted</Option>
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Budget">
          {getFieldDecorator('budget', {
            rules: [
              {
                required: true,
                message: 'Please set your monthly budget!',
              },
              // {
              //   validator: val => val <= 5000,
              //   message: '5000 max!',
              // },
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
        RewiewRequirements:
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
        Req obj-------------------------------
        <br />
        Eligible users:
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
        <Form.Item {...tailFormItemLayout}>
          {getFieldDecorator('agreement', {
            valuePropName: 'checked',
          })(
            <Checkbox>
              I have read the <a href="">agreement</a>
            </Checkbox>,
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Save changes
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default CreateRewardForm;
