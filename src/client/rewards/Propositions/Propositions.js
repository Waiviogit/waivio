/* eslint-disable no-underscore-dangle */
import { message, Modal } from 'antd';
import { injectIntl } from 'react-intl';
import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import * as ApiClient from '../../../waivioApi/ApiClient';
import Loading from '../../components/Icon/Loading';
import Proposition from '../Proposition/Proposition';
import { preparePropositionReqData } from '../rewardsHelper';
import UserCard from '../../components/UserCard';

@injectIntl
export default class Propositions extends React.Component {
  static propTypes = {
    assignProposition: PropTypes.func.isRequired,
    discardProposition: PropTypes.func.isRequired,
    filterKey: PropTypes.string.isRequired,
    userName: PropTypes.string,
    intl: PropTypes.shape().isRequired,
    campaignParent: PropTypes.string.isRequired,
  };

  static defaultProps = {
    userName: '',
  };

  state = {
    propositions: [],
    loading: false,
    hasMore: true,
    loadingAssignDiscard: false,
    isModalDetailsOpen: false,
    objectDetails: {},
    activefilters: {},
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.filterKey !== this.props.filterKey && this.props.userName) {
      ApiClient.getPropositions(preparePropositionReqData(nextProps)).then(data => {
        this.setState({ propositions: data.campaigns, hasMore: data.hasMore });
      });
    }
  }

  // setFilterValue = (filter, key) => {
  setFilterValue = () => {
    // const activefilters = this.state.activefilters;
    // if (_.includes(activefilters[key], filter)) {
    //     const requestData = activefilters;
    //     this.props.getObjectType(this.props.match.params.typeName, 0, requestData);
    //     this.setState({ activefilters });
    // } else {
    //   this.props.getObjectType(this.props.match.params.typeName, 0, activefilters);
    //   activefilters[key].push(filter);
    //   this.setState({ activefilters });
    // }
    // this.setState({ activefilters });
  };

  getTextByFilterKey = (intl, filterKey) => {
    switch (filterKey) {
      case 'active':
      case 'history':
      case 'reserved':
        return `${intl.formatMessage({
          id: 'rewards',
          defaultMessage: 'Rewards',
        })} from`;
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

  toggleModal = proposition => {
    this.setState({
      isModalDetailsOpen: !this.state.isModalDetailsOpen,
      objectDetails: !this.state.isModalDetailsOpen ? { proposition } : {},
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
    const {
      propositions,
      loading,
      hasMore,
      loadingAssignDiscard,
      isModalDetailsOpen,
      objectDetails,
    } = this.state;
    const { intl, userName, filterKey, campaignParent } = this.props;
    const text = this.getTextByFilterKey(intl, filterKey);
    // const requiredObject = propositions.find((proposition) => proposition.required_object);
    return (
      <React.Fragment>
        <div className="Rewards__title">{`${text} ${campaignParent}`}</div>
        <ReduxInfiniteScroll
          elementIsScrollable={false}
          hasMore={hasMore}
          loadMore={this.handleLoadMore}
          loadingMore={loading}
          loader={<Loading />}
        >
          {propositions.length !== 0
            ? propositions.map(proposition =>
                _.map(
                  proposition.objects,
                  wobj =>
                    wobj.author_permlink && (
                      <Proposition
                        guideName={proposition.guideName}
                        proposition={proposition}
                        wobj={wobj}
                        assignProposition={this.assignProposition}
                        discardProposition={this.discardProposition}
                        authorizedUserName={userName}
                        loading={loadingAssignDiscard}
                        key={`${proposition._id} ${wobj.author_permlink}`}
                        isModalDetailsOpen={isModalDetailsOpen}
                        toggleModal={this.toggleModal}
                        assigned={propositions[0].assigned}
                      />
                    ),
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
        {isModalDetailsOpen && (
          <Modal
            title={this.props.intl.formatMessage({
              id: 'create_new_object',
              defaultMessage: 'Create new object',
            })}
            closable
            onCancel={this.toggleModal}
            maskClosable={false}
            visible={this.state.isModalDetailsOpen}
            wrapClassName="create-object-modal"
            footer={null}
          >
            <div className="Proposition__title">{objectDetails.name}</div>
            <div className="Proposition__header">
              <div className="Proposition__-type">{`Sponsored: ${objectDetails.type}`}</div>
              <div className="Proposition__reward">{`Reward: $${objectDetails.reward}`}</div>
            </div>
            <div className="Proposition__footer">
              <div className="Proposition__author">
                <div className="Proposition__author-title">{`Sponsor`}:</div>
                <UserCard user={{ name: objectDetails.guideName }} showFollow={false} />
              </div>
              <div>{`Paid rewards: ${objectDetails.payed}$ (${objectDetails.payedPercent}%)`}</div>
            </div>
            <div className="Proposition__body">
              <div className="Proposition__body-description">{objectDetails.description}</div>
            </div>
          </Modal>
        )}
      </React.Fragment>
    );
  }
}
