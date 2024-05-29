import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import WobjHeader from './WobjHeader';
import UserHeaderLoading from '../components/UserHeaderLoading';
import ObjectMenu from '../components/ObjectMenu';
import { accessTypesArr, getObjectName, haveAccess } from '../../common/helpers/wObjectHelper';
import { getAuthenticatedUserName } from '../../store/authStore/authSelectors';

const WobjHero = ({
  isEditMode,
  authenticated,
  wobject,
  isFetching,
  isFollowing,
  toggleViewEditMode,
}) => {
  const username = useSelector(getAuthenticatedUserName);
  const accessExtend = haveAccess(wobject, getObjectName(wobject), accessTypesArr[0]);

  return (
    <React.Fragment>
      {isFetching ? (
        <UserHeaderLoading />
      ) : (
        <WobjHeader
          isEditMode={isEditMode}
          username={username}
          authenticated={authenticated}
          wobject={wobject}
          isFollowing={isFollowing}
          toggleViewEditMode={toggleViewEditMode}
        />
      )}
      <ObjectMenu
        accessExtend={accessExtend}
        followers={wobject.followers_count || 0}
        wobject={wobject}
      />
    </React.Fragment>
  );
};

WobjHero.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isEditMode: PropTypes.bool,
  isFollowing: PropTypes.bool,
  wobject: PropTypes.shape(),
  toggleViewEditMode: PropTypes.func,
};

WobjHero.defaultProps = {
  isEditMode: false,
  isFollowing: false,
  wobject: {},
  toggleViewEditMode: () => {},
};

export default WobjHero;
