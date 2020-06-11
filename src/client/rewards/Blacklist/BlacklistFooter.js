import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Button } from 'antd';
import { changeBlackAndWhiteLists } from '../rewardsActions';
import './Blacklist.less';

const BlacklistFooter = ({ intl, users }) => {
  console.log('users', users);
  const dispatch = useDispatch();
  const handleAddUsers = () => {
    const id = 'addUsersToBlackList';

    dispatch(changeBlackAndWhiteLists(id, users));
    console.log('add');
  };

  const handleDeleteUsers = () => {
    console.log('delete');
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
};

BlacklistFooter.defaultProps = {
  users: [],
};

export default injectIntl(BlacklistFooter);
