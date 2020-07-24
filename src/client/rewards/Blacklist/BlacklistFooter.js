import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Button, message } from 'antd';
import { map, get, includes, filter } from 'lodash';
import { changeBlackAndWhiteLists, getBlacklist } from '../rewardsActions';
import { getSuccessAddMessage } from '../rewardsHelper';
import './Blacklist.less';

const BlacklistFooter = ({
  intl,
  users,
  pathName,
  clearUsers,
  userName,
  saveBlacklistUsers,
  saveWhitelistUsers,
  saveFollowLists,
}) => {
  console.log('users', users);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const usersNames = map(users, user => user.account);
  const successAddMessage = getSuccessAddMessage(users, pathName);

  const handleAddUsers = async () => {
    setLoading(true);
    let id = 'addUsersToBlackList';
    if (pathName.includes('whitelist')) id = 'addUsersToWhiteList';
    if (pathName.includes('references')) id = 'followAnotherBlacklist';
    dispatch(changeBlackAndWhiteLists(id, usersNames))
      .then(() => {
        setTimeout(() => {
          dispatch(getBlacklist(userName))
            .then(data => {
              if (includes(pathName, 'whitelist')) {
                const whiteList = get(data, ['value', 'blackList', 'whiteList']);
                saveWhitelistUsers(whiteList);
              } else if (includes(pathName, 'references')) {
                const followLists = get(data, ['value', 'blackList', 'followLists']);
                console.log('followLists', followLists);
                const newUsers = filter(
                  users,
                  user => user.account !== map(followLists, list => list.user.name),
                );
                console.log('newUsers', newUsers);
                saveFollowLists(followLists);
              } else {
                const blacklist = get(data, ['value', 'blackList', 'blackList']);
                saveBlacklistUsers(blacklist);
              }
            })
            .then(() => {
              message.success(
                intl.formatMessage({
                  id: successAddMessage.id,
                  defaultMessage: successAddMessage.defaultMessage,
                }),
              );
              clearUsers();
              setLoading(false);
            });
        }, 7000);
      })

      .catch(err => console.error(err));
  };

  return (
    <div className="Blacklist__footer">
      <div className="Blacklist__footer-add">
        <Button type="primary" onClick={handleAddUsers} loading={loading}>
          {pathName.includes('references')
            ? intl.formatMessage({
                id: 'subscribe',
                defaultMessage: 'Subscribe',
              })
            : intl.formatMessage({
                id: 'add_new_proposition',
                defaultMessage: 'Add',
              })}
        </Button>
      </div>
    </div>
  );
};

BlacklistFooter.propTypes = {
  intl: PropTypes.shape().isRequired,
  users: PropTypes.arrayOf(PropTypes.shape()),
  pathName: PropTypes.string,
  clearUsers: PropTypes.func.isRequired,
  userName: PropTypes.string,
  saveBlacklistUsers: PropTypes.func.isRequired,
  saveWhitelistUsers: PropTypes.func.isRequired,
  saveFollowLists: PropTypes.func.isRequired,
};

BlacklistFooter.defaultProps = {
  users: [],
  pathName: '',
  userName: '',
};

export default injectIntl(BlacklistFooter);
