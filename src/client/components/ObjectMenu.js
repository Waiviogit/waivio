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
    fieldsCount: PropTypes.number,
    accessExtend: PropTypes.bool,
  };

  static defaultProps = {
    onChange: () => {},
    defaultKey: 'about',
    followers: 0,
    fieldsCount: 0,
    accessExtend: true,
  };

  static TAB_NAME = {
    ABOUT: 'about',
    GALLERY: 'gallery',
    UPDATES: 'updates',
    REVIEWS: 'reviews',
    FOLLOWERS: 'followers',
  };

  constructor(props) {
    super(props);
    this.state = {
      current: props.defaultKey ? props.defaultKey : ObjectMenu.TAB_NAME.ABOUT,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      current: nextProps.defaultKey ? nextProps.defaultKey : ObjectMenu.TAB_NAME.ABOUT,
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
                className={this.getItemClasses(ObjectMenu.TAB_NAME.REVIEWS)}
                onClick={this.handleClick}
                role="presentation"
                data-key={ObjectMenu.TAB_NAME.REVIEWS}
              >
                <FormattedMessage id="reviews" defaultMessage="Reviews" />
              </li>
              {/* <li */}
              {/* className={this.getItemClasses(ObjectMenu.TAB_NAME.ABOUT)} */}
              {/* onClick={this.handleClick} */}
              {/* role="presentation" */}
              {/* data-key={ObjectMenu.TAB_NAME.ABOUT} */}
              {/* > */}
              {/* <FormattedMessage id="about" defaultMessage="About" /> */}
              {/* </li> */}
              {this.props.accessExtend && (
                <li
                  className={this.getItemClasses(ObjectMenu.TAB_NAME.GALLERY)}
                  onClick={this.handleClick}
                  role="presentation"
                  data-key={ObjectMenu.TAB_NAME.GALLERY}
                >
                  <FormattedMessage id="gallery" defaultMessage="Gallery" />
                </li>
              )}
              {this.props.accessExtend && (
                <li
                  className={this.getItemClasses(ObjectMenu.TAB_NAME.UPDATES)}
                  onClick={this.handleClick}
                  role="presentation"
                  data-key={ObjectMenu.TAB_NAME.UPDATES}
                >
                  <FormattedMessage id="updates" defaultMessage="Updates" />
                  <span className="UserMenu__badge">
                    <FormattedNumber value={this.props.fieldsCount + 1} />
                  </span>
                </li>
              )}
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
            </ul>
          </Scrollbars>
        </div>
      </div>
    );
  }
}

export default ObjectMenu;
