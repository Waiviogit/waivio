import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import UsersModal from './UsersModal';
import './ObjectExpertise.less';
import UserCard from '../UserCard';
import WeightTag from '../WeightTag';

export default class ObjectExpertise extends React.Component {
  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    users: [],
  };

  state = {
    modalVisible: false,
  };

  toggleModal = () =>
    this.setState(prevState => ({
      modalVisible: !prevState.modalVisible,
    }));

  render() {
    const { users } = this.props;
    return (
      <div className="SidebarContentBlock">
        <h4 className="SidebarContentBlock__title">
          <i className="iconfont icon-collection SidebarContentBlock__icon" />{' '}
          <FormattedMessage id="object_expertise" defaultMessage="Object expertise" />
        </h4>
        <div className="SidebarContentBlock__content">
          {users &&
            _.map(_.slice(users, 0, 5), user => (
              <UserCard
                key={user.name}
                user={user}
                alt={<WeightTag rank={user.rank} weight={user.weight} />}
              />
            ))}
          {_.size(users) > 5 && (
            <React.Fragment>
              <h4 className="ObjectExpertise__more">
                <a role="presentation" onClick={this.toggleModal}>
                  <FormattedMessage id="show_more_authors" defaultMessage="Show more authors" />
                </a>
              </h4>
              <UsersModal
                visible={this.state.modalVisible}
                users={users}
                onClose={this.toggleModal}
              />
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}
