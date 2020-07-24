import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { filter, get, includes, isEmpty, map } from 'lodash';
import classNames from 'classnames';
import SearchUsersAutocomplete from '../../components/EditorUser/SearchUsersAutocomplete';
import ReviewItem from '../Create-Edit/ReviewItem';
import { getContent, getSuccessDeleteMessage } from '../rewardsHelper';
import BlacklistFooter from './BlacklistFooter';
import BlacklistUser from './BlacklistUser';
import { changeBlackAndWhiteLists, getBlacklist } from '../rewardsActions';
import './Blacklist.less';

const BlacklistContent = ({
  intl,
  userName,
  pathName,
  blacklistUsers,
  saveBlacklistUsers,
  whiteListUsers,
  saveWhitelistUsers,
  followListsUsers,
  saveFollowLists,
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const successDeleteMessage = getSuccessDeleteMessage(users, pathName);
  const setUserBlacklist = user => setUsers([...users, user]);

  const getUsersForRender = useMemo(() => {
    if (includes(pathName, 'whitelist')) {
      return whiteListUsers;
    } else if (includes(pathName, 'references')) {
      return followListsUsers;
    }
    return blacklistUsers;
  }, [pathName, whiteListUsers, followListsUsers, blacklistUsers]);

  const removeUser = user => {
    const newUsers = filter(users, obj => obj.account !== user.account);
    setUsers(newUsers);
  };

  const getTitle = useMemo(() => {
    if (includes(pathName, 'whitelist')) {
      return intl.formatMessage({
        id: 'whitelist',
        defaultMessage: 'Whitelist',
      });
    } else if (includes(pathName, 'references')) {
      return intl.formatMessage({
        id: 'references',
        defaultMessage: 'References',
      });
    }
    return intl.formatMessage({
      id: 'blacklist',
      defaultMessage: 'Blacklist',
    });
  }, [pathName, intl]);

  const clearUsers = () => setUsers([]);

  const handleDeleteUsers = async user => {
    let id = 'removeUsersFromBlackList';
    if (pathName.includes('whitelist')) id = 'removeUsersFromWhiteList';
    if (pathName.includes('references')) id = 'unFollowAnotherBlacklist';
    setLoading(true);
    dispatch(changeBlackAndWhiteLists(id, [user]))
      .then(() => {
        setTimeout(() => {
          dispatch(getBlacklist(userName))
            .then(data => {
              if (includes(pathName, 'whitelist')) {
                const whiteList = get(data, ['value', 'blackList', 'whiteList']);
                saveWhitelistUsers(whiteList);
              } else if (includes(pathName, 'references')) {
                const followLists = get(data, ['value', 'blackList', 'followLists']);
                saveFollowLists(followLists);
              } else {
                const blacklist = get(data, ['value', 'blackList', 'blackList']);
                saveBlacklistUsers(blacklist);
              }
            })
            .then(() => {
              message.success(
                intl.formatMessage({
                  id: successDeleteMessage.id,
                  defaultMessage: successDeleteMessage.defaultMessage,
                }),
              );
              clearUsers();
              setLoading(false);
            });
        }, 7000);
      })
      .catch(err => console.error(err));
  };

  const renderUser = !isEmpty(users)
    ? map(users, user => (
        <ReviewItem key={user.id} object={user} removeReviewObject={removeUser} isUser />
      ))
    : null;

  const title = pathName ? getContent(pathName).title : '';
  const caption = pathName ? getContent(pathName).caption : '';

  return (
    <div className="Blacklist__content">
      <div className="Blacklist__content-title">
        {intl.formatMessage({
          id: title.id,
          defaultMessage: title.defaultMessage,
        })}
      </div>
      <SearchUsersAutocomplete
        allowClear={false}
        handleSelect={setUserBlacklist}
        placeholder={intl.formatMessage({
          id: 'find_users_placeholder',
          defaultMessage: 'Find user',
        })}
        style={{ width: '100%' }}
        autoFocus={false}
      />
      <div className="Blacklist__content-caption">
        {intl.formatMessage({
          id: caption.id,
          defaultMessage: caption.defaultMessage,
        })}{' '}
        {!pathName.includes('references') && <Link to={`/@${userName}`}>{userName}</Link>}
      </div>
      <div className="Blacklist__content-objects-wrap">{renderUser}</div>
      <BlacklistFooter
        users={users}
        pathName={pathName}
        clearUsers={clearUsers}
        userName={userName}
        saveBlacklistUsers={saveBlacklistUsers}
        saveWhitelistUsers={saveWhitelistUsers}
        saveFollowLists={saveFollowLists}
      />
      <div className="Blacklist__content-title-blacklist">{getTitle}</div>
      <div
        className={classNames('Blacklist__content-blacklist', {
          empty: isEmpty(getUsersForRender),
        })}
      >
        {!isEmpty(getUsersForRender)
          ? map(getUsersForRender, user => (
              <BlacklistUser
                user={user}
                handleDeleteUsers={handleDeleteUsers}
                loading={loading}
                pathName={pathName}
              />
            ))
          : intl.formatMessage({
              id: 'your_list_is_empty',
              defaultMessage: 'Your list is empty',
            })}
      </div>
    </div>
  );
};

BlacklistContent.propTypes = {
  intl: PropTypes.shape().isRequired,
  userName: PropTypes.string,
  pathName: PropTypes.string,
  blacklistUsers: PropTypes.arrayOf(PropTypes.shape()),
  saveBlacklistUsers: PropTypes.func.isRequired,
  saveWhitelistUsers: PropTypes.func.isRequired,
  saveFollowLists: PropTypes.func.isRequired,
  whiteListUsers: PropTypes.arrayOf(PropTypes.shape()),
  followListsUsers: PropTypes.arrayOf(PropTypes.shape()),
};

BlacklistContent.defaultProps = {
  userName: '',
  pathName: '',
  blacklistUsers: [],
  whiteListUsers: [],
  followListsUsers: [],
};

export default injectIntl(BlacklistContent);
