import React from 'react';
import { Button, Input, Modal } from 'antd';
import { isEmpty, map } from 'lodash';
import { useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Loading from '../../../components/Icon/Loading';
import BlacklistUser from '../../../newRewards/BlackList/BlacklistUser';
import EmptyCampaing from '../../../statics/EmptyCampaign';
import { blockAdminSpamUser, getAdminSpamUserDetails } from '../../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';

const AdminSpamUsers = ({
  setShowDetails,
  open,
  setBlockedUsers,
  handleSearch,
  limit,
  hasMore,
  loadMore,
  search,
  loading,
  users,
  intl,
  blockedUsers,
  setHasMoreDetails,
  setDetails,
  setUser,
  setOpen,
  listLoading,
  user,
}) => {
  const authUserName = useSelector(getAuthenticatedUserName);

  const blockUser = () => {
    if (blockedUsers.includes(user.name)) {
      blockAdminSpamUser(authUserName, user.name, false).then(() => {
        setBlockedUsers(blockedUsers.filter(u => u !== user.name));
      });
    } else {
      blockAdminSpamUser(authUserName, user.name, true).then(() => {
        setBlockedUsers([...blockedUsers, user.name]);
      });
    }

    setOpen(false);
  };

  const getUserDetails = spamUser => {
    getAdminSpamUserDetails(authUserName, spamUser).then(r => {
      setDetails(r.result);
      setHasMoreDetails(r.hasMore);
    });
  };

  return loading ? (
    <Loading />
  ) : (
    <div>
      <div className={'AdminPage min-width'}>
        <Input onChange={e => handleSearch(e.currentTarget.value)} placeholder={'Find users'} />
        <br />
        {
          <>
            {!isEmpty(users) ? (
              <div className="WhitelistContent__container" style={{ marginTop: '20px' }}>
                {map(users, u => {
                  const isBlocked = blockedUsers.includes(u.name);

                  return (
                    <BlacklistUser
                      key={u.name}
                      user={u}
                      customBtn={
                        <div className="Blacklist__user__profile__delete">
                          <>
                            <Button
                              type="secondary"
                              className={
                                ' WalletAction__button WalletAction__button--withoutSelect'
                              }
                              onClick={() => {
                                getUserDetails(u.name);
                                setShowDetails(true);
                              }}
                              id={u.name}
                            >
                              Details
                            </Button>
                            <Button
                              type="secondary"
                              className="WalletAction__button WalletAction__button--withoutSelect ml2"
                              onClick={() => {
                                setUser(u);
                                setOpen(true);
                              }}
                              id={u.name}
                            >
                              {isBlocked ? 'Unblock' : 'Block'}
                            </Button>
                          </>
                        </div>
                      }
                    />
                  );
                })}
                {listLoading ? (
                  <Loading />
                ) : (
                  users.length >= limit &&
                  hasMore &&
                  isEmpty(search) && (
                    <div className="Blacklist__show-more" onClick={loadMore}>
                      Show more
                    </div>
                  )
                )}
              </div>
            ) : (
              <EmptyCampaing
                emptyMessage={intl.formatMessage({
                  id: 'no_results',
                  defaultMessage: 'No results',
                })}
              />
            )}
          </>
        }
        <br />
      </div>
      <Modal
        visible={open}
        onOk={blockUser}
        okText={'Confirm'}
        open={open}
        onCancel={() => setOpen(false)}
        title={blockedUsers.includes(user.name) ? `Unblock ${user.name}` : `Block ${user.name}`}
      >
        <span className={blockedUsers.includes(user.name) ? 'flex justify-center' : ''}>
          {blockedUsers.includes(user.name)
            ? 'Are you sure you want to unblock this user?'
            : "Are you sure you want to block this user? Once blocked, the user won't be able to perform any actions. You can unblock them later if needed."}
        </span>
      </Modal>
    </div>
  );
};

AdminSpamUsers.propTypes = {
  handleSearch: PropTypes.func,
  setUser: PropTypes.func,
  setOpen: PropTypes.func,
  setDetails: PropTypes.func,
  setHasMoreDetails: PropTypes.func,
  setBlockedUsers: PropTypes.func,
  setShowDetails: PropTypes.func,
  loadMore: PropTypes.func,
  users: PropTypes.arrayOf(),
  blockedUsers: PropTypes.arrayOf(),
  user: PropTypes.shape(),
  loading: PropTypes.bool,
  intl: PropTypes.bool,
  listLoading: PropTypes.bool,
  hasMore: PropTypes.bool,
  open: PropTypes.bool,
  search: PropTypes.string,
  limit: PropTypes.number,
};

export default injectIntl(AdminSpamUsers);
