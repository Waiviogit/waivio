import React from 'react';
import WaivioObject from './WaivioObject';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import * as ApiClient from '../../waivioApi/ApiClient';
import Loading from '../components/Icon/Loading';

const displayLimit = 30;

export default class ObjectContent extends React.Component {
  state = {
    wobjs: [],
    loading: false,
    hasMore: true,
  };

  componentDidMount() {
    ApiClient.getObjects({ limit: displayLimit }).then(wobjs => {
      this.setState({ wobjs });
    });
  }

  handleLoadMore = () => {
    const { wobjs } = this.state;

    this.setState(
      {
        loading: true,
      },
      () => {
        const lastWobject = wobjs[wobjs.length - 1];

        ApiClient.getObjects({
          limit: displayLimit,
          startAuthorPermlink: lastWobject.author_permlink,
        }).then(newWobjs =>
          this.setState(state => ({
            loading: false,
            hasMore: newWobjs.length === displayLimit,
            wobjs: state.wobjs.concat(newWobjs),
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
