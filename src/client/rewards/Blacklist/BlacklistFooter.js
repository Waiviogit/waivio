import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Button } from 'antd';
import { map, isEmpty } from 'lodash';
import { changeBlackAndWhiteLists } from '../../../store/rewardsStore/rewardsActions';
import { getSuccessAddMessage } from '../rewardsHelper';

import './Blacklist.less';

const BlacklistFooter = ({ intl, users, listType, handleGetBlacklist }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const usersNames = map(users, user => user.account);
  const successAddMessage = getSuccessAddMessage(users, listType);

  const handleAddUsers = async () => {
    if (!isEmpty(usersNames)) {
      await setLoading(true);
      try {
        let id = 'addUsersToBlackList';

        if (listType === 'whitelist') id = 'addUsersToWhiteList';
        if (listType === 'references') id = 'followAnotherBlacklist';

        await dispatch(changeBlackAndWhiteLists(id, usersNames));
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            handleGetBlacklist(successAddMessage)
              .then(() => resolve())
              .catch(error => reject(error));
          }, 7000);
        });
        await setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="Blacklist__footer">
      <div className="Blacklist__footer-add">
        <Button type="primary" onClick={handleAddUsers} loading={loading}>
          {listType === 'references'
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
  listType: PropTypes.string,
  handleGetBlacklist: PropTypes.func.isRequired,
};

BlacklistFooter.defaultProps = {
  users: [],
  listType: '',
};

export default injectIntl(BlacklistFooter);
