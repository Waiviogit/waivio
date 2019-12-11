import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Form } from 'antd';
import { FormattedMessage } from 'react-intl';

import LikeSection from './LikeSection';
import FollowObjectForm from './FollowObjectForm';
import { getVoteValue } from '../helpers/user';
import {
  getObject,
  getFollowingObjectsList,
  getVotingPower,
  getRewardFund,
  getRate,
  getVotePercent,
  getAuthenticatedUser,
} from '../reducers';

const AppendFormFooter = ({ loading, form, handleSubmit }) => {
  const [isSliderVisible, setSliderVisibility] = useState(false);
  const [votePercent, setVotePercent] = useState(useSelector(getVotePercent));
  const [voteWorth, setVoteWorth] = useState(0);

  const user = useSelector(getAuthenticatedUser);
  const followingList = useSelector(getFollowingObjectsList);
  const wObject = useSelector(getObject);
  const sliderMode = useSelector(getVotingPower);
  const rewardFund = useSelector(getRewardFund);
  const rate = useSelector(getRate);

  const { getFieldValue } = form;

  const calculateVoteWorth = votePercentValue => {
    const voteWorthValue = getVoteValue(
      user,
      rewardFund.recent_claims,
      rewardFund.reward_balance,
      rate,
      votePercentValue * 100,
    );
    setVotePercent(votePercentValue);
    setVoteWorth(voteWorthValue);
  };

  useEffect(() => {
    if (sliderMode && !isSliderVisible) {
      setSliderVisibility(!isSliderVisible);
    }
    calculateVoteWorth(votePercent);
  }, []);

  const handleLikeClick = () => {
    setSliderVisibility(sliderMode);
  };

  return (
    <React.Fragment>
      <LikeSection
        onVotePercentChange={calculateVoteWorth}
        votePercent={votePercent}
        voteWorth={voteWorth}
        form={form}
        sliderVisible={isSliderVisible}
        onLikeClick={handleLikeClick}
        disabled={loading}
      />

      {followingList.includes(wObject.author_permlink) ? null : (
        <FollowObjectForm loading={loading} form={form} />
      )}

      {getFieldValue('currentField') !== 'auto' && (
        <Form.Item className="AppendForm__bottom__submit">
          <Button type="primary" loading={loading} disabled={loading} onClick={handleSubmit}>
            <FormattedMessage
              id={loading ? 'post_send_progress' : 'append_send'}
              defaultMessage={loading ? 'Submitting' : 'Suggest'}
            />
          </Button>
        </Form.Item>
      )}
    </React.Fragment>
  );
};

AppendFormFooter.propTypes = {
  loading: PropTypes.bool.isRequired,
  form: PropTypes.shape().isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default AppendFormFooter;
