import _ from 'lodash';
import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import './Proposition.less';
import UserCard from '../../components/UserCard';
import ObjectCard from '../../components/Sidebar/ObjectCard';

const requirementsKeys = {
  minPhotos: { id: 'min_images_count', defaultMessage: 'You should add images, minimum' },
  minFollowers: {
    id: 'min_followers_count',
    defaultMessage: 'You should have followers, at least',
  },
  minPosts: { id: 'min_posts_count', defaultMessage: 'You should be author of post, minimum' },
};

const Proposition = ({
  intl,
  proposition,
  authorizedUserName,
  assignProposition,
  discardProposition,
  loading,
}) => {
  // const wobjectReq = {
  //   author_permlink: 'uwl-ichiro-japanese-restaurant',
  //   fields: [
  //     {
  //       weight: 2,
  //       locale: 'en-US',
  //       _id: '5ccf5032d0555b20e13cdeb9',
  //       creator: 'diningguide',
  //       author: 'asd09',
  //       permlink: 'diningguide-wxjl0rmgk0m',
  //       name: 'avatar',
  //       body: 'https://pbs.twimg.com/profile_images/417396599690514432/hlSwVIAz_400x400.png',
  //     },
  //     {
  //       weight: 2,
  //       locale: 'en-US',
  //       _id: '5ccf5032d0555b20e13cdeb9',
  //       creator: 'diningguide',
  //       author: 'asd09',
  //       permlink: 'diningguide-wxjl0rmgk0m',
  //       name: 'name',
  //       body: 'Ichiro Japanese Restaurant',
  //     },
  //   ],
  // };

  const assignPr = () => {
    assignProposition(proposition);
  };
  const discardPr = () => {
    discardProposition(proposition);
  };
  const userInPropositions = _.find(proposition.users, user => user.name === authorizedUserName);
  return (
    <div className="Proposition">
      <div className="Proposition__title">{proposition.name}</div>
      <div className="Proposition__header">
        <div className="Proposition__-type">{`Sponsored: ${proposition.type}`}</div>
        <div className="Proposition__reward">{`Reward: $${proposition.reward}`}</div>
      </div>
      <div className="Proposition__footer">
        <div className="Proposition__author">
          <div className="Proposition__author-title">{`Sponsor`}:</div>
          <UserCard user={{ name: proposition.guideName }} showFollow={false} />
        </div>
        <div>{`Paid rewards: ${proposition.payed}$ (${proposition.payedPercent}%)`}</div>
      </div>
      <div className="Proposition__body">
        <div className="Proposition__body-description">{proposition.description}</div>
        <div>
          {!_.isEmpty(proposition.requirements) &&
            _.map(proposition.requirements, (req, reqKey) => (
              <span>
                {requirementsKeys[reqKey]
                  ? `${intl.formatMessage(requirementsKeys[reqKey])} ${req}`
                  : ''}
              </span>
            ))}
        </div>
        {!_.isEmpty(proposition.objects) && (
          <div className="Proposition__body-criteria">
            <div className="Proposition__object">
              <div className="Proposition__object-title">
                {`You should write post with objects`}:
              </div>
              {_.map(proposition.objects, obj => (
                <ObjectCard key={obj.author_permlink} wobject={obj} showFollow={false} />
              ))}
            </div>
          </div>
        )}
        <div className="Proposition__body-requirements">
          {/* <ObjectCard wobject={wobjectReq} showFollow={false}/> */}
        </div>
        {userInPropositions &&
          (!userInPropositions.approved ? (
            <Button
              className="reward-button"
              type="primary"
              loading={loading}
              disabled={loading}
              onClick={assignPr}
            >
              {intl.formatMessage({
                id: 'assign',
                defaultMessage: `Assign`,
              })}
            </Button>
          ) : (
            <Button
              className="reward-button"
              type="primary"
              loading={loading}
              disabled={loading}
              onClick={discardPr}
            >
              {intl.formatMessage({
                id: 'discard',
                defaultMessage: `Discard`,
              })}
            </Button>
          ))}
      </div>
    </div>
  );
};

Proposition.propTypes = {
  proposition: PropTypes.shape().isRequired,
  assignProposition: PropTypes.func.isRequired,
  discardProposition: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  authorizedUserName: PropTypes.string,
  intl: PropTypes.shape().isRequired,
};

Proposition.defaultProps = {
  authorizedUserName: '',
};

export default injectIntl(Proposition);
