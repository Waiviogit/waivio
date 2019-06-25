/* eslint-disable no-underscore-dangle */
import { message, Switch } from 'antd';
import { injectIntl } from 'react-intl';
import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import * as ApiClient from '../../../waivioApi/ApiClient';
import Loading from '../../components/Icon/Loading';
import Proposition from '../Proposition/Proposition';

const displayLimit = 10;

@injectIntl
export default class Propositions extends React.Component {
  static propTypes = {
    assignProposition: PropTypes.func.isRequired,
    discardProposition: PropTypes.func.isRequired,
    filterKey: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    intl: PropTypes.shape().isRequired,
  };

  state = {
    propositions: [],
    loading: false,
    hasMore: true,
    filter: false,
    loadingAssignDiscard: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.filterKey !== this.props.filterKey) {
      ApiClient.getPropositions(this.preparePropositionReqData(this.state.filter, nextProps)).then(
        data => {
          this.setState({ propositions: data.campaigns, hasMore: data.hasMore });
        },
      );
    }
  }

  toggleFilter = () => {
    ApiClient.getPropositions(this.preparePropositionReqData(!this.state.filter, this.props)).then(
      data => {
        this.setState({
          propositions: data.campaigns,
          filter: !this.state.filter,
          hasMore: data.hasMore,
        });
      },
    );
  };

  assignProposition = (proposition, obj) => {
    this.setState({ loadingAssignDiscard: true });
    this.props
      .assignProposition(proposition._id, obj.author_permlink)
      .then(() => {
        const updatedPropositions = this.updateProposition(proposition._id, true);
        message.success(
          this.props.intl.formatMessage({
            id: 'assigned_successfully',
            defaultMessage: 'Assigned successfully',
          }),
        );
        this.setState({ propositions: updatedPropositions, loadingAssignDiscard: false });
      })
      .catch(e => {
        message.error(e.toString());
        this.setState({ loadingAssignDiscard: false });
      });
  };

  updateProposition = (propsId, isAssign) =>
    _.map(this.state.propositions, propos => {
      // eslint-disable-next-line no-param-reassign
      if (propos._id === propsId) {
        _.map(propos.users, user => {
          if (user.name === this.props.userName) {
            const newUser = user;
            newUser.approved = isAssign;
            return newUser;
          }
          return user;
        });
      }
      return propos;
    });

  discardProposition = (proposition, obj) => {
    this.setState({ loadingAssignDiscard: true });
    this.props
      .discardProposition(proposition._id, obj.author_permlink)
      .then(() => {
        const updatedPropositions = this.updateProposition(
          proposition._id,
          false,
          obj.author_permlink,
        );
        message.success(
          this.props.intl.formatMessage({
            id: 'discarded_successfully',
            defaultMessage: 'Discarded successfully',
          }),
        );
        this.setState({ propositions: updatedPropositions, loadingAssignDiscard: false });
      })
      .catch(e => {
        message.error(e.toString());
        this.setState({ loadingAssignDiscard: false });
      });
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
              hasMore: newPropositions.campaigns && newPropositions.hasMore,
              propositions: state.propositions.concat(newPropositions.campaigns),
            })),
          );
        },
      );
    }
  };

  render() {
    const { propositions, loading, hasMore, loadingAssignDiscard } = this.state;
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
        <ReduxInfiniteScroll
          elementIsScrollable={false}
          hasMore={hasMore}
          loadMore={this.handleLoadMore}
          loadingMore={loading}
          loader={<Loading />}
        >
          {propositions.length !== 0
            ? propositions.map(proposition => (
                <Proposition
                  proposition={proposition}
                  assignProposition={this.assignProposition}
                  discardProposition={this.discardProposition}
                  authorizedUserName={userName}
                  loading={loadingAssignDiscard}
                />
              ))
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
      </React.Fragment>
    );
  }
}
