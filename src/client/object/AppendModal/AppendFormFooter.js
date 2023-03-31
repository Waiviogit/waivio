import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Form } from 'antd';
import { FormattedMessage } from 'react-intl';

import LikeSection from '../LikeSection';
import FollowObjectForm from '../FollowObjectForm';
import { getFollowingObjectsList } from '../../../store/userStore/userSelectors';
import { getObject } from '../../../store/wObjectStore/wObjectSelectors';
import { getVotingPower } from '../../../store/settingsStore/settingsSelectors';
import { checkUserInObjWhiteList } from '../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

const AppendFormFooter = ({
  loading,
  form,
  handleSubmit,
  calcVote,
  votePercent,
  voteWorth,
  selectWobj,
  disabled,
}) => {
  const [isSliderVisible, setSliderVisibility] = useState(false);
  const [inWhiteList, setInWhiteList] = useState(false);
  const followingList = useSelector(getFollowingObjectsList);
  const wObject = useSelector(getObject);
  const sliderMode = useSelector(getVotingPower);
  const authUser = useSelector(getAuthenticatedUserName);
  const { getFieldValue } = form;

  const calculateVoteWorth = (percent, worth) => {
    calcVote(percent, worth);
  };

  useEffect(() => {
    if (sliderMode && !isSliderVisible) {
      setSliderVisibility(!isSliderVisible);
    }
    checkUserInObjWhiteList(authUser).then(res => {
      setInWhiteList(res);
    });
  }, []);

  const handleLikeClick = () => {
    setSliderVisibility(sliderMode);
  };

  const littleVotePower = inWhiteList ? false : voteWorth < 0.001;

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
        selectedType={selectWobj}
      />
      {littleVotePower && (
        <div
          style={{
            color: 'red',
            textAlign: 'center',
            paddingTop: '10px',
          }}
        >
          Your vote power is less than $0.001 in WAIV token. To continue, please deselect the
          &quot;Like&quot; checkbox and add the update without a like.
        </div>
      )}
      {followingList.includes(wObject.author_permlink) ? null : (
        <FollowObjectForm loading={loading} form={form} />
      )}

      {getFieldValue('currentField') !== 'auto' && (
        <Form.Item className="AppendForm__bottom__submit">
          <Button
            className="AppendForm__submit"
            type="primary"
            loading={loading}
            disabled={littleVotePower || loading || disabled}
            onClick={handleSubmit}
          >
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
  disabled: PropTypes.bool.isRequired,
  form: PropTypes.shape().isRequired,
  selectWobj: PropTypes.shape().isRequired,
  handleSubmit: PropTypes.func.isRequired,
  calcVote: PropTypes.func.isRequired,
  votePercent: PropTypes.number.isRequired,
  voteWorth: PropTypes.number.isRequired,
};

export default AppendFormFooter;
