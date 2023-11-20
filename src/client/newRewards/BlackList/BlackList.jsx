import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Tabs } from 'antd';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { getBlackListInfo } from '../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import BlacklistContentNew from './BlackListContent';
import ids from './constants';

const Blacklist = ({ intl }) => {
  const userName = useSelector(getAuthenticatedUserName);
  const [blacklistUsers, setBlacklistUsers] = useState([]);
  const [whiteListUsers, setWhitelistUsers] = useState([]);
  const [followListsUsers, setFollowLists] = useState([]);

  useEffect(() => {
    getBlackListInfo(userName).then(data => {
      setWhitelistUsers(data?.whiteList);
      setFollowLists(data?.followLists);
      setBlacklistUsers(data?.blackList);
    });
  }, []);

  return (
    <div>
      <Tabs className={'Blacklist__tabs'}>
        <Tabs.TabPane
          tab={intl.formatMessage({
            id: 'blacklist',
            defaultMessage: 'Blacklist',
          })}
          key="item-1"
        >
          <BlacklistContentNew
            type={'Blacklist'}
            title={'Add user to the blacklist'}
            caption={
              <p>
                Blacklisted users cannot participate in any campaign sponsored by{' '}
                <Link to={`/@${userName}`}>{userName}</Link>
              </p>
            }
            userList={blacklistUsers}
            ids={ids.blackList}
            setMainList={setBlacklistUsers}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={intl.formatMessage({
            id: 'references',
            defaultMessage: 'References',
          })}
          key="item-2"
        >
          <BlacklistContentNew
            buttonTitle={'Subscribe'}
            title={'Recognize other users blacklists'}
            type={'References'}
            caption={
              "When you reference another user's blacklist, you also recognize all other blacklists referred to by that user"
            }
            userList={followListsUsers}
            ids={ids.followList}
            setMainList={setFollowLists}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={intl.formatMessage({
            id: 'whitelist',
            defaultMessage: 'Whitelist',
          })}
          key="item-3"
        >
          <BlacklistContentNew
            type={'Whitelist'}
            userList={whiteListUsers}
            title={'Add user to the whitelist'}
            caption={
              <p>
                Whitelisted users can participate in any campaign (subject to campaign eligibility
                criteria) sponsored by <Link to={`/@${userName}`}>{userName}</Link>
              </p>
            }
            ids={ids.whiteList}
            setMainList={setWhitelistUsers}
          />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

Blacklist.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(Blacklist);
