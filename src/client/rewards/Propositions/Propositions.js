import React from 'react';
// import _ from 'lodash';
import PropTypes from 'prop-types';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import * as ApiClient from '../../../waivioApi/ApiClient';
import Loading from '../../components/Icon/Loading';
import Proposition from '../Proposition/Proposition';

const displayLimit = 10;

export default class Propositions extends React.Component {
  static propTypes = {
    filterKey: PropTypes.string.isRequired,
  };

  state = {
    propositions: [],
    loading: false,
    hasMore: true,
  };

  componentDidMount() {
    ApiClient.getPropositions(this.preparePropositionReqData()).then(propositions => {
      this.setState({ propositions });
    });
  }

  preparePropositionReqData = () => {
    let reqData = { limit: displayLimit };
    switch (this.props.filterKey) {
      case 'active':
        reqData = { limit: displayLimit };
        break;
      case 'reserved':
        reqData = { limit: displayLimit };
        break;
      default:
        break;
    }
    return reqData;
  };

  handleLoadMore = () => {
    const { propositions, hasMore } = this.state;
    if (hasMore) {
      this.setState(
        {
          loading: true,
        },
        () => {
          const reqData = this.preparePropositionReqData();
          reqData.skip = propositions.length;
          ApiClient.getPropositions(reqData).then(newPropositions =>
            this.setState(state => ({
              loading: false,
              hasMore:
                newPropositions.propositions &&
                newPropositions.propositions.length === displayLimit,
              propositions: state.propositions.concat(newPropositions),
            })),
          );
        },
      );
    }
  };

  render() {
    const { propositions, loading, hasMore } = this.state;

    if (propositions.length === 0) {
      return <Loading />;
    }

    return (
      <React.Fragment>
        <ReduxInfiniteScroll
          elementIsScrollable={false}
          hasMore={hasMore}
          loadMore={this.handleLoadMore}
          loadingMore={loading}
          loader={<Loading />}
        >
          {propositions.length &&
            propositions.map(proposition => <Proposition proposition={proposition} />)}
        </ReduxInfiniteScroll>
      </React.Fragment>
    );
  }
}
