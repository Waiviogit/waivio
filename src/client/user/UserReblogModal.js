import React, { useState } from 'react';
import { FormattedNumber } from 'react-intl';
import { Scrollbars } from 'react-custom-scrollbars';
import InfiniteScroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import DiscoverUser from '../discover/DiscoverUser';
import { getUsers } from '../../waivioApi/ApiClient';
import './UserReblogModal.less';

const UserReblogModal = ({ visible, userNames, onCancel }) => {
  const [users, setUsers] = useState([]);

  const loadMoreUsers = () => {
    const firstIndex = users.length;
    const lastIndex = users.length + 20;
    getUsers(userNames.slice(firstIndex, lastIndex)).then(data => setUsers([...users, ...data]));
  };

  return (
    <Modal visible={visible} footer={null} onCancel={onCancel}>
      <div className="UserReblogModal">
        <div className="UserReblogModal__header">
          <div className="icon">
            <i className="iconfont icon-share1 share" />
            <FormattedNumber value={userNames.length} />
          </div>
        </div>
        <Scrollbars autoHide style={{ height: '250px' }}>
          <InfiniteScroll
            pageStart={0}
            loadMore={loadMoreUsers}
            hasMore={userNames.length > users.length}
            useWindow={false}
          >
            {users.map(user => (
              <DiscoverUser user={user} isSecondaryButton />
            ))}
          </InfiniteScroll>
        </Scrollbars>
      </div>
    </Modal>
  );
};

export default UserReblogModal;

UserReblogModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  userNames: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onCancel: PropTypes.func.isRequired,
};
