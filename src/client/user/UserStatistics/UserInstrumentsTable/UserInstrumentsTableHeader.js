import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import './UserInstrumentsTable.less';

const UserInstrumentsTableHeader = ({ setSortOptions }) => {
  const [currentItem, setCurrentItem] = useState('');
  const [isActive, setIsActive] = useState(false);
  const onClickHandler = item => {
    setCurrentItem(item);
    setIsActive(!isActive);
    setSortOptions(currentItem, isActive);
  };
  return (
    <div className="UserInstrumentsTableHeader">
      <div
        className={classNames('UserInstrumentsTableHeader__item', {
          active: currentItem === 'instrument',
        })}
        onClick={() => onClickHandler('instrument')}
      >
        <div className="UserInstrumentsTableHeader__item-icon">
          <Icon type={currentItem === 'instrument' && isActive ? 'down' : 'up'} />
        </div>
        <div className="UserInstrumentsTableHeader__item-content">Instrument</div>
      </div>
      <div
        className={classNames('UserInstrumentsTableHeader__item', {
          active: currentItem === 'deals',
        })}
        onClick={() => onClickHandler('deals')}
      >
        <div className="UserInstrumentsTableHeader__item-icon">
          <Icon type={currentItem === 'deals' && isActive ? 'down' : 'up'} />
        </div>
        <div className="UserInstrumentsTableHeader__item-content">Deals</div>
      </div>
      <div
        className={classNames('UserInstrumentsTableHeader__item', {
          active: currentItem === 'profit',
        })}
        onClick={() => onClickHandler('profit')}
      >
        <div className="UserInstrumentsTableHeader__item-icon">
          <Icon type={currentItem === 'profit' && isActive ? 'down' : 'up'} />
        </div>
        <div className="UserInstrumentsTableHeader__item-content">Profit</div>
      </div>
    </div>
  );
};

UserInstrumentsTableHeader.propTypes = {
  statisticsData: PropTypes.func.isRequired,
};

export default injectIntl(UserInstrumentsTableHeader);
