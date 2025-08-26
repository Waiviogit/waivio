import React from 'react';
import { Tooltip } from 'antd';
import { injectIntl } from 'react-intl';
import Cookie from 'js-cookie';
import { useDispatch } from 'react-redux';
import { ReactSVG } from 'react-svg';
import PropTypes from 'prop-types';
import { unpinUserPost } from '../../store/postsStore/postActions';

const PinButton = ({
  tooltipTitle,
  intl,
  currentUserPin,
  pinClassName,
  handlePinPost,
  post,
  pinnedPostsUrls,
  user,
  match,
  wobject,
  userVotingPower,
  disabled = false,
  isUserPin = false,
}) => {
  const dispatch = useDispatch();
  const hiveAuth = Cookie.get('auth');

  const pinPost = () => {
    if (!disabled) {
      if (isUserPin) {
        dispatch(unpinUserPost(user, hiveAuth, intl));
      } else {
        handlePinPost(post, pinnedPostsUrls, user, match, wobject, userVotingPower);
      }
    }
  };

  return (
    <Tooltip
      placement="topLeft"
      title={tooltipTitle}
      overlayClassName="HeartButtonContainer"
      overlayStyle={{ top: '10px' }}
      disabled={disabled}
    >
      <ReactSVG
        className={currentUserPin ? 'pin-website-color' : pinClassName}
        wrapper="span"
        src="/images/icons/pin-outlined.svg"
        onClick={pinPost}
        style={{ cursor: 'pointer' }}
      />
    </Tooltip>
  );
};

PinButton.propTypes = {
  post: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  wobject: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  pinnedPostsUrls: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  tooltipTitle: PropTypes.string.isRequired,
  userVotingPower: PropTypes.number.isRequired,
  user: PropTypes.string.isRequired,
  pinClassName: PropTypes.string.isRequired,
  currentUserPin: PropTypes.bool.isRequired,
  isUserPin: PropTypes.bool,
  disabled: PropTypes.bool,
  handlePinPost: PropTypes.func.isRequired,
};

export default injectIntl(PinButton);
