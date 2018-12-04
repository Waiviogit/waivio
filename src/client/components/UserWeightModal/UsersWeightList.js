import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import InfiniteSroll from 'react-infinite-scroller';
import { Scrollbars } from 'react-custom-scrollbars';
import UserWeight from '../Sidebar/UserWeight';
import './UsersWeightList.less';

export default class UsersWeightList extends Component {
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    users: [],
  };

  state = { page: 1 };

  paginate = () => this.setState(prevState => ({ page: prevState.page + 1 }));

  render() {
    const defaultPageItems = 20;
    const noOfItemsToShow = defaultPageItems * this.state.page;

    const { users } = this.props;

    return (
      <Scrollbars autoHide style={{ height: '400px' }}>
        <InfiniteSroll
          pageStart={0}
          loadMore={this.paginate}
          hasMore={users.length > noOfItemsToShow}
          useWindow={false}
        >
          <div className="UsersWeightList__content">
            {users && _.map(users, user => <UserWeight key={user.name} user={user} />)}
          </div>
        </InfiniteSroll>
      </Scrollbars>
    );
  }
}
