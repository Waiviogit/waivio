import React from 'react';
import { message } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import { union, map, get } from 'lodash';

import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import ObjectCard from '../components/Sidebar/ObjectCard';
import Loading from '../components/Icon/Loading';
import WeightTag from '../components/WeightTag';
import { followWobject, unfollowWobject } from '../store/wObjectStore/wobjActions';
import { changeCounterFollow } from '../store/usersStore/usersActions';
import { getAuthenticatedUserName, isGuestUser } from '../store/authStore/authSelectors';

import './ObjectDynamicList.less';

class ObjectDynamicList extends React.Component {
  static propTypes = {
    fetcher: PropTypes.func.isRequired,
    isOnlyHashtags: PropTypes.bool,
    expertize: PropTypes.bool,
    unfollowWobj: PropTypes.func,
    followWobj: PropTypes.func,
    changeCounterFollow: PropTypes.func,
    isGuest: PropTypes.bool,
    authUser: PropTypes.string,
    limit: PropTypes.string,
    match: PropTypes.shape({
      params: PropTypes.shape({
        name: PropTypes.string,
      }),
    }).isRequired,
  };

  static defaultProps = {
    isOnlyHashtags: false,
    expertize: false,
    unfollowWobj: () => {},
    followWobj: () => {},
    changeCounterFollow: () => {},
    isGuest: false,
    authUser: '',
    limit: 15,
  };

  state = {
    loading: false,
    hasMore: true,
    wobjects: [],
  };

  handleLoadMore = () => {
    const { fetcher, isOnlyHashtags, authUser, limit } = this.props;
    const { wobjects } = this.state;

    this.setState(
      {
        loading: true,
      },
      () => {
        fetcher(wobjects.length, authUser, isOnlyHashtags).then(newWobjects => {
          const wobjs = get(newWobjects, 'wobjects') || newWobjects;

          this.setState(state => ({
            loading: false,
            hasMore: newWobjects.hasMore || newWobjects.length === limit,
            wobjects: union(state.wobjects, wobjs),
          }));
        });
      },
    );
  };

  unFollow = permlink => {
    const matchWobjIndex = this.state.wobjects.findIndex(wobj => wobj.author_permlink === permlink);
    const wobjectsArray = [...this.state.wobjects];

    wobjectsArray.splice(matchWobjIndex, 1, {
      ...wobjectsArray[matchWobjIndex],
      pending: true,
    });

    this.setState({ wobjects: [...wobjectsArray] });
    this.props.unfollowWobj(permlink).then(res => {
      if ((res.value.ok && this.props.isGuest) || !res.message) {
        wobjectsArray.splice(matchWobjIndex, 1, {
          ...wobjectsArray[matchWobjIndex],
          youFollows: false,
          pending: false,
        });
      } else {
        message.error(res.value.statusText);
        wobjectsArray.splice(matchWobjIndex, 1, {
          ...wobjectsArray[matchWobjIndex],
          pending: false,
        });
      }
      this.props.changeCounterFollow(this.props.match.params.name, 'object');
      this.setState({ wobjects: [...wobjectsArray] });
    });
  };

  follow = permlink => {
    const matchWobjectIndex = this.state.wobjects.findIndex(
      wobj => wobj.author_permlink === permlink,
    );
    const wobjectsArray = [...this.state.wobjects];

    wobjectsArray.splice(matchWobjectIndex, 1, {
      ...wobjectsArray[matchWobjectIndex],
      pending: true,
    });

    this.setState({ wobjects: [...wobjectsArray] });
    this.props.followWobj(permlink).then(res => {
      if ((this.props.isGuest && res.value.ok) || !res.message) {
        wobjectsArray.splice(matchWobjectIndex, 1, {
          ...wobjectsArray[matchWobjectIndex],
          youFollows: true,
          pending: false,
        });
      } else {
        message.error(res.value.statusText);
        wobjectsArray.splice(matchWobjectIndex, 1, {
          ...wobjectsArray[matchWobjectIndex],
          pending: false,
        });
      }
      this.props.changeCounterFollow(this.props.match.params.name, 'object', true);
      this.setState({ wobjects: [...wobjectsArray] });
    });
  };

  render() {
    const { loading, hasMore, wobjects } = this.state;
    const empty = !hasMore && wobjects.length === 0;
    const getWeight = wo => (this.props.expertize ? wo.user_weight : wo.weight);

    return (
      <div className="ObjectDynamicList">
        <ReduxInfiniteScroll
          elementIsScrollable={false}
          loadingMore={loading}
          hasMore={hasMore}
          loader={<Loading />}
          loadMore={this.handleLoadMore}
        >
          {map(wobjects, wo => (
            <ObjectCard
              key={wo.author_permlink}
              wobject={wo}
              alt={<WeightTag weight={getWeight(wo)} />}
              unfollow={this.unFollow}
              follow={this.follow}
            />
          ))}
        </ReduxInfiniteScroll>
        {empty && (
          <div className="ObjectDynamicList__empty">
            <FormattedMessage id="list_empty" defaultMessage="Nothing is there" />
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      isGuest: isGuestUser(state),
      authUser: getAuthenticatedUserName(state),
    }),
    {
      followWobj: followWobject,
      unfollowWobj: unfollowWobject,
      changeCounterFollow,
    },
  )(ObjectDynamicList),
);
