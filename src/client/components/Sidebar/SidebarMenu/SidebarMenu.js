import React, { useReducer } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { mapValues } from 'lodash';
import { injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { getIsAuthenticated } from '../../../reducers';

const actionType = { TOGGLE_BLOCK: 'toggleBlock' };
function sidebarMenuReducer(state, action) {
  const { type, section } = action;
  switch (type) {
    case actionType.TOGGLE_BLOCK:
      return {
        ...state,
        [section]: {
          isCollapsed: !state[section].isCollapsed,
        },
      };
    default:
      return state;
  }
}

const SidebarMenu = ({ intl, menuConfig, loadMore }) => {
  // redux store
  const authenticated = useSelector(getIsAuthenticated);
  // local state
  const [menuState, dispatch] = useReducer(
    sidebarMenuReducer,
    mapValues(menuConfig, menuSection => ({ isCollapsed: menuSection.isCollapsed })),
  );

  const toggleBlock = section => () =>
    dispatch({ type: actionType.TOGGLE_BLOCK, section: section.name });

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
          {menuState[menuSection.name].isCollapsed ? (
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
        const linkTo = authenticated
          ? sectionItem.linkTo
          : sectionItem.unauthLink || sectionItem.linkTo;
        return linkTo ? (
          <li className="collapsible-block__item" key={sectionItem.name}>
            <NavLink
              to={linkTo}
              className="sidenav-discover-objects__item"
              isActive={checkIsActive}
              activeClassName="Sidenav__item--active"
              disabled={Boolean(sectionItem.disabled)}
            >
              <span className="flex justify-between">
                <span className="sidenav-discover-objects__item-text">
                  {intl.formatMessage({ id: sectionItem.intlId, defaultMessage: sectionItem.name })}
                </span>
                {sectionItem.meta ? <span>+{sectionItem.meta}</span> : null}
              </span>
            </NavLink>
          </li>
        ) : null;
      })}
      {menuSection.hasMore && (
        <div
          className="sidenav-discover-objects__show-more"
          role="presentation"
          onClick={loadMore(menuSection.name)}
        >
          <span>{intl.formatMessage({ id: 'show_more', defaultMessage: 'show more' })}</span>
        </div>
      )}
    </ul>
  );

  return (
    <div className="collapsible-block SidebarContentBlock__content">
      {Object.values(menuConfig).map(section =>
        !section.requireAuth || authenticated ? (
          <div className={`collapsible-block__${section.name}-section`} key={section.name}>
            {getSectionTitle(section)}
            {section.isCollapsible && !menuState[section.name].isCollapsed
              ? getSectionContent(section)
              : null}
          </div>
        ) : null,
      )}
    </div>
  );
};

SidebarMenu.propTypes = {
  intl: PropTypes.shape().isRequired,
  menuConfig: PropTypes.shape(),
  loadMore: PropTypes.func,
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
  loadMore: () => {},
};

export default injectIntl(SidebarMenu);
