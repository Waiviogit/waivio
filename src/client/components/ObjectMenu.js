import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import OBJECT_TYPE from '../object/const/objectTypes';
import { hasType } from '../helpers/wObjectHelper';
import { getObjectSettings } from '../../common/constants/listOfFields';
import './ObjectMenu.less';

class ObjectMenu extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    defaultKey: PropTypes.string,
    followers: PropTypes.number,
    fieldsCount: PropTypes.number,
    accessExtend: PropTypes.bool,
    wobject: PropTypes.shape(),
  };

  static defaultProps = {
    onChange: () => {},
    defaultKey: 'about',
    followers: 0,
    fieldsCount: 0,
    accessExtend: true,
    wobject: {},
  };

  static TAB_NAME = {
    ABOUT: 'about',
    GALLERY: 'gallery',
    LIST: 'list',
    PAGE: 'page',
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
    classNames('ObjectMenu__item', { 'ObjectMenu__item--active': this.state.current === key });

  handleClick = e => {
    const key = e.currentTarget.dataset.key;
    this.setState({ current: key }, () => this.props.onChange(key));
  };

  render() {
    const { wobject } = this.props;
    // const { withGallery } = getObjectSettings(wobject && wobject.object_type);
    const { withGallery } = false;
    const isList = hasType(wobject, OBJECT_TYPE.LIST);
    const isPage = hasType(wobject, OBJECT_TYPE.PAGE);
    return (
      <div className="ObjectMenu">
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
              <li
                className={this.getItemClasses(ObjectMenu.TAB_NAME.REVIEWS)}
                onClick={this.handleClick}
                role="presentation"
                data-key={ObjectMenu.TAB_NAME.REVIEWS}
              >
                <FormattedMessage id="reviews" defaultMessage="Reviews" />
              </li>
              {this.props.accessExtend && withGallery && (
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
                  <span className="ObjectMenu__badge">
                    <FormattedNumber value={this.props.fieldsCount} />
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
          </Scrollbars>
        </div>
      </div>
    );
  }
}

export default ObjectMenu;
