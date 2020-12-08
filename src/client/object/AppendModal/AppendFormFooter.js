import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Form } from 'antd';
import { FormattedMessage } from 'react-intl';

import LikeSection from '../LikeSection';
import FollowObjectForm from '../FollowObjectForm';
import { getObject, getFollowingObjectsList, getVotingPower } from '../../reducers';

const AppendFormFooter = ({ loading, form, handleSubmit, calcVote, votePercent, voteWorth }) => {
  const [isSliderVisible, setSliderVisibility] = useState(false);
  const followingList = useSelector(getFollowingObjectsList);
  const wObject = useSelector(getObject);
  const sliderMode = useSelector(getVotingPower);
  const { getFieldValue } = form;

  const calculateVoteWorth = percent => {
    calcVote(percent);
  };

  useEffect(() => {
    if (sliderMode && !isSliderVisible) {
      setSliderVisibility(!isSliderVisible);
    }
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
  calcVote: PropTypes.func.isRequired,
  votePercent: PropTypes.number.isRequired,
  voteWorth: PropTypes.number.isRequired,
};

export default AppendFormFooter;
