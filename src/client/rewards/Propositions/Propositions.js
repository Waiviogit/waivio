import { Switch } from 'antd';
import { injectIntl } from 'react-intl';
import React from 'react';
import PropTypes from 'prop-types';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import * as ApiClient from '../../../waivioApi/ApiClient';
import Loading from '../../components/Icon/Loading';
import Proposition from '../Proposition/Proposition';

const displayLimit = 10;

@injectIntl
export default class Propositions extends React.Component {
  static propTypes = {
    filterKey: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    intl: PropTypes.shape().isRequired,
  };

  state = {
    propositions: [],
    loading: false,
    hasMore: true,
    filter: false,
  };

  // componentDidMount() {
  //   ApiClient.getPropositions(this.preparePropositionReqData(this.state.filter, this.props)).then(propositions => {
  //     this.setState({ propositions });
  //   });
  // }

  componentWillReceiveProps(nextProps) {
    if (nextProps.filterKey !== this.props.filterKey) {
      ApiClient.getPropositions(this.preparePropositionReqData(this.state.filter, nextProps)).then(
        propositions => {
          this.setState({ propositions });
        },
      );
    }
  }

  toggleFilter = () => {
    ApiClient.getPropositions(this.preparePropositionReqData(!this.state.filter, this.props)).then(
      propositions => {
        this.setState({ propositions, filter: !this.state.filter });
      },
    );
  };

  preparePropositionReqData = (filter, props) => {
    const { userName } = props;
    const reqData = { limit: displayLimit };
    if (filter && userName) reqData.userName = userName;
    switch (props.filterKey) {
      case 'active':
        break;
      case 'history':
        reqData.status = ['inactive', 'expired', 'deleted', 'payed'];
        break;
      case 'reserved':
        reqData.userName = userName;
        reqData.approved = true;
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
          const reqData = this.preparePropositionReqData(this.state.filter, this.props);
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
    const { intl, filterKey, userName } = this.props;

    return (
      <React.Fragment>
        <div className="Rewards__title">
          {`${intl.formatMessage({
            id: 'rewards',
            defaultMessage: 'Rewards',
          })}`}
          {filterKey !== 'reserved' && (
            <div className="Rewards__toggler-wrap">
              {`${intl.formatMessage({
                id: 'only_for_my',
                defaultMessage: 'Only for me',
              })}`}
              <Switch checked={this.state.filter} onChange={this.toggleFilter} />
            </div>
          )}
        </div>
        {!loading ? (
          <ReduxInfiniteScroll
            elementIsScrollable={false}
            hasMore={hasMore}
            loadMore={this.handleLoadMore}
            loadingMore={loading}
            loader={<Loading />}
          >
            {propositions.length !== 0
              ? propositions.map(proposition => <Proposition proposition={proposition} />)
              : `${intl.formatMessage(
                  {
                    id: 'noProposition',
                    defaultMessage: `There are no propositions for {userName}`,
                  },
                  {
                    userName,
                  },
                )}`}
          </ReduxInfiniteScroll>
        ) : (
          <Loading />
        )}
      </React.Fragment>
    );
  }
}
