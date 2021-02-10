import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { get, size } from 'lodash';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { Link } from 'react-router-dom';

import {
  getAuthenticatedUserName,
  getMuteLoading,
  getRestrictions,
  getUnmutedUsers,
  getWebsiteLoading,
} from '../../../reducers';
import { getWebsiteRestrictions, muteUser } from '../../websiteActions';
import SearchUsersAutocomplete from '../../../components/EditorUser/SearchUsersAutocomplete';
import Action from '../../../components/Button/Action';
import SortSelector from '../../../components/SortSelector/SortSelector';
import { SORT_OPTIONS_WOBJ } from '../../../../common/constants/waivioFiltres';
import UserCard from '../../../components/UserCard';
import WeightTag from '../../../components/WeightTag';
import SelectUserForAutocomplete from '../../../widgets/SelectUserForAutocomplete';

import './WebsiteRestrictions.less';

export const WebsiteRestrictions = ({
  match,
  intl,
  restrictions,
  getWebsiteRestrictionsInfo,
  authUser,
  handleMuteUser,
  loading,
  unmutedUsers,
}) => {
  const [sort, setSort] = useState(SORT_OPTIONS_WOBJ.WEIGHT);
  const [mutedUser, setMutedUser] = useState('');
  const host = match.params.site;
  const mutedUsers = get(restrictions, 'mutedUsers', []);
  const blacklistUsers = get(restrictions, 'blacklistUsers', []);

  useEffect(() => {
    getWebsiteRestrictionsInfo(host, authUser);
  }, [host]);

  const handleClickMute = () => {
    handleMuteUser(authUser, [mutedUser], ['ignore'], host);
    setMutedUser('');
  };

  const tableUsers = (list, withoutButton = false) => (
    <div className="WebsiteRestrictions__table-users">
      {size(list) ? (
        list.map(user => (
          <div key={user.name} className="WebsiteRestrictions__user">
            <UserCard user={user} alt={<WeightTag weight={user.wobjects_weight} />} withoutLine />
            {user.blockedBy.includes(authUser) && !withoutButton ? (
              <Action
                primary
                onClick={() => handleMuteUser(authUser, [user.name], [], host)}
                loading={unmutedUsers.includes(user.name)}
              >
                {intl.formatMessage({ id: 'unmute', defaultMessage: 'Unmute' })}
              </Action>
            ) : (
              <div className="WebsiteRestrictions__blocked">
                {user.blockedBy.map(block => (
                  <span key={block}>@{block}</span>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="WebsiteRestrictions__empty">
          {intl.formatMessage({
            id: 'mute_empty',
            defaultMessage: 'Empty table',
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="WebsiteRestrictions">
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane
          tab={`${intl.formatMessage({
            id: 'muted',
            defaultMessage: 'Muted',
          })} ${get(restrictions, 'mutedCount', 0)}`}
          key="1"
        >
          <p>
            {intl.formatMessage({
              id: 'website_mute_list',
              defaultMessage:
                'Website administrators can add users to blacklists. All object updates and votes on updates from' +
                'blacklisted users are ignored. The website owner can also add users to their blacklist.' +
                'They can also add users to their whitelist to override any other blacklist.',
            })}
          </p>
          <h3>
            {intl.formatMessage({
              id: 'mute_users',
              defaultMessage: 'Mute users',
            })}
            :
          </h3>
          {mutedUser ? (
            <SelectUserForAutocomplete account={mutedUser} resetUser={() => setMutedUser(null)} />
          ) : (
            <SearchUsersAutocomplete
              className="WebsiteRestrictions__autocomplete"
              handleSelect={user => setMutedUser(user.account)}
            />
          )}
          <div className="WebsiteRestrictions__button-wrap">
            <Action
              primary
              className="WebsiteRestrictions__button"
              loading={loading}
              onClick={handleClickMute}
              disabled={!mutedUser || loading}
            >
              {intl.formatMessage({
                id: 'mute',
                defaultMessage: 'Mute',
              })}
            </Action>
          </div>
          <h3>
            {intl.formatMessage({
              id: 'muted_users',
              defaultMessage: 'Muted users',
            })}
            :
          </h3>
          <SortSelector sort={sort} onChange={setSort}>
            <SortSelector.Item key={SORT_OPTIONS_WOBJ.WEIGHT}>
              {intl.formatMessage({ id: 'rank', defaultMessage: 'Rank' })}
            </SortSelector.Item>
            <SortSelector.Item key={SORT_OPTIONS_WOBJ.RECENCY}>
              {intl.formatMessage({ id: 'recency', defaultMessage: 'Recency' })}
            </SortSelector.Item>
          </SortSelector>
          {tableUsers(mutedUsers)}
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={`${intl.formatMessage({
            id: 'blacklisted',
            defaultMessage: 'Blacklisted',
          })} ${get(restrictions, 'blacklistedCount', 0)}`}
          key="2"
        >
          <p>
            {intl.formatMessage({
              id: 'website_black_list',
              defaultMessage:
                'Website administrators can add users to blacklists. All object updates and votes on updates from' +
                'blacklisted users are ignored. The website owner can also add users to their blacklist. They can' +
                'also add users to their whitelist to override any other blacklist.',
            })}
          </p>
          <Link to="/rewards/blacklist" className="WebsiteRestrictions__link">
            {intl.formatMessage({
              id: 'website_manage_black_list',
              defaultMessage: 'Manage blacklist/whitelist',
            })}
          </Link>
          {tableUsers(blacklistUsers, true)}
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

WebsiteRestrictions.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      site: PropTypes.string,
    }),
  }).isRequired,
  restrictions: PropTypes.shape({}).isRequired,
  unmutedUsers: PropTypes.arrayOf(PropTypes.string).isRequired,
  getWebsiteRestrictionsInfo: PropTypes.func.isRequired,
  handleMuteUser: PropTypes.func.isRequired,
  authUser: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default connect(
  state => ({
    isLoading: getWebsiteLoading(state),
    restrictions: getRestrictions(state),
    authUser: getAuthenticatedUserName(state),
    loading: getMuteLoading(state),
    unmutedUsers: getUnmutedUsers(state),
  }),
  {
    getWebsiteRestrictionsInfo: getWebsiteRestrictions,
    handleMuteUser: muteUser,
  },
)(injectIntl(WebsiteRestrictions));
