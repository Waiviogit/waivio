import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import OBJECT_TYPE from '../object/const/objectTypes';
import { hasType } from '../../common/helpers/wObjectHelper';
import './ObjectMenu.less';
import { isMobile } from '../../common/helpers/apiHelpers';

class ObjectMenu extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    defaultKey: PropTypes.string,
    followers: PropTypes.number,
    accessExtend: PropTypes.bool,
    wobject: PropTypes.shape(),
    isWaivio: PropTypes.bool,
  };

  static defaultProps = {
    onChange: () => {},
    defaultKey: 'about',
    followers: 0,
    accessExtend: true,
    isWaivio: true,
    wobject: {},
  };

  static TAB_NAME = {
    ABOUT: 'about',
    GALLERY: 'gallery',
    LIST: 'list',
    PAGE: 'page',
    WIDGET: 'widget',
    NEWSFEED: 'newsfeed',
    UPDATES: 'updates',
    REVIEWS: 'reviews',
    FOLLOWERS: 'followers',
    EXPERTISE: 'expertise',
    HIDDEN_TAB: 'hiddenTab',
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
    classNames('ObjectMenu__item', {
      'ObjectMenu__item--active': key.includes(this.state.current),
    });

  handleClick = e => {
    const key = e.currentTarget.dataset.key;

    this.setState({ current: key }, () => this.props.onChange(key));
  };

  render() {
    const isList = hasType(this.props.wobject, OBJECT_TYPE.LIST);
    const isPage = hasType(this.props.wobject, OBJECT_TYPE.PAGE);
    const isWidget = hasType(this.props.wobject, OBJECT_TYPE.WIDGET);
    const isNewsfeed = hasType(this.props.wobject, OBJECT_TYPE.NEWSFEED);
    const isHashtag = hasType(this.props.wobject, OBJECT_TYPE.HASHTAG);

    return (
      <div className="ObjectMenu">
        <div className="container menu-layout">
          <div className="left" />
          <ul className="ObjectMenu__menu center">
            <li
              className={this.getItemClasses(ObjectMenu.TAB_NAME.ABOUT)}
              onClick={this.handleClick}
              role="presentation"
              data-key={ObjectMenu.TAB_NAME.ABOUT}
            >
              <FormattedMessage id="about" defaultMessage="About" />
            </li>
            {isList && (
              <li
                className={this.getItemClasses(ObjectMenu.TAB_NAME.LIST)}
                onClick={this.handleClick}
                role="presentation"
                data-key={ObjectMenu.TAB_NAME.LIST}
              >
                <FormattedMessage id="list" defaultMessage="List" />
              </li>
            )}
            {isPage && (
              <li
                className={this.getItemClasses(ObjectMenu.TAB_NAME.PAGE)}
                onClick={this.handleClick}
                role="presentation"
                data-key={ObjectMenu.TAB_NAME.PAGE}
              >
                <FormattedMessage id="page" defaultMessage="Page" />
              </li>
            )}
            {isWidget && (
              <li
                className={this.getItemClasses(ObjectMenu.TAB_NAME.WIDGET)}
                onClick={this.handleClick}
                role="presentation"
                data-key={ObjectMenu.TAB_NAME.WIDGET}
              >
                <FormattedMessage id="Widget" defaultMessage="Widget" />
              </li>
            )}{' '}
            {isNewsfeed && (
              <li
                className={this.getItemClasses(ObjectMenu.TAB_NAME.NEWSFEED)}
                onClick={this.handleClick}
                role="presentation"
                data-key={ObjectMenu.TAB_NAME.NEWSFEED}
              >
                <FormattedMessage id="newsfeed" defaultMessage="Newsfeed" />
              </li>
            )}
            <li
              className={this.getItemClasses([
                ObjectMenu.TAB_NAME.REVIEWS,
                isMobile() ? '' : ObjectMenu.TAB_NAME.ABOUT,
                '',
              ])}
              onClick={this.handleClick}
              role="presentation"
              data-key={ObjectMenu.TAB_NAME.REVIEWS}
            >
              <FormattedMessage id="reviews" defaultMessage="Reviews" />
            </li>
            {this.props.accessExtend && !isPage && !isHashtag && (
              <li
                className={this.getItemClasses(ObjectMenu.TAB_NAME.GALLERY)}
                onClick={this.handleClick}
                role="presentation"
                data-key={ObjectMenu.TAB_NAME.GALLERY}
              >
                <FormattedMessage id="gallery" defaultMessage="Gallery" />
              </li>
            )}
            {this.props.accessExtend && this.props.isWaivio && (
              <li
                className={this.getItemClasses(ObjectMenu.TAB_NAME.UPDATES)}
                onClick={this.handleClick}
                role="presentation"
                data-key={ObjectMenu.TAB_NAME.UPDATES}
              >
                <FormattedMessage id="updates" defaultMessage="Updates" />
                <span className="ObjectMenu__badge">
                  <FormattedNumber value={this.props.wobject.updatesCount} />
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
              <span className="ObjectMenu__badge">
                <FormattedNumber value={this.props.followers} />
              </span>
            </li>
            <li
              className={this.getItemClasses(ObjectMenu.TAB_NAME.EXPERTISE)}
              onClick={this.handleClick}
              role="presentation"
              data-key={ObjectMenu.TAB_NAME.EXPERTISE}
            >
              <FormattedMessage id="experts" defaultMessage="Experts" />
            </li>
            <li
              className={this.getItemClasses(ObjectMenu.TAB_NAME.HIDDEN_TAB)}
              onClick={this.handleClick}
              role="presentation"
              data-key={ObjectMenu.TAB_NAME.HIDDEN_TAB}
            >
              <FormattedMessage id="info" defaultMessage="Info" />
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default ObjectMenu;
