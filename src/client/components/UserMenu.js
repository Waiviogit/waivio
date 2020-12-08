import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import './UserMenu.less';

class UserMenu extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    defaultKey: PropTypes.string,
    followers: PropTypes.number,
    following: PropTypes.number,
    isGuest: PropTypes.bool,
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
    return (
      <div className="UserMenu">
        <div className="container menu-layout">
          <div className="left" />
          <ul className="UserMenu__menu center">
            <li
              className={this.getItemClasses('discussions')}
              onClick={this.handleClick}
              role="presentation"
              data-key="discussions"
            >
              <FormattedMessage id="posts" defaultMessage="Posts" />
            </li>
            <li
              className={this.getItemClasses('comments')}
              onClick={this.handleClick}
              role="presentation"
              data-key="comments"
            >
              <FormattedMessage id="comments" defaultMessage="Comments" />
            </li>
            <li
              className={this.getItemClasses('followers')}
              onClick={this.handleClick}
              role="presentation"
              data-key="followers"
            >
              <FormattedMessage id="followers" defaultMessage="Followers" />
              <span className="UserMenu__badge">
                <FormattedNumber value={this.props.followers} />
              </span>
            </li>
            <li
              className={this.getItemClasses('following')}
              onClick={this.handleClick}
              role="presentation"
              data-key="following"
            >
              <FormattedMessage id="following" defaultMessage="Following" />
              <span className="UserMenu__badge">
                <FormattedNumber value={this.props.following || 0} />
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
              data-key="transfers"
            >
              <FormattedMessage id="wallet" defaultMessage="Wallet" />
            </li>
            {!this.props.isGuest && (
              <li
                className={this.getItemClasses('activity')}
                onClick={this.handleClick}
                role="presentation"
                data-key="activity"
              >
                <FormattedMessage id="activity" defaultMessage="Activity" />
              </li>
            )}
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

export default UserMenu;
