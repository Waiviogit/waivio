import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { message, Modal } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { size } from 'lodash';

import WeightTag from '../WeightTag';
import Avatar from '../Avatar';
import ObjectAvatar from '../ObjectAvatar';
import FollowButton from '../../widgets/FollowButton';
import { followWobject, unfollowWobject } from '../../object/wobjActions';
import { newUserRecommendTopics, newUserRecommendExperts } from '../../../common/constants/waivio';
import { setUsersStatus } from '../../settings/settingsActions';
import { getUserFeedContent } from '../../store/feedStore/feedActions';
import { followUser, unfollowUser } from '../../user/usersActions';
import { getLocale } from '../../store/reducers';
import { getRecommendTopic, getUsers } from '../../../waivioApi/ApiClient';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
  isGuestUser,
} from '../../store/authStore/authSelectors';

import './WelcomeModal.less';

const WelcomeModal = ({ isAuthorization, intl, userName, location, isGuest, locale }) => {
  const dispatch = useDispatch();
  const [isOpenTopicsModal, setIsOpenTopicsModal] = useState(false);
  const [isOpenUsersModal, setIsOpenUsersModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [wobjs, setWobjs] = useState([]);
  const isSuccess = res => (isGuest && res.value.ok) || !res.message;

  useEffect(() => {
    const userList = Object.values(newUserRecommendExperts).reduce(
      (arr, acc) => [...acc, ...arr],
      [],
    );
    const topicList = Object.values(newUserRecommendTopics).reduce(
      (arr, acc) => [...acc, ...arr],
      [],
    );

    getRecommendTopic(size(topicList), locale, 0, topicList).then(res => {
      if (res && res.wobjects) setWobjs(res.wobjects);
    });
    getUsers({ listUsers: userList, limit: size(userList), locale }).then(res => {
      if (res && res.users) setUsers(res.users);
    });
  }, []);

  useEffect(() => {
    if (isAuthorization && size(wobjs) && size(users)) {
      setIsOpenTopicsModal(true);
    }
  }, [isAuthorization, wobjs, users]);

  const unFollow = name => {
    const matchUserIndex = users.findIndex(user => user.name === name);
    const usersArray = [...users];

    usersArray.splice(matchUserIndex, 1, {
      ...usersArray[matchUserIndex],
      pending: true,
    });

    setUsers([...usersArray]);
    dispatch(unfollowUser(name)).then(res => {
      if (isSuccess(res)) {
        usersArray.splice(matchUserIndex, 1, {
          ...usersArray[matchUserIndex],
          youFollows: false,
          pending: false,
        });
      } else {
        message.error(res.value.statusText);
        usersArray.splice(matchUserIndex, 1, {
          ...usersArray[matchUserIndex],
          pending: false,
        });
      }

      setUsers([...usersArray]);
    });
  };

  const follow = name => {
    const matchUserIndex = users.findIndex(user => user.name === name);
    const usersArray = [...users];

    usersArray.splice(matchUserIndex, 1, {
      ...usersArray[matchUserIndex],
      pending: true,
    });

    setUsers([...usersArray]);
    dispatch(followUser(name)).then(res => {
      if (isSuccess(res)) {
        usersArray.splice(matchUserIndex, 1, {
          ...usersArray[matchUserIndex],
          youFollows: true,
          pending: false,
        });
      } else {
        message.error(res.value.statusText);
        usersArray.splice(matchUserIndex, 1, {
          ...usersArray[matchUserIndex],
          pending: false,
        });
      }

      setUsers([...usersArray]);
    });
  };

  const unFollowObj = permlink => {
    const matchWobjIndex = wobjs.findIndex(wobj => wobj.author_permlink === permlink);
    const wobjectsArray = [...wobjs];

    wobjectsArray.splice(matchWobjIndex, 1, {
      ...wobjectsArray[matchWobjIndex],
      pending: true,
    });

    setWobjs([...wobjectsArray]);
    dispatch(unfollowWobject(permlink)).then(res => {
      if (isSuccess(res)) {
        wobjectsArray.splice(matchWobjIndex, 1, {
          ...wobjectsArray[matchWobjIndex],
          youFollows: false,
          pending: false,
        });
      } else {
        message.error(res.value.statusText);
        wobjectsArray.splice(matchWobjIndex, 1, {
          ...wobjectsArray[matchWobjIndex],
          pending: false,
        });
      }

      setWobjs([...wobjectsArray]);
    });
  };

  const followObj = permlink => {
    const matchWobjectIndex = wobjs.findIndex(wobj => wobj.author_permlink === permlink);
    const wobjectsArray = [...wobjs];

    wobjectsArray.splice(matchWobjectIndex, 1, {
      ...wobjectsArray[matchWobjectIndex],
      pending: true,
    });

    setWobjs([...wobjectsArray]);
    dispatch(followWobject(permlink)).then(res => {
      if (isSuccess(res)) {
        wobjectsArray.splice(matchWobjectIndex, 1, {
          ...wobjectsArray[matchWobjectIndex],
          youFollows: true,
          pending: false,
        });
      } else {
        message.error(res.value.statusText);
        wobjectsArray.splice(matchWobjectIndex, 1, {
          ...wobjectsArray[matchWobjectIndex],
          pending: false,
        });
      }

      setWobjs([...wobjectsArray]);
    });
  };

  const getRecommendList = (fullList, listWithCategory) =>
    fullList.filter(topic => {
      const nameKey = topic.name ? 'name' : 'default_name';

      return listWithCategory.includes(topic[nameKey]);
    });

  const topic = [
    {
      name: 'news',
      list: getRecommendList(wobjs, newUserRecommendTopics.news),
    },
    {
      name: 'lifestyle',
      list: getRecommendList(wobjs, newUserRecommendTopics.lifestyle),
    },
    {
      name: 'entertainment',
      list: getRecommendList(wobjs, newUserRecommendTopics.entertainment),
    },
    {
      name: 'cryptos',
      list: getRecommendList(wobjs, newUserRecommendTopics.cryptos),
    },
    {
      name: 'stocks',
      list: getRecommendList(wobjs, newUserRecommendTopics.stocks),
    },
    {
      name: 'more',
      list: getRecommendList(wobjs, newUserRecommendTopics.more),
    },
  ];
  const userList = [
    {
      name: 'politics',
      list: getRecommendList(users, newUserRecommendExperts.politics),
    },
    {
      name: 'economy',
      list: getRecommendList(users, newUserRecommendExperts.economy),
    },
    {
      name: 'science',
      list: getRecommendList(users, newUserRecommendExperts.science),
    },
    {
      name: 'hive',
      list: getRecommendList(users, newUserRecommendExperts.hive),
    },
    {
      name: 'cryptos',
      list: getRecommendList(users, newUserRecommendExperts.cryptos),
    },
    {
      name: 'entertainment',
      list: getRecommendList(users, newUserRecommendExperts.entertainment),
    },
    {
      name: 'health',
      list: getRecommendList(users, newUserRecommendExperts.health),
    },
    {
      name: 'travel',
      list: getRecommendList(users, newUserRecommendExperts.travel),
    },
  ];

  const handleCancel = e => {
    if (e.currentTarget.className.indexOf('close') >= 0) {
      setIsOpenTopicsModal(false);
      setIsOpenUsersModal(false);
      dispatch(setUsersStatus());

      if (location === '/') {
        dispatch(getUserFeedContent({ userName }));
      }
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
            key="next"
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
                  <FollowButton
                    following={theme.youFollows}
                    followingType="wobject"
                    wobj={theme}
                    secondary
                    unfollowObject={unFollowObj}
                    followObject={followObj}
                  />
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
            key="open"
            onClick={handleCloseSecondModal}
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
                  <FollowButton
                    following={theme.youFollows}
                    user={theme}
                    followUser={follow}
                    unfollowUser={unFollow}
                    followingType="user"
                    secondary
                  />
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
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  userName: PropTypes.string,
  location: PropTypes.string,
  isGuest: PropTypes.bool,
  locale: PropTypes.string,
};

WelcomeModal.defaultProps = {
  userName: '',
  location: '',
  isGuest: false,
  locale: 'en-US',
};

const mapStateToProps = state => ({
  isAuthorization: getIsAuthenticated(state),
  userName: getAuthenticatedUserName(state),
  isGuest: isGuestUser(state),
  locale: getLocale(state),
});

export default injectIntl(connect(mapStateToProps, null)(WelcomeModal));
