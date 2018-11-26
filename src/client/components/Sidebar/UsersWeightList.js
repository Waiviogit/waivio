import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import UserWeight from './UserWeight';
import './InterestingObjects.less';
import './SidebarContentBlock.less';

const UsersWeightList = ({ users }) => (
  <div className="InterestingObjects SidebarContentBlock">
    <h4 className="SidebarContentBlock__title">
      <i className="iconfont icon-collection SidebarContentBlock__icon" />{' '}
      <FormattedMessage id="top_authors" defaultMessage="Top Authors" />
    </h4>
    <div className="SidebarContentBlock__content">
      {users && _.map(users, user => <UserWeight key={user.name} user={user} />)}
      <h4 className="InterestingPeople__more">
        <Link to={'/'}>
          <FormattedMessage id="show_more_authors" defaultMessage="Show more authors" />
        </Link>
      </h4>
    </div>
  </div>
);

UsersWeightList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({ tag: PropTypes.string })),
};

UsersWeightList.defaultProps = {
  users: [],
};

export default UsersWeightList;
