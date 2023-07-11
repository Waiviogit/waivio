import React from 'react';
// import { Button } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import BellButton from '../../../widgets/BellButton';
import HeartButton from '../../../widgets/HeartButton';
import { accessTypesArr, haveAccess } from '../../../../common/helpers/wObjectHelper';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import FollowButton from '../../../widgets/FollowButton';
import { guestUserRegex } from '../../../../common/helpers/regexHelpers';
import { followWobject, unfollowWobject } from '../../../../store/wObjectStore/wobjActions';
import { getObject } from '../../../../store/wObjectStore/wObjectSelectors';

const SocialProductActions = ({
  wobject,
  username,
  authenticated,
  // intl,
  followWobj,
  unfollowWobj,
  // toggleViewEditMode,
  // isEditMode,
}) => {
  const accessExtend = haveAccess(wobject, username, accessTypesArr[0]);
  const heartObjTypes = ['book', 'product', 'service'].includes(wobject.object_type);
  const isGuest = guestUserRegex.test(username);

  return (
    <div className="ObjectHeader__controls">
      <FollowButton
        followObject={followWobj}
        unfollowObject={unfollowWobj}
        following={wobject.youFollows}
        wobj={wobject}
        followingType="wobject"
      />
      {accessExtend && authenticated && (
        <React.Fragment>
          {/* <Button onClick={toggleViewEditMode}> */}
          {/*  {isEditMode */}
          {/*    ? intl.formatMessage({ id: 'view', defaultMessage: 'View' }) */}
          {/*    : intl.formatMessage({ id: 'edit', defaultMessage: 'Edit' })} */}
          {/* </Button> */}
          {wobject.youFollows && <BellButton wobj={wobject} />}
        </React.Fragment>
      )}
      {heartObjTypes && authenticated && !isGuest && (
        <HeartButton wobject={wobject} size={'28px'} />
      )}
    </div>
  );
};

SocialProductActions.propTypes = {
  wobject: PropTypes.shape(),
  username: PropTypes.string,
  unfollowWobj: PropTypes.func,
  followWobj: PropTypes.func,
  // toggleViewEditMode: PropTypes.func,
  // isEditMode: PropTypes.bool,
  authenticated: PropTypes.bool,
  // intl: PropTypes.shape(),
};

const mapStateToProps = state => ({
  username: getAuthenticatedUserName(state),
  wobject: getObject(state),
});
const mapDispatchToProps = dispatch => ({
  followWobj: obj => dispatch(followWobject(obj)),
  unfollowWobj: obj => dispatch(unfollowWobject(obj)),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(SocialProductActions));
