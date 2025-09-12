import React from 'react';
import PropTypes from 'prop-types';
import { size } from 'lodash';
import { useLocation } from 'react-router';
import InterestingObjects from '../../components/Sidebar/InterestingObjects';
import InterestingPeople from '../../components/Sidebar/InterestingPeople';
import ObjectWeightBlock from '../../components/Sidebar/ObjectWeightBlock';
import EarnsCommissionsOnPurchases from '../../statics/EarnsCommissionsOnPurchases';

const UserSidebar = ({ authenticated, isGuest, content, authUserName, match, locale }) => {
  const { pathname } = useLocation();

  if (authenticated && isGuest && !size(content)) {
    return (
      <React.Fragment>
        <InterestingObjects />
        <InterestingPeople />
        {pathname?.includes('/favorites') && <EarnsCommissionsOnPurchases />}
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <ObjectWeightBlock username={match.params.name} authUser={authUserName} locale={locale} />
      {pathname?.includes('/favorites') && <EarnsCommissionsOnPurchases />}
    </React.Fragment>
  );
};

UserSidebar.propTypes = {
  authenticated: PropTypes.bool,
  isGuest: PropTypes.bool,
  content: PropTypes.arrayOf(PropTypes.string),
  match: PropTypes.shape(),
  authUserName: PropTypes.string,
  locale: PropTypes.string,
};

UserSidebar.defaultProps = {
  authenticated: false,
  isGuest: false,
  content: [],
  match: {},
  authUserName: '',
  locale: 'en-US',
};

export default UserSidebar;
