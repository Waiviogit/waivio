import React from 'react';
import PropTypes from 'prop-types';
import WaivioObject from './WaivioObject';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import * as ApiClient from '../../waivioApi/ApiClient';
import Loading from '../components/Icon/Loading';

const displayLimit = 30;

export default class ObjectList extends React.Component {
  static propTypes = {
    isOnlyHashtags: PropTypes.bool,
  };
  static defaultProps = {
    isOnlyHashtags: false,
  };
  state = {
    wobjs: [],
    loading: false,
    hasMore: true,
    isOnlyHashtags: false,
  };

  componentDidMount() {
    ApiClient.getObjects({ limit: displayLimit, isOnlyHashtags: this.props.isOnlyHashtags }).then(
      wobjs => {
        this.setState({ wobjs: wobjs.wobjects });
      },
    );
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
        {wobjs.length && wobjs.map(wobj => <WaivioObject wobj={wobj} key={wobj.author_permlink} />)}
      </ReduxInfiniteScroll>
    );
  }
}
