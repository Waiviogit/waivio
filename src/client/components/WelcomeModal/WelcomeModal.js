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
import { newUserRecommendTopics, newUserRecommendExperts } from '../../../common/constants/waivio';

import './WelcomeModal.less';

const WelcomeModal = ({ isAuthorization, recommendedTopics, recommendedExperts, intl }) => {
  const dispatch = useDispatch();
  const [isOpenTopicsModal, setIsOpenTopicsModal] = useState(false);
  const [isOpenUsersModal, setIsOpenUsersModal] = useState(false);

  useEffect(() => {
    dispatch(getRecommendTopics());
    dispatch(getRecommendExperts());
  }, []);

  useEffect(() => {
    if (isAuthorization && recommendedTopics.length && recommendedExperts.length) {
      setIsOpenTopicsModal(true);
    }
  }, [isAuthorization, recommendedTopics, recommendedExperts]);

  const NEWS = recommendedTopics.filter(topic =>
    newUserRecommendTopics.news.includes(topic.default_name),
  );
  const LIFESTYLE = recommendedTopics.filter(topic =>
    newUserRecommendTopics.lifestyle.includes(topic.default_name),
  );
  const ENTERTAINMENT = recommendedTopics.filter(topic =>
    newUserRecommendTopics.entertainment.includes(topic.default_name),
  );
  const CRYPTOS = recommendedTopics.filter(topic =>
    newUserRecommendTopics.cryptos.includes(topic.default_name),
  );
  const STOCKS = recommendedTopics.filter(topic =>
    newUserRecommendTopics.stocks.includes(topic.default_name),
  );
  const MORE = recommendedTopics.filter(topic =>
    newUserRecommendTopics.more.includes(topic.default_name),
  );

  const POLITICS = recommendedExperts.filter(user =>
    newUserRecommendExperts.politics.includes(user.name),
  );
  const ECONOMY = recommendedExperts.filter(user =>
    newUserRecommendExperts.economy.includes(user.name),
  );
  const SCIENCE = recommendedExperts.filter(user =>
    newUserRecommendExperts.science.includes(user.name),
  );
  const STEEM = recommendedExperts.filter(user =>
    newUserRecommendExperts.steem.includes(user.name),
  );
  const CRYPTOS_USERS = recommendedExperts.filter(user =>
    newUserRecommendExperts.cryptos.includes(user.name),
  );
  const ENTERTAINMENT_USER = recommendedExperts.filter(user =>
    newUserRecommendExperts.entertainment.includes(user.name),
  );
  const HEALTH = recommendedExperts.filter(user =>
    newUserRecommendExperts.health.includes(user.name),
  );
  const TRAVEL = recommendedExperts.filter(user =>
    newUserRecommendExperts.travel.includes(user.name),
  );

  const topic = [
    {
      name: 'news',
      list: NEWS,
    },
    {
      name: 'lifestyle',
      list: LIFESTYLE,
    },
    {
      name: 'entertainment',
      list: ENTERTAINMENT,
    },
    {
      name: 'cryptos',
      list: CRYPTOS,
    },
    {
      name: 'stocks',
      list: STOCKS,
    },
    {
      name: 'more',
      list: MORE,
    },
  ];
  const userList = [
    {
      name: 'politics',
      list: POLITICS,
    },
    {
      name: 'economy',
      list: ECONOMY,
    },
    {
      name: 'science',
      list: SCIENCE,
    },
    {
      name: 'steem',
      list: STEEM,
    },
    {
      name: 'cryptos',
      list: CRYPTOS_USERS,
    },
    {
      name: 'entertainment',
      list: ENTERTAINMENT_USER,
    },
    {
      name: 'health',
      list: HEALTH,
    },
    {
      name: 'travel',
      list: TRAVEL,
    },
  ];

  const handleCancel = e => {
    if (e.currentTarget.className.indexOf('close') >= 0) {
      setIsOpenTopicsModal(false);
      setIsOpenUsersModal(false);
    }
  };

  return (
    <React.Fragment>
      <Modal
        className="WelcomeModal"
        visible={isOpenTopicsModal}
        title={intl.formatMessage({
          id: 'select_topic_to_follow',
          defaultMessage: 'Select Topics to follow',
        })}
        footer={[
          <button
            className="WelcomeModal__button"
            onClick={() => {
              setIsOpenUsersModal(true);
              setIsOpenTopicsModal(false);
            }}
          >
            {intl.formatMessage({ id: 'next', defaultMessage: 'Next' })}
          </button>,
        ]}
        onCancel={e => handleCancel(e)}
      >
        {topic.map(obj => (
          <div key={obj.name} className="WelcomeModal__block">
            <div className="WelcomeModal__block-title">
              {intl.formatMessage({
                id: obj.name,
                defaultMessage: obj.name,
              })}
            </div>
            {obj.list.map(theme => (
              <div key={theme.default_name} className="WelcomeModal__item">
                <div className="WelcomeModal__mini-block">
                  <ObjectAvatar item={theme} size={30} />
                  <Link
                    className="WelcomeModal__name"
                    target="_blank"
                    to={`/object/${theme.default_name}`}
                  >
                    {theme.default_name}
                  </Link>
                </div>
                <div className="WelcomeModal__mini-block">
                  <WeightTag weight={theme.weight} />
                  <FollowButton following={theme.default_name} followingType="wobject" secondary />
                </div>
              </div>
            ))}
          </div>
        ))}
      </Modal>
      <Modal
        className="WelcomeModal"
        visible={isOpenUsersModal}
        title={intl.formatMessage({
          id: 'select_experts_to_follow',
          defaultMessage: 'Select experts to follow',
        })}
        footer={[
          <Link
            to={'/'}
            className="WelcomeModal__button"
            onClick={() => setIsOpenUsersModal(false)}
          >
            {intl.formatMessage({ id: 'open_my_feed', defaultMessage: 'Open my feed' })}
          </Link>,
        ]}
        onCancel={e => handleCancel(e)}
      >
        {userList.map(obj => (
          <div key={obj.name} className="WelcomeModal__block">
            <div className="WelcomeModal__block-title">
              {intl.formatMessage({
                id: obj.name,
                defaultMessage: obj.name,
              })}
            </div>
            {obj.list.map(theme => (
              <div key={theme.name} className="WelcomeModal__item">
                <div className="WelcomeModal__mini-block">
                  <Avatar size={30} username={theme.name} />
                  <Link className="WelcomeModal__name" target="_blank" to={`/${theme.name}`}>
                    {theme.name}
                  </Link>
                </div>
                <div className="WelcomeModal__mini-block">
                  <WeightTag weight={theme.wobjects_weight} />
                  <FollowButton following={theme.name} followingType="user" secondary />
                </div>
              </div>
            ))}
          </div>
        ))}
      </Modal>
    </React.Fragment>
  );
};

WelcomeModal.propTypes = {
  isAuthorization: PropTypes.bool.isRequired,
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
  recommendedTopics: state.user.recommendedTopics,
  recommendedExperts: state.user.recommendedExperts,
});

export default injectIntl(connect(mapStateToProps)(WelcomeModal));
