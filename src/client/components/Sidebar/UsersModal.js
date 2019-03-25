import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import InfiniteSroll from 'react-infinite-scroller';
import { Scrollbars } from 'react-custom-scrollbars';
import UserCard from '../UserCard';
import WeightTag from '../WeightTag';

export default class UsersModal extends React.Component {
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.shape()),
    visible: PropTypes.bool,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    users: [],
    visible: false,
    onClose: () => {},
  };

  state = { page: 1 };

  paginate = () => this.setState(prevState => ({ page: prevState.page + 1 }));

  render() {
    const { visible, users, onClose } = this.props;
    const defaultPageItems = 20;
    const noOfItemsToShow = defaultPageItems * this.state.page;

    return (
      <Modal visible={visible && users.length > 0} footer={null} onCancel={onClose}>
        <Scrollbars autoHide style={{ height: '400px' }}>
          <InfiniteSroll
            pageStart={0}
            loadMore={this.paginate}
            hasMore={users.length > noOfItemsToShow}
            useWindow={false}
          >
            <div className="UsersWeightList__content">
              {users &&
                users.map(user => (
                  <UserCard
                    key={user.name}
                    user={user}
                    alt={<WeightTag rank={user.rank} weight={user.weight} />}
                  />
                ))}
            </div>
          </InfiniteSroll>
        </Scrollbars>
      </Modal>
    );
  }
}
