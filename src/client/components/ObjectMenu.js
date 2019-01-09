import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import './UserMenu.less';

class ObjectMenu extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    defaultKey: PropTypes.string,
    followers: PropTypes.number,
  };

  static defaultProps = {
    onChange: () => {},
    defaultKey: 'discussions',
    followers: 0,
  };

  static TAB_NAME = {
    DISCUSSIONS: 'discussions',
    FOLLOWERS: 'followers',
    HISTORY: 'history',
  };

  constructor(props) {
    super(props);
    this.state = {
      current: props.defaultKey ? props.defaultKey : ObjectMenu.TAB_NAME.DISCUSSIONS,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      current: nextProps.defaultKey ? nextProps.defaultKey : ObjectMenu.TAB_NAME.DISCUSSIONS,
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
          <Scrollbars
            universal
            autoHide
            renderView={({ style, ...props }) => (
              <div style={{ ...style, marginBottom: '-20px' }} {...props} />
            )}
            style={{ width: '100%', height: 46 }}
          >
            <ul className="UserMenu__menu center">
              <li
                className={this.getItemClasses(ObjectMenu.TAB_NAME.DISCUSSIONS)}
                onClick={this.handleClick}
                role="presentation"
                data-key={ObjectMenu.TAB_NAME.DISCUSSIONS}
              >
                <FormattedMessage id="discussions" defaultMessage="Discussions" />
              </li>
              <li
                className={this.getItemClasses(ObjectMenu.TAB_NAME.FOLLOWERS)}
                onClick={this.handleClick}
                role="presentation"
                data-key={ObjectMenu.TAB_NAME.FOLLOWERS}
              >
                <FormattedMessage id="followers" defaultMessage="Followers" />
                <span className="UserMenu__badge">
                  <FormattedNumber value={this.props.followers} />
                </span>
              </li>
              <li
                className={this.getItemClasses(ObjectMenu.TAB_NAME.HISTORY)}
                onClick={this.handleClick}
                role="presentation"
                data-key={ObjectMenu.TAB_NAME.HISTORY}
              >
                <FormattedMessage id="object_history" defaultMessage="History" />
              </li>
            </ul>
          </Scrollbars>
        </div>
      </div>
    );
  }
}

export default ObjectMenu;
