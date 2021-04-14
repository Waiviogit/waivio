import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import { filter, get, isEmpty, map, reverse } from 'lodash';
import classNames from 'classnames';
import SearchUsersAutocomplete from '../../components/EditorUser/SearchUsersAutocomplete';
import ReviewItem from '../Create-Edit/ReviewItem';
import { getContent, getSuccessDeleteMessage } from '../rewardsHelper';
import BlacklistFooter from './BlacklistFooter';
import BlacklistUser from './BlacklistUser';
import { changeBlackAndWhiteLists, getBlacklist } from '../../store/rewardsStore/rewardsActions';

import './Blacklist.less';

const BlacklistContent = ({
  intl,
  userName,
  listType,
  blacklistUsers,
  saveBlacklistUsers,
  whiteListUsers,
  saveWhitelistUsers,
  followListsUsers,
  saveFollowLists,
}) => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const successDeleteMessage = getSuccessDeleteMessage(users, listType);
  const setUserBlacklist = user => setUsers([...users, user]);

  const getUsersForRender = useMemo(() => {
    if (listType === 'whitelist') {
      return reverse(whiteListUsers);
    } else if (listType === 'references') {
      return reverse(followListsUsers);
    }

    return reverse(blacklistUsers);
  }, [listType, whiteListUsers, followListsUsers, blacklistUsers]);

  const removeUser = user => {
    const newUsers = filter(users, obj => obj.account !== user.account);

    setUsers(newUsers);
  };

  const getTitle = useMemo(() => {
    if (listType === 'whitelist') {
      return intl.formatMessage({
        id: 'whitelist',
        defaultMessage: 'Whitelist',
      });
    } else if (listType === 'references') {
      return intl.formatMessage({
        id: 'references',
        defaultMessage: 'References',
      });
    }

    return intl.formatMessage({
      id: 'blacklist',
      defaultMessage: 'Blacklist',
    });
  }, [listType, intl]);

  const clearUsers = () => setUsers([]);

  const handleGetBlacklist = async messageSuccess => {
    try {
      const data = await dispatch(getBlacklist(userName));

      if (listType === 'whitelist') {
        const whiteList = get(data, ['value', 'blackList', 'whiteList']);

        await saveWhitelistUsers(whiteList);
      } else if (listType === 'references') {
        const followLists = get(data, ['value', 'blackList', 'followLists']);

        await saveFollowLists(followLists);
      } else {
        const blacklist = get(data, ['value', 'blackList', 'blackList']);

        await saveBlacklistUsers(blacklist);
      }
      message.success(
        intl.formatMessage({
          id: messageSuccess.id,
          defaultMessage: messageSuccess.defaultMessage,
        }),
      );
      clearUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUsers = async user => {
    try {
      let id = 'removeUsersFromBlackList';

      if (listType === 'whitelist') id = 'removeUsersFromWhiteList';
      if (listType === 'references') id = 'unFollowAnotherBlacklist';
      if (user) {
        await dispatch(changeBlackAndWhiteLists(id, [user]));
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            handleGetBlacklist(successDeleteMessage)
              .then(() => resolve())
              .catch(error => reject(error));
          }, 7000);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderUser = !isEmpty(users)
    ? map(users, user => (
        <ReviewItem key={user.id} object={user} removeReviewObject={removeUser} isUser />
      ))
    : null;

  const title = listType ? getContent(listType).title : '';
  const caption = listType ? getContent(listType).caption : '';

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
        {listType !== 'references' && <Link to={`/@${userName}`}>{userName}</Link>}
      </div>
      <div className="Blacklist__content-objects-wrap">{renderUser}</div>
      <BlacklistFooter
        users={users}
        listType={listType}
        clearUsers={clearUsers}
        userName={userName}
        saveBlacklistUsers={saveBlacklistUsers}
        saveWhitelistUsers={saveWhitelistUsers}
        saveFollowLists={saveFollowLists}
        handleGetBlacklist={handleGetBlacklist}
      />
      <div className="Blacklist__content-title-blacklist">{getTitle}</div>
      <div
        className={classNames('Blacklist__content-blacklist', {
          empty: isEmpty(getUsersForRender),
        })}
      >
        {!isEmpty(getUsersForRender)
          ? map(getUsersForRender, user => (
              <BlacklistUser user={user} handleDeleteUsers={handleDeleteUsers} />
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
  listType: PropTypes.string,
  blacklistUsers: PropTypes.arrayOf(PropTypes.shape()),
  saveBlacklistUsers: PropTypes.func.isRequired,
  saveWhitelistUsers: PropTypes.func.isRequired,
  saveFollowLists: PropTypes.func.isRequired,
  whiteListUsers: PropTypes.arrayOf(PropTypes.shape()),
  followListsUsers: PropTypes.arrayOf(PropTypes.shape()),
};

BlacklistContent.defaultProps = {
  userName: '',
  listType: '',
  blacklistUsers: [],
  whiteListUsers: [],
  followListsUsers: [],
};

export default injectIntl(BlacklistContent);
