import React from 'react';
import PropTypes from 'prop-types';
import { size, isEmpty } from 'lodash';
import InterestingObjects from '../../components/Sidebar/InterestingObjects';
import InterestingPeople from '../../components/Sidebar/InterestingPeople';
import ObjectWeightBlock from '../../components/Sidebar/ObjectWeightBlock';
import UserSidebarFilter from '../../components/Sidebar/SidebarMenu/UserSidebarFilter';

const UserSidebar = ({ authenticated, isGuest, content, authUserName, match, locale, filters }) => {
  if (authenticated && isGuest && !size(content)) {
    return (
      <React.Fragment>
        <InterestingObjects />
        <InterestingPeople />
      </React.Fragment>
    );
  }

  return (
    authenticated && (
      <React.Fragment>
        {!isEmpty(filters) && <UserSidebarFilter username={match.params.name} />}
        <ObjectWeightBlock username={match.params.name} authUser={authUserName} locale={locale} />
      </React.Fragment>
    )
  );
};

UserSidebar.propTypes = {
  authenticated: PropTypes.bool,
  isGuest: PropTypes.bool,
  content: PropTypes.shape(),
  match: PropTypes.shape(),
  authUserName: PropTypes.string,
  locale: PropTypes.string,
  filters: PropTypes.shape(),
};

UserSidebar.defaultProps = {
  authenticated: false,
  isGuest: false,
  content: {},
  match: {},
  authUserName: '',
  locale: 'en-US',
  filters: [],
};

export default UserSidebar;
