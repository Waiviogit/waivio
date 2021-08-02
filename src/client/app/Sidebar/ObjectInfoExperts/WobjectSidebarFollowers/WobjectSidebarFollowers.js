import { Icon } from 'antd';
import { map, size } from 'lodash';
import * as React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';

import UserCard from '../../../../components/UserCard';
import WeightTag from '../../../../components/WeightTag';

import './WobjectSidebarFollowers.less';

const WobjectSidebarFollowers = ({
  isCenterContent,
  match,
  history,
  followers,
  wobject,
  followUser,
  unfollowUser,
  hasMore,
}) => {
  const handleRedirectToFollowers = () => {
    if (isCenterContent) history.push(`${match.url.replace(/\/[^/]+$/, '')}/followers`);
  };

  const follow = user => followUser(user);

  const unfollow = user => unfollowUser(user);

  return (
    !!size(followers) && (
      <div className="SidebarContentBlock SidebarContentFollowers">
        <h4 className="SidebarContentBlock__title" onClick={handleRedirectToFollowers}>
          {!isCenterContent && <Icon type="team" />}{' '}
          <FormattedMessage id="followers" defaultMessage="Followers" />
        </h4>
        <div className="SidebarContentBlock__content">
          {map(followers, follower => (
            <UserCard
              user={follower}
              showFollow={isCenterContent}
              key={follower.name}
              follow={follow}
              unfollow={unfollow}
              alt={<WeightTag weight={follower.weight} />}
            />
          ))}
          {!isCenterContent && hasMore && (
            <h4 className="ObjectExpertise__more">
              <Link to={`/object/${wobject.author_permlink}/followers`}>
                <FormattedMessage id="show_more" defaultMessage="Show more" />
              </Link>
            </h4>
          )}
        </div>
      </div>
    )
  );
};

WobjectSidebarFollowers.propTypes = {
  isCenterContent: PropTypes.bool,
  match: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  wobject: PropTypes.shape().isRequired,
  followers: PropTypes.arrayOf(PropTypes.shape()),
  followUser: PropTypes.func.isRequired,
  unfollowUser: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired,
};

WobjectSidebarFollowers.defaultProps = {
  followers: [],
  isCenterContent: false,
};

export default injectIntl(withRouter(WobjectSidebarFollowers));
