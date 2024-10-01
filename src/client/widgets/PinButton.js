import React from 'react';
import { Tooltip } from 'antd';
import { ReactSVG } from 'react-svg';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { setAuthorityForObject } from '../../store/appendStore/appendActions';

const PinButton = ({
  tooltipTitle,
  currentUserPin,
  pinClassName,
  handlePinPost,
  post,
  pinnedPostsUrls,
  user,
  match,
  wobject,
  userVotingPower,
}) => {
  const dispatch = useDispatch();
  const pinPost = () => {
    dispatch(setAuthorityForObject(wobject, match));
    handlePinPost(post, pinnedPostsUrls, user, match, wobject, userVotingPower);
  };

  return (
    <Tooltip
      placement="topLeft"
      title={tooltipTitle}
      overlayClassName="HeartButtonContainer"
      overlayStyle={{ top: '10px' }}
    >
      <ReactSVG
        className={currentUserPin ? 'pin-website-color' : pinClassName}
        wrapper="span"
        src="/images/icons/pin-outlined.svg"
        onClick={pinPost}
      />
    </Tooltip>
  );
};

PinButton.propTypes = {
  post: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  wobject: PropTypes.shape().isRequired,
  pinnedPostsUrls: PropTypes.arrayOf().isRequired,
  tooltipTitle: PropTypes.string.isRequired,
  userVotingPower: PropTypes.number.isRequired,
  user: PropTypes.string.isRequired,
  pinClassName: PropTypes.string.isRequired,
  currentUserPin: PropTypes.bool.isRequired,
  handlePinPost: PropTypes.func.isRequired,
};

export default PinButton;
