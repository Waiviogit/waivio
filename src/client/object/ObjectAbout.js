import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { filter, get, isEmpty, map } from 'lodash';
import { injectIntl } from 'react-intl';
import { Button, Icon } from 'antd';
import { getAuthenticatedUser, getLocale } from '../reducers';
import { getFollowingSponsorsRewards } from '../rewards/rewardsActions';
import ObjectInfo from '../app/Sidebar/ObjectInfo';
import * as ApiClient from '../../waivioApi/ApiClient';
import './ObjectAbout.less';
import Loading from '../components/Icon/Loading';
import ObjectCardView from '../objectCard/ObjectCardView';
import Proposition from '../rewards/Proposition/Proposition';

const ObjectAbout = ({ isEditMode, wobject, userName, locale, match, intl, history, user }) => {
  const [loadingPropositions, setLoadingPropositions] = useState(false);
  const [allPropositions, setAllPropositions] = useState([]);
  const [currentProposition, setCurrentProposition] = useState([]);
  const getPropositions = reqData => {
    setLoadingPropositions(true);
    ApiClient.getPropositions(reqData).then(data => {
      const currentPropos = filter(
        data.campaigns,
        obj => obj.required_object.author_permlink === match.params.name,
      );
      setAllPropositions(data.campaigns);
      setLoadingPropositions(false);
      setCurrentProposition(currentPropos);
    });
  };

  useEffect(() => {
    if (wobject && userName) {
      const requiredObject =
        get(wobject, ['parent', 'author_permlink']) || get(wobject, ['parent']);
      const primaryObject = get(wobject, ['author_permlink']);
      const reqData = {
        userName,
        match,
        locale,
      };
      if (requiredObject) {
        reqData.requiredObject = requiredObject;
      } else {
        reqData.primaryObject = primaryObject;
      }
      getPropositions(reqData);
    }
  }, [wobject, userName]);

  const renderProposition = propositions =>
    map(propositions, proposition =>
      map(
        proposition.objects,
        wobj =>
          get(wobj, ['object', 'author_permlink']) === match.params.name && (
            <Proposition
              proposition={proposition}
              wobj={wobj.object}
              wobjPrice={wobj.reward}
              assignCommentPermlink={wobj.permlink}
              // assignProposition={this.assignPropositionHandler}
              // discardProposition={this.discardProposition}
              authorizedUserName={userName}
              // loading={this.state.loadingAssignDiscard}
              key={`${wobj.object.author_permlink}`}
              assigned={wobj.assigned}
              history={history}
              // isAssign={this.state.isAssign}
              match={match}
              user={user}
            />
          ),
      ),
    );

  const goToProducts = () => {
    const permlink = get(wobject, 'author_permlink');
    history.push(`/rewards/all/${permlink}`);
  };
  const minReward = currentProposition ? get(currentProposition[0], ['min_reward']) : 0;
  const maxReward = currentProposition ? get(currentProposition[0], ['max_reward']) : 0;
  const rewardPrise = minReward ? `${minReward.toFixed(2)} USD` : '';
  const rewardMax = maxReward !== minReward ? `${maxReward.toFixed(2)} USD` : '';

  const getFeedProposition = () => {
    if (wobject && isEmpty(wobject.parent) && !isEmpty(currentProposition)) {
      return (
        <div>
          <ObjectCardView wObject={wobject} passedParent={currentProposition} />
          <div className="Campaign__button" role="presentation" onClick={goToProducts}>
            <Button type="primary" size="large">
              {!rewardMax ? (
                <React.Fragment>
                  <span>
                    {intl.formatMessage({
                      id: 'rewards_details_earn',
                      defaultMessage: 'Earn',
                    })}
                  </span>
                  <span>
                    <span className="fw6 ml1">{rewardPrise}</span>
                    <Icon type="right" />
                  </span>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <span>
                    {intl.formatMessage({
                      id: 'rewards_details_earn_up_to',
                      defaultMessage: 'Earn up to',
                    })}
                  </span>
                  <span>
                    <span className="fw6 ml1">{`${rewardMax}`}</span>
                    <Icon type="right" />
                  </span>
                </React.Fragment>
              )}
            </Button>
          </div>
        </div>
      );
    }
    return renderProposition(allPropositions);
  };

  return (
    <React.Fragment>
      {loadingPropositions ? <Loading /> : <React.Fragment>{getFeedProposition()}</React.Fragment>}
      <div className="object-about">
        <ObjectInfo isEditMode={isEditMode} wobject={wobject} userName={userName} />
      </div>
    </React.Fragment>
  );
};

ObjectAbout.propTypes = {
  wobject: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
  isEditMode: PropTypes.bool,
  locale: PropTypes.string,
  match: PropTypes.shape(),
  intl: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  user: PropTypes.shape(),
};

ObjectAbout.defaultProps = {
  isEditMode: false,
  locale: 'en-US',
  match: {},
  user: {},
};

export default connect(
  state => ({
    locale: getLocale(state),
    user: getAuthenticatedUser(state),
  }),
  {
    getFollowingRewards: getFollowingSponsorsRewards,
  },
)(injectIntl(ObjectAbout));
