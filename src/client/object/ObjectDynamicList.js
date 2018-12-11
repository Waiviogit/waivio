import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import Loading from '../components/Icon/Loading';
import './ObjectDynamicList.less';
import ObjectComponent from '../components/Sidebar/ObjectComponent';

export default class ObjectDynamicList extends React.Component {
  static propTypes = {
    limit: PropTypes.number.isRequired,
    fetcher: PropTypes.func.isRequired,
  };

  state = {
    loading: false,
    hasMore: true,
    wobjects: [],
  };

  handleLoadMore = () => {
    const { fetcher, limit } = this.props;
    const { wobjects } = this.state;

    this.setState(
      {
        loading: true,
      },
      () => {
        fetcher(wobjects).then(newWobjects =>
          this.setState(state => ({
            loading: false,
            hasMore: newWobjects.length === limit,
            wobjects: _.union(state.wobjects, newWobjects),
          })),
        );
      },
    );
  };

  render() {
    const { loading, hasMore, wobjects } = this.state;

    const empty = !hasMore && wobjects.length === 0;

    return (
      <div className="ObjectDynamicList">
        <ReduxInfiniteScroll
          elementIsScrollable={false}
          loadingMore={loading}
          hasMore={hasMore}
          loader={<Loading />}
          loadMore={this.handleLoadMore}
        >
          {_.map(wobjects, wo => (
            <ObjectComponent key={wo.author_permlink} item={wo} />
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
