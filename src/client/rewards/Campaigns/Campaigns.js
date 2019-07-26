import { injectIntl } from 'react-intl';
import React from 'react';
import PropTypes from 'prop-types';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import * as ApiClient from '../../../waivioApi/ApiClient';
import Loading from '../../components/Icon/Loading';
import Campaign from '../Campaign/Campaign';
import { preparePropositionReqData } from '../rewardsHelper';

@injectIntl
export default class Campaigns extends React.Component {
  static propTypes = {
    filterKey: PropTypes.string.isRequired,
    userName: PropTypes.string,
    intl: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    userName: '',
  };

  state = {
    propositions: [],
    loading: false,
    hasMore: true,
    loadingAssignDiscard: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.filterKey !== this.props.filterKey) {
      ApiClient.getPropositions(preparePropositionReqData(nextProps)).then(data => {
        this.setState({ propositions: data.campaigns, hasMore: data.hasMore });
      });
    }
  }

  getTextByFilterKey = (intl, filterKey) => {
    switch (filterKey) {
      case 'active':
      case 'history':
      case 'reserved':
        return `${intl.formatMessage({
          id: 'rewards',
          defaultMessage: 'Rewards',
        })} for`;
      case 'created':
        return `${intl.formatMessage({
          id: 'rewards',
          defaultMessage: 'Rewards',
        })} created by`;
      default:
        return intl.formatMessage({
          id: 'rewards',
          defaultMessage: 'Rewards',
        });
    }
  };

  handleLoadMore = () => {
    const { propositions, hasMore } = this.state;
    if (hasMore) {
      this.setState(
        {
          loading: true,
        },
        () => {
          const reqData = preparePropositionReqData(this.props);
          reqData.skip = propositions.length;
          ApiClient.getPropositions(reqData).then(newPropositions =>
            this.setState(state => ({
              loading: false,
              hasMore: newPropositions.campaigns && newPropositions.hasMore,
              propositions: state.propositions.concat(newPropositions.campaigns),
            })),
          );
        },
      );
    }
  };

  render() {
    const { propositions, loading, hasMore } = this.state;
    const { intl, userName, filterKey } = this.props;
    const text = this.getTextByFilterKey(intl, filterKey);
    return (
      <React.Fragment>
        <div className="Rewards__title">
          {`${text} ${userName ||
            intl.formatMessage({
              id: 'all',
              defaultMessage: 'all',
            })}`}
        </div>
        <ReduxInfiniteScroll
          elementIsScrollable={false}
          hasMore={hasMore}
          loadMore={this.handleLoadMore}
          loadingMore={loading}
          loader={<Loading />}
        >
          {propositions.length !== 0
            ? propositions.map(
                proposition =>
                  proposition &&
                  proposition.required_object && (
                    <Campaign
                      proposition={proposition}
                      filterKey={filterKey}
                      key={proposition.required_object.author_permlink}
                      userName={userName}
                    />
                  ),
              )
            : `${intl.formatMessage(
                {
                  id: 'noProposition',
                  defaultMessage: `There are no propositions`,
                },
                {
                  userName,
                },
              )}`}
        </ReduxInfiniteScroll>
      </React.Fragment>
    );
  }
}
