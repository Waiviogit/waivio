import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import WeightTag from '../WeightTag';
import Avatar from '../Avatar';
import ObjectAvatar from '../ObjectAvatar';
import FollowButton from '../../widgets/FollowButton';
import { getRecommendTopics, getRecommendExperts } from '../../user/userActions';
import { recommendTopics, recommendUses } from '../../../common/constants/listOfFields';

import './WelcomeModal.less';

const WelcomeModal = ({
  isAuthorization,
  followingObjectsList,
  followingList,
  recommendedTopics,
  recommendedExperts,
  intl,
}) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [next, setNext] = useState(false);
  const followingKeysList = Object.keys(followingList);
  const haveFollowing = Boolean(followingKeysList.length) || Boolean(followingObjectsList.length);

  useEffect(() => {
    dispatch(getRecommendTopics());
    dispatch(getRecommendExperts());
  }, []);

  useEffect(() => {
    if (
      isAuthorization &&
      !haveFollowing &&
      recommendedTopics.length &&
      recommendedExperts.length
    ) {
      setIsOpen(true);
    }
  }, [isAuthorization, followingObjectsList, followingList, recommendedTopics, recommendedExperts]);

  const NEWS = recommendedTopics.filter(topic => recommendTopics.news.includes(topic.default_name));
  const LIFESTYLE = recommendedTopics.filter(topic =>
    recommendTopics.lifestyle.includes(topic.default_name),
  );
  const ENTERTAINMENT = recommendedTopics.filter(topic =>
    recommendTopics.entertainment.includes(topic.default_name),
  );
  const CRYPTOS = recommendedTopics.filter(topic =>
    recommendTopics.cryptos.includes(topic.default_name),
  );
  const STOCKS = recommendedTopics.filter(topic =>
    recommendTopics.stocks.includes(topic.default_name),
  );
  const MORE = recommendedTopics.filter(topic => recommendTopics.more.includes(topic.default_name));

  const POLITICS = recommendedExperts.filter(user => recommendUses.politics.includes(user.name));
  const ECONOMY = recommendedExperts.filter(user => recommendUses.economy.includes(user.name));
  const SCIENCE = recommendedExperts.filter(user => recommendUses.science.includes(user.name));
  const STEEM = recommendedExperts.filter(user => recommendUses.steem.includes(user.name));
  const CRYPTO = recommendedExperts.filter(user => recommendUses.cryptos.includes(user.name));
  const ENTERTAINMENTUSER = recommendedExperts.filter(user =>
    recommendUses.entertainment.includes(user.name),
  );
  const HEALTH = recommendedExperts.filter(user => recommendUses.health.includes(user.name));
  const TRAVEL = recommendedExperts.filter(user => recommendUses.travel.includes(user.name));

  const topic = [
    {
      name: 'NEWS',
      list: NEWS,
    },
    {
      name: 'LIFESTYLE',
      list: LIFESTYLE,
    },
    {
      name: 'ENTERTAINMENT',
      list: ENTERTAINMENT,
    },
    {
      name: 'CRYPTOS',
      list: CRYPTOS,
    },
    {
      name: 'STOCKS',
      list: STOCKS,
    },
    {
      name: 'MORE',
      list: MORE,
    },
  ];
  const userList = [
    {
      name: 'POLITICS',
      list: POLITICS,
    },
    {
      name: 'ECONOMY',
      list: ECONOMY,
    },
    {
      name: 'SCIENCE',
      list: SCIENCE,
    },
    {
      name: 'STEEM',
      list: STEEM,
    },
    {
      name: 'CRYPTOS',
      list: CRYPTO,
    },
    {
      name: 'ENTERTAINMENT',
      list: ENTERTAINMENTUSER,
    },
    {
      name: 'HEALTH',
      list: HEALTH,
    },
    {
      name: 'TRAVEL',
      list: TRAVEL,
    },
  ];

  const handleCancel = e => {
    if (e.currentTarget.className.indexOf('close') >= 0) {
      setIsOpen(false);
    }
  };

  const title = next
    ? intl.formatMessage({
        id: 'select_experts_to_follow',
        defaultMessage: 'Select experts to follow',
      })
    : intl.formatMessage({
        id: 'select_topic_to_follow',
        defaultMessage: 'Select Topics to follow',
      });
  const button = next ? (
    <Link to={'/feed'} className="WelcomeModal__button" onClick={() => setIsOpen(false)}>
      {intl.formatMessage({ id: 'open_my_feed', defaultMessage: 'Open my feed' })}
    </Link>
  ) : (
    <button className="WelcomeModal__button" onClick={() => setNext(true)}>
      {intl.formatMessage({ id: 'next', defaultMessage: 'Next' })}
    </button>
  );

  const followingType = next ? 'user' : 'wobject';
  const currentAvatar = item =>
    next ? <Avatar size={30} username={item.name} /> : <ObjectAvatar item={item} size={30} />;
  const currentRecommendList = next ? userList : topic;
  const currentAddress = name => (next ? `/object/${name.default_name}` : `/${name}`);
  return (
    <Modal
      className="WelcomeModal"
      visible={isOpen}
      title={title}
      footer={[button]}
      onCancel={e => handleCancel(e)}
    >
      {currentRecommendList.map(obj => (
        <div key={obj.name} className="WelcomeModal__block">
          <div className="WelcomeModal__block-title">{obj.name}</div>
          {obj.list.map(theme => (
            <div key={theme.default_name || theme.name} className="WelcomeModal__item">
              <div className="WelcomeModal__mini-block">
                {currentAvatar(theme)}
                <Link className="WelcomeModal__name" target="_blank" to={currentAddress(theme)}>
                  {theme.default_name || theme.name}
                </Link>
              </div>
              <div>
                <WeightTag weight={theme.weight || theme.wobjects_weight} />
                <FollowButton
                  following={theme.default_name || theme.name}
                  followingType={followingType}
                  secondary
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </Modal>
  );
};

WelcomeModal.propTypes = {
  isAuthorization: PropTypes.bool.isRequired,
  followingObjectsList: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.string,
  ]),
  followingList: PropTypes.shape({}).isRequired,
  recommendedTopics: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  recommendedExperts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

WelcomeModal.defaultProps = {
  followingObjectsList: [{}],
  followingList: {},
};

const mapStateToProps = state => ({
  isAuthorization: state.auth.isAuthenticated,
  followingList: state.user.following.list,
  followingObjectsList: state.user.followingObjects.list,
  recommendedTopics: state.user.recommendedTopics,
  recommendedExperts: state.user.recommendedExperts,
});

export default injectIntl(connect(mapStateToProps)(WelcomeModal));
