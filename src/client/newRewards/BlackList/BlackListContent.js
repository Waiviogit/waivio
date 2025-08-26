import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { Button } from 'antd';
import { isEmpty, map } from 'lodash';
import SearchUsersAutocomplete from '../../components/EditorUser/SearchUsersAutocomplete';
import BlacklistUser from './BlacklistUser';
import SelectUserForAutocomplete from '../../widgets/SelectUserForAutocomplete';
import { changeBlackAndWhiteLists } from '../../../store/rewardsStore/rewardsActions';
import EmptyCampaing from '../../statics/EmptyCampaign';

import './Blacklist.less';

const BlacklistContentNew = ({
  intl,
  title,
  userList,
  caption,
  type,
  buttonTitle,
  ids,
  setMainList,
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleAddUser = user => setUsers([user, ...users]);

  const handledeleteUser = usrName => {
    setUsers(users.filter(user => user.account !== usrName));
  };

  const handleSaveListUsers = () => {
    setLoading(true);
    dispatch(
      changeBlackAndWhiteLists(
        ids.add,
        users.map(usr => usr.account),
      ),
    ).then(res => {
      if (!res.value.error) {
        setMainList([...userList, ...users.map(usr => ({ ...usr, name: usr.account }))]);
        setUsers([]);
      }

      setLoading(false);
    });
  };

  const handleDeleteListUser = user => {
    dispatch(changeBlackAndWhiteLists(ids.remove, [user])).then(() => {
      setMainList(userList.filter(usr => usr.name !== user));
    });
  };

  return (
    <div className="Blacklist">
      <h4 className="Blacklist__title">{title}</h4>
      <SearchUsersAutocomplete
        allowClear={false}
        handleSelect={handleAddUser}
        placeholder={intl.formatMessage({
          id: 'find_users_placeholder',
          defaultMessage: 'Find user',
        })}
        style={{ width: '100%' }}
        autoFocus={false}
        itemsIdsToOmit={[...users, ...userList].map(user => user.account)}
      />
      <p className="Blacklist__caption">{caption}</p>
      {!isEmpty(users) && (
        <div className="Blacklist__selectUserList">
          {users.map(user => (
            <SelectUserForAutocomplete
              key={user.account}
              account={user.account}
              resetUser={handledeleteUser}
            />
          ))}
        </div>
      )}
      <div className="Blacklist__button-container">
        <Button
          disabled={isEmpty(users)}
          loading={loading}
          type="primary"
          onClick={handleSaveListUsers}
          className="Blacklist__button"
        >
          {buttonTitle}
        </Button>
      </div>
      <h3 className="Blacklist__title">{type}</h3>
      {!isEmpty(userList) ? (
        <div className="Blacklist__container">
          {map(userList, user => (
            <BlacklistUser user={user} handleDeleteUsers={handleDeleteListUser} />
          ))}
        </div>
      ) : (
        <EmptyCampaing
          emptyMessage={intl.formatMessage({
            id: 'your_list_is_empty',
            defaultMessage: 'Your list is empty',
          })}
        />
      )}
    </div>
  );
};

BlacklistContentNew.propTypes = {
  intl: PropTypes.shape().isRequired,
  buttonTitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  userList: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  caption: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  ids: PropTypes.shape({
    remove: PropTypes.string,
    add: PropTypes.string,
  }).isRequired,
  setMainList: PropTypes.func.isRequired,
};

BlacklistContentNew.defaultProps = {
  buttonTitle: 'Add',
};

export default injectIntl(BlacklistContentNew);
