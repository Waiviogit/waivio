import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Modal } from 'antd';
import { connect } from 'react-redux';
import { getCurrentCurrency } from '../../../store/appStore/appSelectors';
import ReportHeader from './ReportHeader/ReportHeader';
import ReportFooter from './ReportFooter/ReportFooter';
import ReportTableRewards from './ReportTable/ReportTableRewards/ReportTableRewards';
import ReportTableFees from './ReportTable/ReportTableFees/ReportTableFees';
import './Report.less';

const Report = ({ intl, toggleModal, isModalReportOpen, currencyInfo }) => (
  <Modal
    title={
      <div className="Report__modal-title">
        {intl.formatMessage({
          id: 'paymentTable_report',
          defaultMessage: 'Report',
        })}
      </div>
    }
    zIndex={10000}
    closable
    onCancel={toggleModal}
    maskClosable={false}
    visible={isModalReportOpen}
    wrapClassName="Report"
    footer={null}
    width={768}
  >
    <ReportHeader currencyInfo={currencyInfo} />
    <ReportTableRewards currencyInfo={currencyInfo} />
    <ReportTableFees currencyInfo={currencyInfo} />
    <ReportFooter toggleModal={toggleModal} currencyInfo={currencyInfo} />
  </Modal>
);

Report.propTypes = {
  intl: PropTypes.shape().isRequired,
  currencyInfo: PropTypes.shape().isRequired,
  toggleModal: PropTypes.func.isRequired,
  isModalReportOpen: PropTypes.bool.isRequired,
};

export default connect(state => ({ currencyInfo: getCurrentCurrency(state) }))(injectIntl(Report));
