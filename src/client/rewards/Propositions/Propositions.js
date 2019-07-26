/* eslint-disable no-underscore-dangle */
import { message } from 'antd';
import { injectIntl } from 'react-intl';
import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import * as ApiClient from '../../../waivioApi/ApiClient';
import Loading from '../../components/Icon/Loading';
import Proposition from '../Proposition/Proposition';
import { preparePropositionReqData } from '../rewardsHelper';

@injectIntl
export default class Propositions extends React.Component {
  static propTypes = {
    assignProposition: PropTypes.func.isRequired,
    discardProposition: PropTypes.func.isRequired,
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

  assignProposition = (proposition, obj) => {
    this.setState({ loadingAssignDiscard: true });
    this.props
      .assignProposition(proposition._id, obj.author_permlink)
      .then(() => {
        const updatedPropositions = this.updateProposition(
          proposition._id,
          true,
          obj.author_permlink,
        );
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

  updateProposition = (propsId, isAssign, objPermlink) =>
    _.map(this.state.propositions, propos => {
      // eslint-disable-next-line no-param-reassign
      if (propos._id === propsId) {
        _.map(propos.users, user => {
          if (user.name === this.props.userName) {
            if (_.includes(user.approved_objects, objPermlink)) {
              const newUser = user;
              newUser.approved_objects = _.filter(user.approved_objects, o => o !== objPermlink);
              return newUser;
            }
            return user.approved_objects.push(objPermlink);
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
    const { propositions, loading, hasMore, loadingAssignDiscard } = this.state;
    const { intl, userName, filterKey } = this.props;
    const text = this.getTextByFilterKey(intl, filterKey);
    // const requiredObject = propositions.find((proposition) => proposition.required_object);
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
            ? propositions.map(proposition => (
                <Proposition
                  proposition={proposition}
                  assignProposition={this.assignProposition}
                  discardProposition={this.discardProposition}
                  authorizedUserName={userName}
                  loading={loadingAssignDiscard}
                  key={proposition.id}
                />
              ))
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
