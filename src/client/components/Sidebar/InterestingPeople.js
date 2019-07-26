import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import User from './User';
import RightSidebarLoading from '../../../client/app/Sidebar/RightSidebarLoading';
import * as store from '../../reducers';
import { getRandomExperts } from '../../user/usersActions';
import './InterestingPeople.less';
import './SidebarContentBlock.less';

@connect(
  state => ({
    randomExperts: store.getRandomExperts(state),
    randomExpertsLoaded: store.getRandomExpertsLoaded(state),
  }),
  { getRandomExperts },
)
class InterestingPeople extends React.Component {
  static propTypes = {
    randomExperts: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })).isRequired,
    randomExpertsLoaded: PropTypes.bool.isRequired,
    getRandomExperts: PropTypes.func.isRequired,
  };

  componentDidMount() {
    if (!this.props.randomExpertsLoaded) {
      this.props.getRandomExperts();
    }
  }

  refreshRandomExperts = () => this.props.getRandomExperts();

  render() {
    const { randomExperts } = this.props;
    return randomExperts.length >= 5 ? (
      <div className="InterestingPeople SidebarContentBlock">
        <h4 className="SidebarContentBlock__title">
          <i className="iconfont icon-group SidebarContentBlock__icon" />{' '}
          <FormattedMessage id="interesting_people" defaultMessage="Interesting People" />
          <button onClick={this.refreshRandomExperts} className="InterestingPeople__button-refresh">
            <i className="iconfont icon-refresh" />
          </button>
        </h4>
        <div className="SidebarContentBlock__content">
          {randomExperts &&
            randomExperts.map(user => <User key={user.name} user={user} showFollow={false} />)}
          <h4 className="InterestingPeople__more">
            <Link to={'/discover'}>
              <FormattedMessage id="discover_more_people" defaultMessage="Discover More People" />
            </Link>
          </h4>
        </div>
      </div>
    ) : (
      <RightSidebarLoading />
    );
  }
}

export default InterestingPeople;
