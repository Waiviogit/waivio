import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Button, message } from 'antd';
import { map } from 'lodash';
import { changeBlackAndWhiteLists } from '../rewardsActions';
import { getSuccessAddMessage, getSuccessDeleteMessage } from '../rewardsHelper';
import './Blacklist.less';

const BlacklistFooter = ({ intl, users, pathName, clearUsers }) => {
  console.log('users', users);
  const dispatch = useDispatch();
  const usersNames = map(users, user => user.account);
  const successAddMessage = getSuccessAddMessage(users, pathName);
  const successDeleteMessage = getSuccessDeleteMessage(users, pathName);

  const handleAddUsers = () => {
    const id = 'addUsersToBlackList';
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

  const handleDeleteUsers = () => {
    const id = 'removeUsersFromBlackList';
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
          {intl.formatMessage({
            id: 'add_new_proposition',
            defaultMessage: 'Add',
          })}
        </Button>
      </div>
      <div className="Blacklist__footer-delete">
        <Button type="primary" onClick={handleDeleteUsers}>
          {intl.formatMessage({
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
