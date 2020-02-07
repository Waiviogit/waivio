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
import { setUsersStatus } from '../../settings/settingsActions';
import { getUserFeedContent } from '../../feed/feedActions';

import './WelcomeModal.less';

const WelcomeModal = ({
  isAuthorization,
  recommendedTopics,
  recommendedExperts,
  intl,
  userName,
  followingList,
  followingObjectsList,
}) => {
  const dispatch = useDispatch();
  const [isOpenTopicsModal, setIsOpenTopicsModal] = useState(false);
  const [isOpenUsersModal, setIsOpenUsersModal] = useState(false);
  const followingKeysList = Object.keys(followingList);
  const haveFollowing = Boolean(followingKeysList.length) || Boolean(followingObjectsList.length);

  useEffect(() => {
    dispatch(getRecommendTopics());
    dispatch(getRecommendExperts());
  }, []);

  useEffect(() => {
    if (
      isAuthorization &&
      recommendedTopics.length &&
      recommendedExperts.length &&
      !haveFollowing
    ) {
      setIsOpenTopicsModal(true);
    }
  }, [isAuthorization, recommendedTopics, recommendedExperts]);

  const getRecommendList = (fullList, listWithCategory) =>
    fullList.filter(topic => {
      const nameKey = topic.name ? 'name' : 'default_name';

      return listWithCategory.includes(topic[nameKey]);
    });

  const topic = [
    {
      name: 'news',
      list: getRecommendList(recommendedTopics, newUserRecommendTopics.news),
    },
    {
      name: 'lifestyle',
      list: getRecommendList(recommendedTopics, newUserRecommendTopics.lifestyle),
    },
    {
      name: 'entertainment',
      list: getRecommendList(recommendedTopics, newUserRecommendTopics.entertainment),
    },
    {
      name: 'cryptos',
      list: getRecommendList(recommendedTopics, newUserRecommendTopics.cryptos),
    },
    {
      name: 'stocks',
      list: getRecommendList(recommendedTopics, newUserRecommendTopics.stocks),
    },
    {
      name: 'more',
      list: getRecommendList(recommendedTopics, newUserRecommendTopics.more),
    },
  ];
  const userList = [
    {
      name: 'politics',
      list: getRecommendList(recommendedExperts, newUserRecommendExperts.politics),
    },
    {
      name: 'economy',
      list: getRecommendList(recommendedExperts, newUserRecommendExperts.economy),
    },
    {
      name: 'science',
      list: getRecommendList(recommendedExperts, newUserRecommendExperts.science),
    },
    {
      name: 'steem',
      list: getRecommendList(recommendedExperts, newUserRecommendExperts.steem),
    },
    {
      name: 'cryptos',
      list: getRecommendList(recommendedExperts, newUserRecommendExperts.cryptos),
    },
    {
      name: 'entertainment',
      list: getRecommendList(recommendedExperts, newUserRecommendExperts.entertainment),
    },
    {
      name: 'health',
      list: getRecommendList(recommendedExperts, newUserRecommendExperts.health),
    },
    {
      name: 'travel',
      list: getRecommendList(recommendedExperts, newUserRecommendExperts.travel),
    },
  ];

  const handleCancel = e => {
    if (e.currentTarget.className.indexOf('close') >= 0) {
      setIsOpenTopicsModal(false);
      setIsOpenUsersModal(false);
      dispatch(setUsersStatus());
    }
  };

  const handleCloseSecondModal = () => {
    setIsOpenUsersModal(false);
    dispatch(setUsersStatus());
    dispatch(getUserFeedContent({ userName }));
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
          <Link to={'/'} className="WelcomeModal__button" onClick={handleCloseSecondModal}>
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
  userName: PropTypes.string,
};

WelcomeModal.defaultProps = {
  followingObjectsList: [{}],
  followingList: {},
  userName: '',
};

const mapStateToProps = state => ({
  isAuthorization: state.auth.isAuthenticated,
  followingList: state.user.following.list,
  followingObjectsList: state.user.followingObjects.list,
  recommendedTopics: state.user.recommendedTopics,
  recommendedExperts: state.user.recommendedExperts,
  userName: state.auth.user.name,
});

export default injectIntl(connect(mapStateToProps)(WelcomeModal));
