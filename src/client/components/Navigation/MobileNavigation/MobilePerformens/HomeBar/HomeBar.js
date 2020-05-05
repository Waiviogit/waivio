import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import classNames from 'classnames';
import PerformerItem from '../../PerformerItem/PerformerItem';
import api from '../../../../../../investarena/configApi/apiResources';
import './HomeBar.less';

const HomeBar = ({ intl }) => {
  const period = {
    week: 'd7',
    month: 'm1',
    halfYear: 'm6',
  };
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
      defaultMessage: '6 Month',
    }),
  };

  const [performersStatWeek, setPerformersStatWeek] = useState([]);
  const [performersStatMonth, setPerformersStatMonth] = useState([]);
  const [performersStatHalfYear, setPerformersStatHalfYear] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(period.week);

  useEffect(() => {
    api.performers
      .getPerformersStatisticsForPeriod(period.week, 30)
      .then(data => setPerformersStatWeek(data));
    api.performers
      .getPerformersStatisticsForPeriod(period.month, 30)
      .then(data => setPerformersStatMonth(data));
    api.performers
      .getPerformersStatisticsForPeriod(period.halfYear, 30)
      .then(data => setPerformersStatHalfYear(data));
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const getModalContent = () => {
    switch (currentItem) {
      case period.halfYear:
        return performersStatHalfYear;
      case period.month:
        return performersStatMonth;
      case period.week:
      default:
        return performersStatWeek;
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
            {performersStatWeek.slice(0, 5).map(performer => (
              <PerformerItem period={period.week} performer={performer} />
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
            {performersStatMonth.slice(0, 5).map(performer => (
              <PerformerItem period={period.month} performer={performer} />
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
            {performersStatHalfYear.slice(0, 5).map(performer => (
              <PerformerItem period={period.halfYear} performer={performer} />
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
          <PerformerItem period={currentItem} performer={performer} />
        ))}
      </Modal>
    </div>
  );
};

HomeBar.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(HomeBar);
