import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Modal } from 'antd';
import ReportHeader from './ReportHeader/ReportHeader';
import ReportFooter from './ReportFooter/ReportFooter';
import ReportTableRewards from './ReportTable/ReportTableRewards/ReportTableRewards';
import ReportTableFees from './ReportTable/ReportTableFees/ReportTableFees';
import './Report.less';

const Report = ({ intl, closeModalReport, isModalReportOpen }) => (
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
    onCancel={closeModalReport}
    maskClosable={false}
    visible={isModalReportOpen}
    wrapClassName="Report"
    footer={null}
    width={768}
  >
    <ReportHeader />
    <ReportTableRewards />
    <ReportTableFees />
    <ReportFooter toggleModal={closeModalReport} />
  </Modal>
);

Report.propTypes = {
  intl: PropTypes.shape().isRequired,
  closeModalReport: PropTypes.func.isRequired,
  isModalReportOpen: PropTypes.bool.isRequired,
};

export default injectIntl(Report);
