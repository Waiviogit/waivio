import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import classNames from 'classnames';
import PerformerItem from '../../PerformerItem/PerformerItem';
import './HomeBar.less';

const HomeBar = ({ intl, toggleMobileNavigation, period, periodsContent }) => {
  const title = {
    d7: intl.formatMessage({
      id: 'longTermData_d7',
      defaultMessage: 'Week',
    }),
    m1: intl.formatMessage({
      id: 'longTermData_m1',
      defaultMessage: 'Month',
    }),
    m6: intl.formatMessage({
      id: 'longTermData_m6',
      defaultMessage: '6 Months',
    }),
    m12: intl.formatMessage({
      id: 'longTermData_m12',
      defaultMessage: 'Year',
    }),
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(period.week);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const getModalContent = () => {
    switch (currentItem) {
      case period.year:
        return periodsContent.performersStatYear;
      case period.halfYear:
        return periodsContent.performersStatHalfYear;
      case period.month:
        return periodsContent.performersStatMonth;
      case period.week:
      default:
        return periodsContent.performersStatWeek;
    }
  };

  const showMoreButton = (
    <div className="HomeBar__show-more" onClick={toggleModal} role="presentation">
      {intl.formatMessage({
        id: 'show_more',
        defaultMessage: 'Show more',
      })}
    </div>
  );

  return (
    <div className="HomeBar">
      <div className="HomeBar__title">
        {intl.formatMessage({
          id: 'postSellBuy.profitability',
          defaultMessage: 'Profitability',
        })}
      </div>
      <div className="HomeBar__content">
        <div
          className={classNames('HomeBar__item', { selected: currentItem === period.week })}
          onClick={() => setCurrentItem(period.week)}
          role="presentation"
        >
          {title[period.week]}
        </div>
        {currentItem === period.week && (
          <React.Fragment>
            {periodsContent.performersStatWeek.slice(0, 5).map(performer => (
              <PerformerItem
                period={period.week}
                performer={performer}
                toggleMobileNavigation={toggleMobileNavigation}
              />
            ))}
            {showMoreButton}
          </React.Fragment>
        )}
        <div
          className={classNames('HomeBar__item', { selected: currentItem === period.month })}
          onClick={() => setCurrentItem(period.month)}
          role="presentation"
        >
          {title[period.month]}
        </div>
        {currentItem === period.month && (
          <React.Fragment>
            {periodsContent.performersStatMonth.slice(0, 5).map(performer => (
              <PerformerItem
                period={period.month}
                performer={performer}
                toggleMobileNavigation={toggleMobileNavigation}
              />
            ))}
            {showMoreButton}
          </React.Fragment>
        )}
        <div
          className={classNames('HomeBar__item', { selected: currentItem === period.halfYear })}
          onClick={() => setCurrentItem(period.halfYear)}
          role="presentation"
        >
          {title[period.halfYear]}
        </div>
        {currentItem === period.halfYear && (
          <React.Fragment>
            {periodsContent.performersStatHalfYear.slice(0, 5).map(performer => (
              <PerformerItem
                period={period.halfYear}
                performer={performer}
                toggleMobileNavigation={toggleMobileNavigation}
              />
            ))}
            {showMoreButton}
          </React.Fragment>
        )}
        <div
          className={classNames('HomeBar__item', { selected: currentItem === period.year })}
          onClick={() => setCurrentItem(period.year)}
          role="presentation"
        >
          {title[period.year]}
        </div>
        {currentItem === period.year && (
          <React.Fragment>
            {periodsContent.performersStatYear.slice(0, 5).map(performer => (
              <PerformerItem
                period={period.year}
                performer={performer}
                toggleMobileNavigation={toggleMobileNavigation}
              />
            ))}
            {showMoreButton}
          </React.Fragment>
        )}
      </div>
      <Modal
        className="HomeBar__modal"
        destroyOnClose
        title={title[currentItem]}
        visible={isModalOpen}
        footer={null}
        onCancel={toggleModal}
      >
        {getModalContent().map(performer => (
          <PerformerItem
            period={currentItem}
            performer={performer}
            toggleMobileNavigation={toggleMobileNavigation}
          />
        ))}
      </Modal>
    </div>
  );
};

HomeBar.propTypes = {
  toggleMobileNavigation: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  period: PropTypes.shape().isRequired,
  periodsContent: PropTypes.shape().isRequired,
};

export default injectIntl(HomeBar);
