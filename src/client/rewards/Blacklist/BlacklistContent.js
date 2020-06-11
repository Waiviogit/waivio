import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { filter, isEmpty, map } from 'lodash';
import SearchUsersAutocomplete from '../../components/EditorUser/SearchUsersAutocomplete';
import ReviewItem from '../Create-Edit/ReviewItem';
import { getContent } from '../rewardsHelper';
import './Blacklist.less';

const BlacklistContent = ({ intl, userName, pathname }) => {
  const [users, setUsers] = useState([]);

  const setUserBlacklist = user => setUsers([...users, user]);

  const removeUser = user => {
    const newUsers = filter(users, obj => obj.account !== user.account);
    setUsers(newUsers);
  };

  const renderUser = !isEmpty(users)
    ? map(users, user => (
        <ReviewItem key={user.id} object={user} removeReviewObject={removeUser} isUser />
      ))
    : null;

  const title = pathname ? getContent(pathname).title : '';
  const caption = pathname ? getContent(pathname).caption : '';

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
        {!pathname.includes('references') && <Link to={`/@${userName}`}>{userName}</Link>}
      </div>
      <div className="Blacklist__content-objects-wrap">{renderUser}</div>
    </div>
  );
};

BlacklistContent.propTypes = {
  intl: PropTypes.shape().isRequired,
  userName: PropTypes.string,
  pathname: PropTypes.string,
};

BlacklistContent.defaultProps = {
  userName: '',
  pathname: '',
};

export default injectIntl(BlacklistContent);
