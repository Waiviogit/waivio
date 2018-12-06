import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import UserWeight from './UserWeight';
import './InterestingObjects.less';
import './SidebarContentBlock.less';
import UsersWeightModal from '../UserWeightModal/UsersWeightModal';

class UsersWeightList extends Component {
  state = {
    modalVisible: false,
  };

  handleCloseModal = () => this.setState({ modalVisible: false });

  handleOpenModal = () => this.setState({ modalVisible: true });

  render() {
    const { users } = this.props;
    return (
      <div className="InterestingObjects SidebarContentBlock">
        <h4 className="SidebarContentBlock__title">
          <i className="iconfont icon-collection SidebarContentBlock__icon" />{' '}
          <FormattedMessage id="top_authors" defaultMessage="Top Authors" />
        </h4>
        <div className="SidebarContentBlock__content">
          {users && _.map(_.slice(users, 0, 5), user => <UserWeight key={user.name} user={user} />)}
          {_.size(users) > 5 && (
            <React.Fragment>
              <h4 className="InterestingPeople__more">
                <a role="presentation" onClick={this.handleOpenModal}>
                  <FormattedMessage id="show_more_authors" defaultMessage="Show more authors" />
                </a>
              </h4>
              <UsersWeightModal
                visible={this.state.modalVisible}
                users={users}
                onClose={this.handleCloseModal}
              />
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

UsersWeightList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({ tag: PropTypes.string })),
};

UsersWeightList.defaultProps = {
  users: [],
};

export default UsersWeightList;
