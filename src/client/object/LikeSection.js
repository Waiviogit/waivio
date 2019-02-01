import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Form } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import RawSlider from '../components/Slider/RawSlider';
import './LikeSection.less';

const LikeSection = ({
  voteWorth,
  votePercent,
  onVotePercentChange,
  form,
  onLikeClick,
  sliderVisible,
  intl,
}) => (
  <div className="LikeSection">
    <Form.Item>
      {form.getFieldDecorator('like', {
        valuePropName: 'checked',
        initialValue: true,
        rules: [
          {
            required: true,
            transform: value => value || undefined,
            type: 'boolean',
            message: intl.formatMessage({
              id: 'need_like',
              defaultMessage: 'Field is required',
            }),
          },
        ],
      })(
        <Checkbox onChange={onLikeClick}>
          {intl.formatMessage({ id: 'like', defaultMessage: 'Like' })}
        </Checkbox>,
      )}
    </Form.Item>

    {form.getFieldValue('like') && sliderVisible && (
      <React.Fragment>
        <div className="like-slider">
          <RawSlider min={1} initialValue={votePercent} onChange={onVotePercentChange} />
        </div>
        <div className="like-worth">
          <FormattedMessage
            id="vote_worth"
            defaultMessage="Vote worth {value}"
            values={{
              value: voteWorth.toFixed(3),
            }}
          />
        </div>
      </React.Fragment>
    )}

    <div className="warning-wrapper">
      <FormattedMessage
        id="warning_message"
        defaultMessage="Object updates are posted by Waivio Bots in order to avoid technical posts in user feeds and spending limited resource credits on multiple posts by users, authors are required to upvote updates with voting power that should generate an equivalent of at least $0.001 to ensure validity of the posted content. Users receive 70% of author rewards in addition to standard curation rewards."
      />
    </div>
  </div>
);

LikeSection.propTypes = {
  voteWorth: PropTypes.number.isRequired,
  votePercent: PropTypes.number.isRequired,
  form: PropTypes.shape().isRequired,
  sliderVisible: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
  onVotePercentChange: PropTypes.func.isRequired,
  onLikeClick: PropTypes.func.isRequired,
};

export default injectIntl(LikeSection);
