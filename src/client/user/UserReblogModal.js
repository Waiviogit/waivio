import React, { useState } from 'react';
import { FormattedNumber } from 'react-intl';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import InfiniteScroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';
import { Modal, Tabs } from 'antd';
import DiscoverUser from '../discover/DiscoverUser';
import { getUsers } from '../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../store/reducers';
import { followUser, unfollowUser } from './usersActions';
import Loading from '../components/Icon/Loading';

import './UserReblogModal.less';

const UserReblogModal = ({
  visible,
  userNames,
  onCancel,
  unfollow,
  follow,
  authenticatedUserName,
}) => {
  const [users, setUsers] = useState([]);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);

  const loadMoreUsers = () => {
    getUsers({
      listUsers: userNames,
      userName: authenticatedUserName,
      skip: users.length,
      limit: 20,
    }).then(data => {
      setUsers([...users, ...data.users]);
      setHasMoreUsers(data.hasMore);
    });
  };
  const followUsr = user => {
    const usersList = [...users];
    const findUserIndex = usersList.findIndex(usr => user === usr.name);

    usersList.splice(findUserIndex, 1, {
      ...usersList[findUserIndex],
      pending: true,
    });

    setUsers([...usersList]);
    follow(user).then(() => {
      usersList.splice(findUserIndex, 1, {
        ...usersList[findUserIndex],
        pending: false,
        youFollows: true,
      });

      setUsers([...usersList]);
    });
  };

  const unfollowUsr = user => {
    const usersList = [...users];
    const findUserIndex = usersList.findIndex(usr => user === usr.name);

    usersList.splice(findUserIndex, 1, {
      ...usersList[findUserIndex],
      pending: true,
    });

    setUsers([...usersList]);

    unfollow(user).then(() => {
      usersList.splice(findUserIndex, 1, {
        ...usersList[findUserIndex],
        youFollows: false,
        pending: false,
      });

      setUsers([...usersList]);
    });
  };

  return (
    <Modal wrapClassName="UserReblogModal" visible={visible} footer={null} onCancel={onCancel}>
      <Tabs>
        <Tabs.TabPane
          tab={
            <div className="UserReblogModal__header">
              <i className="iconfont icon-share1 share" />
              <FormattedNumber value={userNames.length} />
            </div>
          }
          key="1"
        >
          <Scrollbars autoHide style={{ height: '400px' }}>
            <InfiniteScroll
              loadMore={loadMoreUsers}
              hasMore={hasMoreUsers}
              useWindow={false}
              loader={<Loading />}
            >
              <div className="UserReblogModal__content">
                {users.map(user => (
                  <DiscoverUser
                    // eslint-disable-next-line no-underscore-dangle
                    key={user._id}
                    user={user}
                    isReblogged
                    unfollow={unfollowUsr}
                    follow={followUsr}
                  />
                ))}
              </div>
            </InfiniteScroll>
          </Scrollbars>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};

export default connect(
  state => ({
    authenticatedUserName: getAuthenticatedUserName(state),
  }),
  {
    unfollow: unfollowUser,
    follow: followUser,
  },
)(UserReblogModal);

UserReblogModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  userNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCancel: PropTypes.func.isRequired,
  unfollow: PropTypes.func.isRequired,
  follow: PropTypes.func.isRequired,
  authenticatedUserName: PropTypes.string.isRequired,
};
