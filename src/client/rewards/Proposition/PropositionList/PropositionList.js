import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { get, isEmpty, map } from 'lodash';
import { Button, Icon } from 'antd';
import ObjectCardView from '../../../objectCard/ObjectCardView';
import Proposition from '../Proposition';

const PropositionList = ({
  allPropositions,
  wobject,
  currentProposition,
  discardProposition,
  assignPropositionHandler,
  intl,
  goToProducts,
  match,
  history,
  user,
  userName,
  loadingAssignDiscard,
  isAssign,
}) => {
  const minReward = get(currentProposition, ['min_reward'], 0);
  const maxReward = get(currentProposition, ['max_reward'], 0);
  const rewardPrise = `${minReward.toFixed(2)} USD`;
  const rewardMax = `${maxReward.toFixed(2)} USD`;

  return (
    <React.Fragment>
      {wobject && isEmpty(wobject.parent) && !isEmpty(currentProposition) ? (
        <div>
          <ObjectCardView wObject={wobject} passedParent={currentProposition} />
          <div className="Campaign__button" role="presentation" onClick={goToProducts}>
            <Button type="primary" size="large">
              {maxReward === minReward ? (
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
      ) : (
        map(allPropositions, propos =>
          map(
            propos.objects,
            wobj =>
              (get(wobj, ['object', 'author_permlink']) === match.params.name ||
                get(wobj, ['object', 'parent', 'author_permlink']) === match.params.name) && (
                <Proposition
                  proposition={propos}
                  wobj={wobj.object}
                  wobjPrice={wobj.reward}
                  assignCommentPermlink={wobj.permlink}
                  assignProposition={assignPropositionHandler}
                  discardProposition={discardProposition}
                  authorizedUserName={userName}
                  loading={loadingAssignDiscard}
                  key={`${wobj.object.author_permlink}`}
                  assigned={wobj.assigned}
                  history={history}
                  isAssign={isAssign}
                  match={match}
                  user={user}
                />
              ),
          ),
        )
      )}
    </React.Fragment>
  );
};

PropositionList.propTypes = {
  intl: PropTypes.shape().isRequired,
  wobject: PropTypes.shape().isRequired,
  allPropositions: PropTypes.arrayOf(PropTypes.shape()),
  currentProposition: PropTypes.arrayOf(PropTypes.shape()),
  discardProposition: PropTypes.func,
  assignPropositionHandler: PropTypes.func,
  goToProducts: PropTypes.func,
  match: PropTypes.shape(),
  history: PropTypes.shape().isRequired,
  user: PropTypes.shape(),
  userName: PropTypes.string.isRequired,
  loadingAssignDiscard: PropTypes.bool,
  isAssign: PropTypes.bool,
};

PropositionList.defaultProps = {
  allPropositions: [],
  currentProposition: [],
  match: {},
  user: {},
  loadingAssignDiscard: false,
  isAssign: false,
  goToProducts: () => {},
  discardProposition: () => {},
  assignPropositionHandler: () => {},
};

export default injectIntl(PropositionList);
