import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { guestUserRegex } from '../../common/helpers/regexHelpers';
import { getIsSocial, getIsWaivio } from '../../store/appStore/appSelectors';

import './UserMenu.less';

@connect(state => ({
  isWaivio: getIsWaivio(state),
  isSocial: getIsSocial(state),
}))
class UserMenu extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    defaultKey: PropTypes.string,
    isWaivio: PropTypes.bool,
    isSocial: PropTypes.bool,
    followers: PropTypes.number,
    match: PropTypes.shape({
      params: PropTypes.shape({
        name: PropTypes.string,
      }),
    }),
  };

  static defaultProps = {
    onChange: () => {},
    defaultKey: 'discussions',
    followers: 0,
    following: 0,
    isGuest: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      current: props.defaultKey ? props.defaultKey : 'discussions',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      current: nextProps.defaultKey ? nextProps.defaultKey : 'discussions',
    });
  }

  getItemClasses = key =>
    classNames('UserMenu__item', { 'UserMenu__item--active': this.state.current === key });

  handleClick = e => {
    const key = e.currentTarget.dataset.key;

    this.setState({ current: key }, () => this.props.onChange(key));
  };

  render() {
    const { isWaivio, isSocial } = this.props;
    const currUserIsGuest = guestUserRegex.test(this.props.match.params.name);
    const showUserShop = isWaivio || isSocial;

    return (
      <div className="UserMenu">
        <div className="container menu-layout">
          <div className="left" />
          <ul className="UserMenu__menu ">
            <li
              className={classNames('UserMenu__item', {
                'UserMenu__item--active': ['discussions', 'comments', 'activity'].includes(
                  this.state.current,
                ),
              })}
              onClick={this.handleClick}
              role="presentation"
              data-key="discussions"
            >
              <FormattedMessage id="posts" defaultMessage="Posts" />
            </li>
            {!currUserIsGuest && showUserShop && (
              <li
                className={classNames('UserMenu__item', {
                  'UserMenu__item--active': ['userShop'].includes(this.state.current),
                })}
                onClick={this.handleClick}
                role="presentation"
                data-key="userShop"
              >
                <FormattedMessage id="shop" defaultMessage="Shop" />
              </li>
            )}
            <li
              className={this.getItemClasses('followers')}
              onClick={this.handleClick}
              role="presentation"
              data-key="followers"
            >
              {' '}
              <span>
                <FormattedMessage id="followers" defaultMessage="Followers" />{' '}
                <FormattedNumber value={this.props.followers} />
              </span>
            </li>
            <li
              className={this.getItemClasses('expertise')}
              onClick={this.handleClick}
              role="presentation"
              data-key="expertise"
            >
              <FormattedMessage id="user_expertise" defaultMessage="Expertise" />
            </li>
            <li
              className={this.getItemClasses('transfers')}
              onClick={this.handleClick}
              role="presentation"
              data-key="transfers?type=WAIV"
            >
              <FormattedMessage id="wallet" defaultMessage="Wallet" />
            </li>
            <li
              className={this.getItemClasses('about')}
              onClick={this.handleClick}
              role="presentation"
              data-key="about"
            >
              <FormattedMessage id="about" defaultMessage="About" />
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default withRouter(UserMenu);
