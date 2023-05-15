import { isEmpty, map, slice, size } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import UserCard from '../../UserCard';
import WeightTag from '../../WeightTag';
import RightSidebarLoading from '../../../app/Sidebar/RightSidebarLoading';

import '../ObjectExpertise.less';

const ObjectExpertise = ({
  users,
  isLoading,
  wobject,
  match,
  isCenterContent,
  history,
  unfollowExpert,
  followExpert,
}) => {
  const handleRedirectToExperts = () => {
    if (isCenterContent) history.push(`${match.url.replace(/\/[^/]+$/, '')}/expertise`);
  };

  const follow = userExpert => followExpert(userExpert, followExpert);

  const unFollow = userExpert => unfollowExpert(userExpert, unfollowExpert);

  let renderExperts = null;

  if (isLoading) {
    renderExperts = <RightSidebarLoading />;
  } else if (!isLoading && !isEmpty(users)) {
    renderExperts = (
      <div className="SidebarContentBlock">
        <h4 className="SidebarContentBlock__title" onClick={handleRedirectToExperts}>
          {!isCenterContent && <i className="iconfont icon-collection SidebarContentBlock__icon" />}{' '}
          <FormattedMessage id="object_expertise" defaultMessage="Experts" />
        </h4>
        <div className="SidebarContentBlock__content">
          {users &&
            map(slice(users, 0, 5), user => (
              <UserCard
                key={user.name}
                user={user}
                showFollow={isCenterContent}
                follow={follow}
                unfollow={unFollow}
                alt={<WeightTag weight={user.weight} />}
              />
            ))}
          {size(users) > 5 && (
            <React.Fragment>
              <h4 className="ObjectExpertise__more">
                <Link to={`/object/${wobject.author_permlink}/expertise`}>
                  <FormattedMessage id="show_more_authors" defaultMessage="Show more authors" />
                </Link>
              </h4>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }

  return renderExperts;
};

ObjectExpertise.propTypes = {
  wobject: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  isCenterContent: PropTypes.bool,
  followExpert: PropTypes.func.isRequired,
  unfollowExpert: PropTypes.func.isRequired,
};

ObjectExpertise.defaultProps = {
  isCenterContent: false,
};

export default withRouter(ObjectExpertise);
