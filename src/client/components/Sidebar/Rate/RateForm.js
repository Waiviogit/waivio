import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Form, message, Rate } from 'antd';
import { rateObject } from '../../../object/wobjActions';
import { ratePercent, ratingFields } from '../../../../common/constants/listOfFields';
import StarRating from './StarRating';
import './RateForm.less';

@connect(null, {
  rateObject,
})
@injectIntl
@Form.create()
class RateForm extends React.Component {
  static propTypes = {
    /* from decorators */
    form: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    /* from connect */
    rateObject: PropTypes.func.isRequired,
    /* passed props */
    authorPermlink: PropTypes.string.isRequired,
    field: PropTypes.shape().isRequired,
    initialValue: PropTypes.number,
    ownRatesOnly: PropTypes.bool,
    username: PropTypes.string.isRequired,
  };

  static defaultProps = {
    initialValue: 0,
    ownRatesOnly: false,
  };

  state = {
    loading: false,
    submitted: false,
    vote: {},
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
      this.setState({
        loading: false,
        submitted: true,
        vote: { voter: this.props.username, rate: ratePercent[rate - 1] },
      });
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
    const { loading, submitted, vote } = this.state;
    const { intl, ownRatesOnly, username, initialValue, field } = this.props;

    if (submitted) {
      if (!field.rating_votes) {
        field.rating_votes = [];
      }

      const previousVoteIndex = field.rating_votes.findIndex(v => v.voter === username);

      if (previousVoteIndex === -1) {
        field.rating_votes.push(vote);
      } else {
        field.rating_votes[previousVoteIndex] = vote;
      }
    }

    return !submitted ? (
      <React.Fragment>
        <div className="RateForm">
          <Form layout="inline" onSubmit={this.handleSubmit} className="RateForm__form">
            <div>{intl.formatMessage({ id: 'your_vote', defaultMessage: 'Your vote' })}</div>
            <Form.Item>
              {getFieldDecorator(ratingFields.rate, {
                initialValue,
              })(<Rate disabled={loading} allowClear={false} />)}
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
        {!ownRatesOnly && !!initialValue && <StarRating field={field} />}
      </React.Fragment>
    ) : (
      <div className="RateForm__full">
        <div>
          {intl.formatMessage({
            id: 'thank_for_vote',
            defaultMessage: 'Thank you for your vote!',
          })}
        </div>
        {!ownRatesOnly && <StarRating field={field} />}
      </div>
    );
  }
}

export default RateForm;
