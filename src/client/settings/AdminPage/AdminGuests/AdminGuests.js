import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Cookie from 'js-cookie';
import { injectIntl } from 'react-intl';
import { Button, Input, Tabs } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isEmpty, map } from 'lodash';
import { useHistory } from 'react-router';
import { Link, useLocation } from 'react-router-dom';
import Affix from '../../../components/Utils/Affix';
import LeftSidebar from '../../../app/Sidebar/LeftSidebar';
import MobileNavigation from '../../../components/Navigation/MobileNavigation/MobileNavigation';
import Loading from '../../../components/Icon/Loading';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../../../../store/authStore/authSelectors';

import { getAdminGuests } from '../../../../waivioApi/ApiClient';
import BlacklistUser from '../../../newRewards/BlackList/BlacklistUser';
import EmptyCampaing from '../../../statics/EmptyCampaign';
import { muteUser } from '../../../../store/websiteStore/websiteActions';

const tabs = {
  users: 'users',
  spam: 'spam',
};

const limit = 100;

const AdminGuests = ({ intl }) => {
  const [users, setGuestUsers] = useState([]);
  const [muted, setMuted] = useState([]);
  const [search, setSearch] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const authUserName = useSelector(getAuthenticatedUserName);
  const isAuth = useSelector(getIsAuthenticated);
  const dispatch = useDispatch();
  const history = useHistory();
  const appAdmins = Cookie.get('appAdmins');
  const iaAppAdmin = appAdmins?.includes(authUserName);
  const searchString = isEmpty(search) ? undefined : search;

  const location = useLocation();

  const title = `Admin guests`;

  const getActiveTab = () => {
    const active = Object.entries(tabs).find(([, value]) => location.pathname.includes(value));

    return active ? active[1] : tabs.users;
  };

  const handleClickMute = (userName, action) => {
    dispatch(muteUser(authUserName, userName, action));
  };

  useEffect(() => {
    if (isAuth && iaAppAdmin) {
      setLoading(true);
      getAdminGuests(authUserName, 0, limit).then(r => {
        setGuestUsers(r.result);
        setHasMore(r.hasMore);

        const initiallyMuted = r.result
          .filter(u => u.mutedBy?.includes(authUserName))
          .map(u => u.name);

        setMuted(initiallyMuted);

        setLoading(false);
      });
    } else {
      history.push('/');
    }
  }, [isAuth, authUserName]);

  const loadMore = () => {
    getAdminGuests(authUserName, users.length, limit, searchString).then(r => {
      setGuestUsers([...users, ...r.result]);

      const newMuted = r.result.filter(u => u.mutedBy?.includes(authUserName)).map(u => u.name);

      setMuted(prev => [...prev, ...newMuted.filter(name => !prev.includes(name))]);
    });
  };

  useEffect(() => {
    getAdminGuests(authUserName, 0, limit, searchString).then(r => setGuestUsers(r.result));
  }, [search.length]);

  return (
    <div className="shifted">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="container settings-layout">
        <Affix className="leftContainer" stickPosition={77}>
          <div className="left">
            <LeftSidebar />
          </div>
        </Affix>
        <div className={classNames('center')}>
          <MobileNavigation />
          {loading ? (
            <Loading />
          ) : (
            <div>
              <Tabs className="Wallets" activeKey={getActiveTab()} animated={false}>
                <Tabs.TabPane tab={<Link to="/admin-guests">Users</Link>} key={tabs.users}>
                  <div className={'AdminPage min-width'}>
                    <Input
                      onInput={e => setSearch(e.currentTarget.value)}
                      placeholder={'Find users'}
                    />
                    <br />
                    {!isEmpty(users) ? (
                      <div className="WhitelistContent__container" style={{ marginTop: '20px' }}>
                        {map(users, u => {
                          const isMuted = muted.includes(u.name);
                          const isInMuted = u.mutedBy.includes(authUserName);

                          return (
                            <BlacklistUser
                              key={u.name}
                              user={u}
                              customBtn={
                                <div className="Blacklist__user__profile__delete">
                                  {!isInMuted && !isEmpty(u.mutedBy) ? (
                                    <div className={'Blacklist__guide'}>
                                      Muted by:{' '}
                                      {u.mutedBy?.map((user, i) => (
                                        <React.Fragment key={user}>
                                          <a className={'Blacklist__guide'} href={`/@${user}`}>
                                            @{user}
                                          </a>
                                          {i < u.mutedBy.length - 1 && ', '}
                                        </React.Fragment>
                                      ))}
                                    </div>
                                  ) : (
                                    <Button
                                      type="secondary"
                                      onClick={() => {
                                        handleClickMute(u.name, isMuted ? [] : ['ignore']);
                                        setMuted(prev =>
                                          isMuted
                                            ? prev.filter(name => name !== u.name)
                                            : [...prev, u.name],
                                        );
                                      }}
                                      id={u.name}
                                    >
                                      {isMuted ? 'Unmute' : 'Mute'}
                                    </Button>
                                  )}
                                </div>
                              }
                            />
                          );
                        })}
                        {users.length >= limit && hasMore && isEmpty(search) && (
                          <div className="Blacklist__show-more" onClick={loadMore}>
                            Show more
                          </div>
                        )}
                      </div>
                    ) : (
                      <EmptyCampaing
                        emptyMessage={intl.formatMessage({
                          id: 'your_list_is_empty',
                          defaultMessage: 'Your list is empty',
                        })}
                      />
                    )}
                    <br />
                  </div>
                </Tabs.TabPane>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

AdminGuests.propTypes = {
  intl: PropTypes.shape().isRequired,
};
export default injectIntl(AdminGuests);
