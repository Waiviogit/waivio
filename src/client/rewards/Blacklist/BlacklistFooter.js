import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Button, message } from 'antd';
import { map, filter, get, isEmpty } from 'lodash';
import { changeBlackAndWhiteLists, getBlacklist } from '../rewardsActions';
import {
  getSuccessAddMessage,
  getSuccessDeleteMessage,
  getNoBlacklistMessage,
} from '../rewardsHelper';
import './Blacklist.less';

const BlacklistFooter = ({ intl, users, pathName, clearUsers }) => {
  const dispatch = useDispatch();
  const usersNames = map(users, user => user.account);
  const successAddMessage = getSuccessAddMessage(users, pathName);
  const successDeleteMessage = getSuccessDeleteMessage(users, pathName);
  const noBlacklistsMessage = getNoBlacklistMessage(users);

  const getUsersBlacklist = names => {
    const promises = map(names, name =>
      dispatch(getBlacklist(name)).then(data => {
        const id = get(data, ['value', 'blackList', '_id']);
        return id;
      }),
    );
    return Promise.all(promises);
  };

  const handleAddUsers = async () => {
    let id = 'addUsersToBlackList';
    if (pathName.includes('whitelist')) id = 'addUsersToWhiteList';
    if (pathName.includes('references')) {
      const isFollow = Boolean(pathName.includes('references'));
      id = 'followAnotherBlacklist';
      try {
        let idsUsers = await getUsersBlacklist(usersNames);
        idsUsers = filter(idsUsers, user => user);
        if (!isEmpty(idsUsers)) {
          await dispatch(changeBlackAndWhiteLists(id, idsUsers, isFollow));
          clearUsers();
          message.success(
            intl.formatMessage({
              id: successAddMessage.id,
              defaultMessage: successAddMessage.defaultMessage,
            }),
          );
        } else {
          message.error(
            intl.formatMessage({
              id: noBlacklistsMessage.id,
              defaultMessage: noBlacklistsMessage.defaultMessage,
            }),
          );
        }
      } catch (error) {
        console.error(error);
      }
      return;
    }
    dispatch(changeBlackAndWhiteLists(id, usersNames))
      .then(() => {
        clearUsers();
        message.success(
          intl.formatMessage({
            id: successAddMessage.id,
            defaultMessage: successAddMessage.defaultMessage,
          }),
        );
      })
      .catch(err => console.error(err));
  };

  const handleDeleteUsers = async () => {
    let id = 'removeUsersFromBlackList';
    if (pathName.includes('whitelist')) id = 'removeUsersFromWhiteList';
    if (pathName.includes('references')) {
      const isFollow = Boolean(pathName.includes('references'));
      id = 'unFollowAnotherBlacklist';
      try {
        let idsUsers = await getUsersBlacklist(usersNames);
        idsUsers = filter(idsUsers, user => user);
        if (!isEmpty(idsUsers)) {
          await dispatch(changeBlackAndWhiteLists(id, idsUsers, isFollow));
          clearUsers();
          message.success(
            intl.formatMessage({
              id: successDeleteMessage.id,
              defaultMessage: successDeleteMessage.defaultMessage,
            }),
          );
        } else {
          message.error(
            intl.formatMessage({
              id: noBlacklistsMessage.id,
              defaultMessage: noBlacklistsMessage.defaultMessage,
            }),
          );
        }
      } catch (error) {
        console.error(error);
      }
      return;
    }

    dispatch(changeBlackAndWhiteLists(id, usersNames))
      .then(() => {
        clearUsers();
        message.success(
          intl.formatMessage({
            id: successDeleteMessage.id,
            defaultMessage: successDeleteMessage.defaultMessage,
          }),
        );
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="Blacklist__footer">
      <div className="Blacklist__footer-add">
        <Button type="primary" onClick={handleAddUsers}>
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
      <div className="Blacklist__footer-delete">
        <Button type="primary" onClick={handleDeleteUsers}>
          {pathName.includes('references')
            ? intl.formatMessage({
                id: 'unsubscribe',
                defaultMessage: 'unsubscribe',
              })
            : intl.formatMessage({
                id: 'matchBot_btn_delete',
                defaultMessage: 'Delete',
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
};

BlacklistFooter.defaultProps = {
  users: [],
  pathName: '',
};

export default injectIntl(BlacklistFooter);
