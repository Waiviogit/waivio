import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Form } from 'antd';
import { FormattedMessage } from 'react-intl';
import RawSlider from '../components/Slider/RawSlider';
import './AppendForm.less';

const LikeSection = ({ voteWorth, votePercent, handleVotePercentChange, form }) => (
  <div className="like-wrapper">
    <Form.Item>
      {form.getFieldDecorator('like', {
        valuePropName: 'checked',
        initialValue: true,
      })(
        <Checkbox>
          <FormattedMessage id="like" defaultMessage="Like" />
        </Checkbox>,
      )}
    </Form.Item>

    {form.getFieldValue('like') && (
      <React.Fragment>
        <div className="like-slider">
          <RawSlider initialValue={votePercent} onChange={handleVotePercentChange} />
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
      <FormattedMessage id="warning_message" defaultMessage="Warning message" />
    </div>
  </div>
);

LikeSection.propTypes = {
  voteWorth: PropTypes.number.isRequired,
  votePercent: PropTypes.number.isRequired,
  handleVotePercentChange: PropTypes.func.isRequired,
  form: PropTypes.shape().isRequired,
};

export default LikeSection;
