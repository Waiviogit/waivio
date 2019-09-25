import React, { useReducer } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { getIsAuthenticated } from '../../../reducers';

const menuSections = {
  STEEM: 'Steem',
  PERSONAL: 'Personal',
};
const initialState = {
  [menuSections.STEEM]: {
    name: menuSections.STEEM,
    intlId: 'steem',
    isCollapsed: false,
  },
  [menuSections.PERSONAL]: {
    name: menuSections.PERSONAL,
    intlId: 'personal',
    isCollapsed: false,
    requireAuth: true,
  },
};

const actionType = { TOGGLE_BLOCK: 'toggleBlock' };
function sidebarMenuReducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case actionType.TOGGLE_BLOCK:
      return {
        ...state,
        [payload.block]: {
          ...state[payload.block],
          isCollapsed: !state[payload.block].isCollapsed,
        },
      };
    default:
      return initialState;
  }
}

const SidebarMenu = ({ intl }) => {
  // redux store
  const authenticated = useSelector(getIsAuthenticated);
  // local state
  const [menuState, dispatch] = useReducer(sidebarMenuReducer, initialState);

  const toggleBlock = blockName => () =>
    dispatch({ type: actionType.TOGGLE_BLOCK, payload: { block: blockName } });

  const checkIsActive = (match, location) => {
    if (!match) return false;
    return match.url !== '' && location.pathname.includes(match.url);
  };

  const getSectionContent = section => {
    switch (section.name) {
      case menuSections.STEEM:
        return (
          <ul className="Sidenav collapsible-block__content">
            <li className="collapsible-block__item">
              <NavLink
                to={authenticated ? '/trending' : '/'}
                className="sidenav-discover-objects__item"
                isActive={checkIsActive}
                activeClassName="Sidenav__item--active"
              >
                <FormattedMessage id="sort_trending" defaultMessage="Trending" />
              </NavLink>
            </li>
            <li className="collapsible-block__item">
              <NavLink
                to={'/hot'}
                className="sidenav-discover-objects__item"
                isActive={checkIsActive}
                activeClassName="Sidenav__item--active"
              >
                <FormattedMessage id="sort_hot" defaultMessage="Hot" />
              </NavLink>
            </li>
            <li className="collapsible-block__item">
              <NavLink
                to={'/created'}
                className="sidenav-discover-objects__item"
                isActive={checkIsActive}
                activeClassName="Sidenav__item--active"
              >
                <FormattedMessage id="sort_created" defaultMessage="New" />
              </NavLink>
            </li>
          </ul>
        );
      case menuSections.PERSONAL:
        return (
          <ul className="Sidenav collapsible-block__content">
            <li className="collapsible-block__item">
              <NavLink
                to={'/'}
                className="sidenav-discover-objects__item"
                isActive={checkIsActive}
                activeClassName="Sidenav__item--active"
              >
                <FormattedMessage id="my_feed" defaultMessage="My feed" />
              </NavLink>
            </li>
            <li className="collapsible-block__item">
              <NavLink
                to={'/notifications'}
                className="sidenav-discover-objects__item"
                isActive={checkIsActive}
                activeClassName="Sidenav__item--active"
              >
                <FormattedMessage id="notifications" defaultMessage="Notifications" />
              </NavLink>
            </li>
            <li className="collapsible-block__item">
              <NavLink
                disabled
                to={'/updates'}
                className="sidenav-discover-objects__item"
                isActive={checkIsActive}
                activeClassName="Sidenav__item--active"
              >
                <FormattedMessage id="updates" defaultMessage="Updates" />
              </NavLink>
            </li>
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="collapsible-block SidebarContentBlock__content">
      {Object.values(menuState).map(section =>
        !section.requireAuth || authenticated ? (
          <div className={`collapsible-block__${section.name}-section`} key={section.name}>
            <div
              className="collapsible-block__title"
              role="presentation"
              onClick={toggleBlock(section.name)}
            >
              <span className="collapsible-block__title-text">
                {intl.formatMessage({ id: section.intlId, defaultMessage: section.name })}
              </span>
              <span className="collapsible-block__title-icon">
                {section.isCollapsed ? (
                  <i className="iconfont icon-addition" />
                ) : (
                  <i className="iconfont icon-offline" />
                )}
              </span>
            </div>
            {!section.isCollapsed ? getSectionContent(section) : null}
          </div>
        ) : null,
      )}
    </div>
  );
};

SidebarMenu.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(SidebarMenu);
