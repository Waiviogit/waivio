import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

const initialState = {
  Steem: {
    name: 'Steem',
    intlId: 'steem',
    isCollapsed: false,
  },
  Personal: {
    name: 'Personal',
    intlId: 'personal',
    isCollapsed: false,
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
  const [menuState, dispatch] = useReducer(sidebarMenuReducer, initialState);
  const collapseBlock = blockName => () =>
    dispatch({ type: actionType.TOGGLE_BLOCK, payload: { block: blockName } });
  return (
    <div className="collapsible-block SidebarContentBlock__content">
      {Object.values(menuState).map(section => (
        <div className={`collapsible-block__${section.name}-section`}>
          <div
            className="collapsible-block__title"
            role="presentation"
            onClick={collapseBlock(section.name)}
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
          {!section.isCollapsed ? (
            <div className="collapsible-block__content">{section.name}::Content</div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

SidebarMenu.propTypes = {
  intl: PropTypes.shape().isRequired,
  // location: PropTypes.shape().isRequired,
};

export default injectIntl(SidebarMenu);
