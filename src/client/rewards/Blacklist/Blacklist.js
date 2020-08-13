import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import BlacklistContent from './BlacklistContent';
import { getBlacklist } from '../rewardsActions';
import './Blacklist.less';

const Blacklist = ({ intl, userName, match }) => {
  const [blacklistUsers, setBlacklistUsers] = useState([]);
  const [whiteListUsers, setWhitelistUsers] = useState([]);
  const [followListsUsers, setFollowLists] = useState([]);
  const listType = get(match, ['params', 'listType'], 'blacklist');
  const dispatch = useDispatch();
  const saveBlacklistUsers = blacklist => {
    setBlacklistUsers(blacklist);
  };

  const saveWhitelistUsers = whiteList => {
    setWhitelistUsers(whiteList);
  };

  const saveFollowLists = followLists => {
    setFollowLists(followLists);
  };

  useEffect(() => {
    dispatch(getBlacklist(userName)).then(data => {
      const blacklist = get(data, ['value', 'blackList', 'blackList']);
      const whiteList = get(data, ['value', 'blackList', 'whiteList']);
      const followLists = get(data, ['value', 'blackList', 'followLists']);
      saveWhitelistUsers(whiteList);
      saveFollowLists(followLists);
      saveBlacklistUsers(blacklist);
    });
  }, []);

  return (
    <div className="Blacklist">
      <ul className="Blacklist__menu">
        <li className="Blacklist__item">
          <Link
            to="/rewards/blacklist"
            className={classNames('Blacklist__link', {
              'Blacklist__link--active': listType === 'blacklist',
            })}
          >
            {intl.formatMessage({
              id: 'blacklist',
              defaultMessage: 'Blacklist',
            })}
          </Link>
        </li>
        <li className="Blacklist__item">
          <Link
            to="/rewards/blacklist/references"
            className={classNames('Blacklist__link', {
              'Blacklist__link--active': listType === 'references',
            })}
          >
            {intl.formatMessage({
              id: 'references',
              defaultMessage: 'References',
            })}
          </Link>
        </li>
        <li className="Blacklist__item">
          <Link
            to="/rewards/blacklist/whitelist"
            className={classNames('Blacklist__link', {
              'Blacklist__link--active': listType === 'whitelist',
            })}
          >
            {intl.formatMessage({
              id: 'whitelist',
              defaultMessage: 'Whitelist',
            })}
          </Link>
        </li>
      </ul>
      <BlacklistContent
        userName={userName}
        listType={listType}
        blacklistUsers={blacklistUsers}
        saveBlacklistUsers={saveBlacklistUsers}
        whiteListUsers={whiteListUsers}
        saveWhitelistUsers={saveWhitelistUsers}
        followListsUsers={followListsUsers}
        saveFollowLists={saveFollowLists}
      />
    </div>
  );
};

Blacklist.propTypes = {
  intl: PropTypes.shape().isRequired,
  match: PropTypes.shape(),
  userName: PropTypes.string,
};

Blacklist.defaultProps = {
  userName: '',
  match: {},
};

export default injectIntl(Blacklist);
