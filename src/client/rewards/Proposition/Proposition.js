import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import './Proposition.less';
import UserCard from '../../components/UserCard';
import ObjectCard from '../../components/Sidebar/ObjectCard';

const Proposition = ({ proposition }) => {
  const wobjectReq = {
    author_permlink: 'uwl-ichiro-japanese-restaurant',
    fields: [
      {
        weight: 2,
        locale: 'en-US',
        _id: '5ccf5032d0555b20e13cdeb9',
        creator: 'diningguide',
        author: 'asd09',
        permlink: 'diningguide-wxjl0rmgk0m',
        name: 'avatar',
        body: 'https://pbs.twimg.com/profile_images/417396599690514432/hlSwVIAz_400x400.png',
      },
      {
        weight: 2,
        locale: 'en-US',
        _id: '5ccf5032d0555b20e13cdeb9',
        creator: 'diningguide',
        author: 'asd09',
        permlink: 'diningguide-wxjl0rmgk0m',
        name: 'name',
        body: 'Ichiro Japanese Restaurant',
      },
    ],
  };
  const wobjectAim = {
    author_permlink: 'xjn-chicken-katsu',
    fields: [
      {
        weight: 2,
        locale: 'en-US',
        _id: '5ccf5032d0555b20e13cdeb9',
        creator: 'diningguide',
        author: 'asd09',
        permlink: 'diningguide-wxjl0rmgk0m',
        name: 'avatar',
        body: 'https://ipfs.busy.org/ipfs/Qmejn8Mnectr5siH6DVHtUFwExpFMTYU9zAY6eMLDzrmzB',
      },
      {
        weight: 2,
        locale: 'en-US',
        _id: '5ccf5032d0555b20e13cdeb9',
        creator: 'diningguide',
        author: 'asd09',
        permlink: 'diningguide-wxjl0rmgk0m',
        name: 'name',
        body: 'Chicken Katsu',
      },
    ],
  };
  return (
    <div className="Proposition">
      <div className="Proposition__title">{proposition.id}</div>
      <div className="Proposition__header">
        <div className="Proposition__-type">{`Sponsored: ${proposition.type}`}</div>
        <div className="Proposition__reward">{`Reward: $${proposition.reward}`}</div>
      </div>
      <div className="Proposition__footer">
        <div className="Proposition__author">
          <div className="Proposition__author-title">{`Sponsor`}:</div>
          <UserCard user={{ name: proposition.userName }} showFollow={false} />
        </div>
        <div>{`Paid rewards`}: 700$</div>
      </div>
      <div className="Proposition__body">
        <div className="Proposition__body-description">
          {'You should write review to our new dish for receiving reward.'}
        </div>
        <div className="Proposition__body-criteria">
          <div className="Proposition__object">
            <div className="Proposition__object-title">{`You should write post with object`}:</div>
            <ObjectCard wobject={wobjectAim} showFollow={false} />
          </div>
        </div>
        <div className="Proposition__body-requirements">
          <div>
            You should have more then 10 followers, and be an expert with total payout more then 40$
            in objects:
          </div>
          <ObjectCard wobject={wobjectReq} showFollow={false} />
        </div>
      </div>
    </div>
  );
};

Proposition.propTypes = {
  proposition: PropTypes.shape().isRequired,
  // intl: PropTypes.shape().isRequired,
};

export default injectIntl(Proposition);
