import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import Loading from '../../components/Icon/Loading';
import './ListObjectsByType.less';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { getClientWObj } from '../../adapters';
import * as ApiClient from '../../../waivioApi/ApiClient';

export default class ListObjectsByType extends React.Component {
  static propTypes = {
    limit: PropTypes.number.isRequired,
    wobjects: PropTypes.shape().isRequired,
    typeName: PropTypes.string.isRequired,
    handleObjectCount: PropTypes.func,
    showSmallVersion: PropTypes.bool,
  };

  static defaultProps = {
    handleObjectCount: () => {},
    showSmallVersion: true,
  };

  state = {
    loading: false,
    hasMore: true,
    wobjects: [],
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.wobjects && nextProps.wobjects.length > 0 && !this.props.wobjects) {
      this.setState({ wobjects: nextProps.wobjects });
    }
  }
  handleLoadMore = () => {
    if (this.props.wobjects && this.props.wobjects.length > 0) {
      const { limit, handleObjectCount, typeName } = this.props;
      const { wobjects } = this.state;
      // ApiClient.getObjectType(typeName, 50);
      this.setState(
        {
          loading: true,
        },
        () => {
          ApiClient.getObjectType(typeName, wobjects.length + 5).then(newWobjects => {
            newWobjects.related_wobjects // eslint-disable-line no-unused-expressions
              ? this.setState(
                  state => ({
                    loading: false,
                    hasMore: _.size(newWobjects.wobjects) === limit,
                    wobjects: _.union(state.wobjects, newWobjects.related_wobjects),
                  }),
                  () => {
                    handleObjectCount(newWobjects.related_wobjects.length);
                  },
                )
              : this.setState(state => ({
                  loading: false,
                  hasMore: newWobjects.length === limit,
                  wobjects: _.union(state.wobjects, newWobjects.related_wobjects),
                }));
          });
        },
      );
    }
  };

  render() {
    const { loading, hasMore, wobjects } = this.state;
    const empty = !hasMore && wobjects.length === 0;

    return (
      <div className="ListObjectsByType">
        <ReduxInfiniteScroll
          elementIsScrollable={false}
          loadingMore={loading}
          hasMore={hasMore}
          loader={<Loading />}
          loadMore={this.handleLoadMore}
        >
          {_.map(wobjects, wobj => {
            const wo = getClientWObj(wobj);
            return (
              <ObjectCardView
                showSmallVersion={this.props.showSmallVersion}
                key={wo.id}
                wObject={wo}
              />
            );
          })}
        </ReduxInfiniteScroll>
        {empty && (
          <div className="ListObjectsByType__empty">
            <FormattedMessage id="list_empty" defaultMessage="Nothing is there" />
          </div>
        )}
      </div>
    );
  }
}
