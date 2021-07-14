import React from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import { connect } from 'react-redux';

import WaivioObject from './WaivioObject';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import * as ApiClient from '../../waivioApi/ApiClient';
import Loading from '../components/Icon/Loading';
import { followWobject, unfollowWobject } from '../../store/wObjectStore/wobjActions';
import { getAuthenticatedUserName, isGuestUser } from '../../store/authStore/authSelectors';
import { getLocale } from '../../store/settingsStore/settingsSelectors';

const displayLimit = 30;

@connect(
  state => ({
    isGuest: isGuestUser(state),
    user: getAuthenticatedUserName(state),
    locale: getLocale(state),
  }),
  {
    followWobj: followWobject,
    unfollowWobj: unfollowWobject,
  },
)
export default class ObjectList extends React.Component {
  static propTypes = {
    isOnlyHashtags: PropTypes.bool,
    unfollowWobj: PropTypes.func,
    followWobj: PropTypes.func,
    isGuest: PropTypes.bool,
    user: PropTypes.string,
    locale: PropTypes.string.isRequired,
  };
  static defaultProps = {
    isOnlyHashtags: false,
    unfollowWobj: () => {},
    followWobj: () => {},
    isGuest: false,
    user: '',
  };
  state = {
    wobjs: [],
    loading: false,
    hasMore: true,
    isOnlyHashtags: false,
  };

  componentDidMount() {
    ApiClient.getObjects({
      limit: displayLimit,
      isOnlyHashtags: this.props.isOnlyHashtags,
      follower: this.props.user,
      locale: this.props.locale,
    }).then(wobjs => {
      this.setState({ wobjs: wobjs.wobjects });
    });
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.user && this.props.user) {
      ApiClient.getObjects({
        limit: displayLimit,
        isOnlyHashtags: this.props.isOnlyHashtags,
        follower: this.props.user,
        locale: this.props.locale,
      }).then(wobjs => {
        this.setState({ wobjs: wobjs.wobjects });
      });
    }
  }

  handleLoadMore = () => {
    const { wobjs } = this.state;

    this.setState(
      {
        loading: true,
      },
      () => {
        const skip = wobjs.length;

        ApiClient.getObjects({
          limit: displayLimit,
          skip,
          isOnlyHashtags: this.props.isOnlyHashtags,
          follower: this.props.user,
          locale: this.props.locale,
        }).then(newWobjs =>
          this.setState(state => ({
            loading: false,
            hasMore: newWobjs.wobjects.length === displayLimit,
            wobjs: state.wobjs.concat(newWobjs.wobjects),
          })),
        );
      },
    );
  };

  unFollow = permlink => {
    const matchWobjIndex = this.state.wobjs.findIndex(wobj => wobj.author_permlink === permlink);
    const wobjectsArray = [...this.state.wobjs];

    wobjectsArray.splice(matchWobjIndex, 1, {
      ...wobjectsArray[matchWobjIndex],
      pending: true,
    });

    this.setState({ wobjs: [...wobjectsArray] });
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

      this.setState({ wobjs: [...wobjectsArray] });
    });
  };

  follow = permlink => {
    const matchWobjectIndex = this.state.wobjs.findIndex(wobj => wobj.author_permlink === permlink);
    const wobjectsArray = [...this.state.wobjs];

    wobjectsArray.splice(matchWobjectIndex, 1, {
      ...wobjectsArray[matchWobjectIndex],
      pending: true,
    });

    this.setState({ wobjs: [...wobjectsArray] });
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

      this.setState({ wobjs: [...wobjectsArray] });
    });
  };

  render() {
    const { wobjs, loading, hasMore } = this.state;

    if (wobjs.length === 0) {
      return <Loading />;
    }

    return (
      <ReduxInfiniteScroll
        elementIsScrollable={false}
        hasMore={hasMore}
        loadMore={this.handleLoadMore}
        loadingMore={loading}
        loader={<Loading />}
      >
        {wobjs.length &&
          wobjs.map(wobj => (
            <WaivioObject
              wobj={wobj}
              key={wobj.author_permlink}
              unfollow={this.unFollow}
              follow={this.follow}
            />
          ))}
      </ReduxInfiniteScroll>
    );
  }
}
