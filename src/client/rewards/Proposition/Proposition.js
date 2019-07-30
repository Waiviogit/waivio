// import _ from 'lodash';
import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import './Proposition.less';
// import UserCard from '../../components/UserCard';
// import ObjectCard from '../../components/Sidebar/ObjectCard';
import { getClientWObj } from '../../adapters';
import ObjectCardView from '../../objectCard/ObjectCardView';
import UserCard from '../../components/UserCard';

// const { Panel } = Collapse;

// const requirementsKeys = {
//   minPhotos: { id: 'min_images_count', defaultMessage: 'You should add images, minimum' },
//   minFollowers: {
//     id: 'min_followers_count',
//     defaultMessage: 'You should have followers, at least',
//   },
//   minPosts: { id: 'min_posts_count', defaultMessage: 'You should be author of post, minimum' },
// };

const Proposition = ({
  intl,
  proposition,
  // authorizedUserName,
  assignProposition,
  discardProposition,
  loading,
  guideName,
  wobj,
  toggleModal,
  assigned,
}) => {
  const proposedWobj = getClientWObj(wobj);

  const assignPr = obj => {
    assignProposition(proposition, obj);
  };

  const toggleModalDetails = () => {
    toggleModal(proposition);
  };
  const discardPr = obj => {
    discardProposition(proposition, obj);
  };
  return (
    <div className="Proposition">
      <div className="RewarsHeader-block">
        <div className="RewarsHeader-wrap">
          {`${intl.formatMessage({
            id: 'reward_requested_by',
            defaultMessage: `Reviews requested by`,
          })}:`}
          <span>{`${intl.formatMessage({
            id: 'rewards',
            defaultMessage: `Rewards`,
          })}:`}</span>
        </div>
        <div className="RewarsHeader-wrap">
          <UserCard user={{ name: guideName }} showFollow={false} />
          <span className="RewarsHeader-payment">$8.2 </span>
        </div>
      </div>
      <ObjectCardView wObject={proposedWobj} key={proposedWobj.id} />
      <div className="RewarsHeader-wrap">
        {typeof assigned === 'boolean' && !proposition.assigned ? (
          <div className="RewarsHeader-button">
            <Button
              type="primary"
              loading={loading}
              disabled={loading}
              onClick={() => assignPr(proposedWobj)}
            >
              {intl.formatMessage({
                id: 'reserve',
                defaultMessage: `Reserve`,
              })}
            </Button>
            {`${intl.formatMessage({
              id: 'for',
              defaultMessage: `for`,
            })} ${5} ${intl.formatMessage({
              id: 'days',
              defaultMessage: `days`,
            })}`}
          </div>
        ) : (
          <Button
            type="primary"
            loading={loading}
            disabled={loading}
            onClick={() => discardPr(proposedWobj)}
          >
            {intl.formatMessage({
              id: 'release',
              defaultMessage: `Release`,
            })}
          </Button>
        )}
        <a role="presentation" className="RewardsHeader" onClick={toggleModalDetails}>
          {intl.formatMessage({
            id: 'details',
            defaultMessage: `Details`,
          })}
        </a>
      </div>
    </div>
  );
};

Proposition.propTypes = {
  proposition: PropTypes.shape().isRequired,
  wobj: PropTypes.shape().isRequired,
  assignProposition: PropTypes.func.isRequired,
  discardProposition: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  assigned: PropTypes.oneOfType([PropTypes.bool, PropTypes.null]).isRequired,
  toggleModal: PropTypes.func.isRequired,
  guideName: PropTypes.string.isRequired,
  // authorizedUserName: PropTypes.string,
  intl: PropTypes.shape().isRequired,
};

Proposition.defaultProps = {
  authorizedUserName: '',
};

export default injectIntl(Proposition);
