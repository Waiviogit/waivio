import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isGuestUser } from '../../../store/reducers';

const SettingsItem = ({ toggleMenuCondition, condition, configItem }) => {
  const isGuest = useSelector(isGuestUser);

  return (
    <React.Fragment>
      <div
        className="Sidenav__title-wrap"
        onClick={() => toggleMenuCondition(configItem.tab.name)}
        role="presentation"
      >
        <div className="Sidenav__title-item">
          <FormattedMessage id={configItem.tab.id} defaultMessage={configItem.tab.defaultMessage} />
        </div>
        <div className="Sidenav__title-icon">
          <i className={`iconfont icon-${condition ? 'offline' : 'addition'}`} />
        </div>
      </div>
      {condition && (
        <React.Fragment>
          {configItem.settings.map(setting => {
            if (setting.forGuest && !isGuest) return null;

            return (
              <li key={setting.id}>
                <NavLink
                  to={setting.to}
                  className="sidenav-discover-objects__item"
                  activeClassName="Sidenav__item--active"
                >
                  <FormattedMessage id={setting.id} defaultMessage={setting.defaultMessage} />
                </NavLink>
              </li>
            );
          })}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

SettingsItem.propTypes = {
  toggleMenuCondition: PropTypes.func.isRequired,
  condition: PropTypes.bool,
  configItem: PropTypes.shape({
    tab: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string,
      defaultMessage: PropTypes.string,
    }),
    settings: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
};

SettingsItem.defaultProps = {
  condition: false,
};

export default SettingsItem;
