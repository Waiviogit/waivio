import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Form, message, Rate } from 'antd';
import { rateObject } from '../../../object/wobjActions';
import { ratePercent, ratingFields } from '../../../../common/constants/listOfFields';
import './RateForm.less';

@connect(
  null,
  {
    rateObject,
  },
)
@injectIntl
@Form.create()
class RateForm extends React.Component {
  static propTypes = {
    form: PropTypes.shape().isRequired,
    field: PropTypes.shape().isRequired,
    rateObject: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    initialValue: PropTypes.number,
  };

  static defaultProps = {
    initialValue: 0,
  };

  state = {
    loading: false,
    submitted: false,
  };

  handleSubmit = async e => {
    e.preventDefault();

    const { getFieldValue } = this.props.form;
    const rate = getFieldValue(ratingFields.rate);

    if (!rate) {
      return;
    }

    this.setState({ loading: true });

    const { author, permlink } = this.props.field;
    const { authorPermlink } = this.props;

    try {
      await this.props.rateObject(author, permlink, authorPermlink, ratePercent[rate - 1]);
      this.setState({ loading: false, submitted: true });
    } catch (error) {
      message.error(
        this.props.intl.formatMessage({
          id: 'rate_vote_error',
          defaultMessage: "Couldn't rate a vote.",
        }),
      );

      this.setState({ loading: false, submitted: false });
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, submitted } = this.state;
    const { intl } = this.props;

    return !submitted ? (
      <div className="RateForm">
        <Form layout="inline" onSubmit={this.handleSubmit} className="RateForm__form">
          <div>{intl.formatMessage({ id: 'your_vote', defaultMessage: 'Your vote' })}</div>
          <Form.Item>
            {getFieldDecorator(ratingFields.rate, {
              initialValue: this.props.initialValue || 0,
            })(<Rate allowClear={false} />)}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {intl.formatMessage({
                id: loading ? 'post_send_progress' : 'append_send',
                defaultMessage: loading ? 'Submitting' : 'Submit',
              })}
            </Button>
          </Form.Item>
        </Form>
      </div>
    ) : (
      <div>
        {intl.formatMessage({
          id: 'thank_for_vote',
          defaultMessage: 'Thank you for your vote!',
        })}
      </div>
    );
  }
}

export default RateForm;
