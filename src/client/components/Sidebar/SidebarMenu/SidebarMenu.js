import React, { useReducer } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { getIsAuthenticated } from '../../../reducers';

// todo: sync with dev branch

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
      return state;
  }
}

const SidebarMenu = ({ intl, menuConfig }) => {
  // redux store
  const authenticated = useSelector(getIsAuthenticated);
  // local state
  const [menuState, dispatch] = useReducer(sidebarMenuReducer, menuConfig);

  const toggleBlock = section => () =>
    dispatch({ type: actionType.TOGGLE_BLOCK, payload: { block: section.name } });

  const checkIsActive = (match, location) => {
    if (!match) return false;
    return match.url !== '' && location.pathname.includes(match.url);
  };

  const getSectionTitle = menuSection =>
    menuSection.isCollapsible ? (
      <div
        className="collapsible-block__title"
        role="presentation"
        onClick={toggleBlock(menuSection)}
      >
        <span className="collapsible-block__title-text">
          {intl.formatMessage({ id: menuSection.intlId, defaultMessage: menuSection.name })}
        </span>
        <span className="collapsible-block__title-icon">
          {menuSection.isCollapsed ? (
            <i className="iconfont icon-addition" />
          ) : (
            <i className="iconfont icon-offline" />
          )}
        </span>
      </div>
    ) : (
      <NavLink
        to={menuSection.linkTo}
        className="collapsible-block__title"
        isActive={checkIsActive}
      >
        <span className="collapsible-block__title-text">
          {intl.formatMessage({ id: menuSection.intlId, defaultMessage: menuSection.name })}
        </span>
        <span className="collapsible-block__title-icon hidden">
          <i className="iconfont icon-addition" />
        </span>
      </NavLink>
    );

  const getSectionContent = menuSection => (
    <ul className="Sidenav collapsible-block__content">
      {menuSection.items.map(sectionItem => {
        const linkTo = authenticated ? sectionItem.linkTo : sectionItem.unauthLink;
        return linkTo ? (
          <li className="collapsible-block__item" key={sectionItem.name}>
            <NavLink
              to={linkTo}
              className="sidenav-discover-objects__item"
              isActive={checkIsActive}
              activeClassName="Sidenav__item--active"
              disabled={Boolean(sectionItem.disabled)}
            >
              <FormattedMessage id={sectionItem.intlId} defaultMessage={sectionItem.name} />
            </NavLink>
          </li>
        ) : null;
      })}
    </ul>
  );

  return (
    <div className="collapsible-block SidebarContentBlock__content">
      {Object.values(menuState).map(section =>
        !section.requireAuth || authenticated ? (
          <div className={`collapsible-block__${section.name}-section`} key={section.name}>
            {getSectionTitle(section)}
            {section.isCollapsible && !section.isCollapsed ? getSectionContent(section) : null}
          </div>
        ) : null,
      )}
    </div>
  );
};

SidebarMenu.propTypes = {
  intl: PropTypes.shape().isRequired,
  menuConfig: PropTypes.shape(),
};

SidebarMenu.defaultProps = {
  menuConfig: {
    'No Data': {
      name: 'No Data',
      intlId: 'charts.noData',
      isCollapsed: true,
      items: [],
    },
  },
};

export default injectIntl(SidebarMenu);
