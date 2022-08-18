import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Modal } from 'antd';
import { connect, useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import { getCurrentCurrency } from '../../../store/appStore/appSelectors';
import ReportHeader from './ReportHeader/ReportHeader';
import ReportFooter from './ReportFooter/ReportFooter';
import ReportTableRewards from './ReportTable/ReportTableRewards/ReportTableRewards';
import ReportTableFees from './ReportTable/ReportTableFees/ReportTableFees';
import { getReportByUser } from '../../../waivioApi/ApiClient';
import { getBeneficiariesUsers } from '../../../store/searchStore/searchSelectors';

import './Report.less';

const Report = ({ intl, toggleModal, isModalReportOpen, currencyInfo, sponsor }) => {
  const [reportDetails, setReportDetails] = useState();
  const location = useLocation();
  const payoutToken = reportDetails ? 'WAIV' : 'HIVE';
  const isNewReward = location.pathname.includes('rewards-new');
  const currBenefis = useSelector(getBeneficiariesUsers);

  useEffect(() => {
    if (isModalReportOpen && isNewReward) {
      getReportByUser({
        userName: sponsor.userName,
        guideName: sponsor.guideName,
        reviewPermlink: sponsor.reviewPermlink,
      }).then(res => {
        setReportDetails({
          ...res,
          histories: res.histories.map(hist => ({ ...hist, beneficiaries: currBenefis })),
        });
      });
    }
  }, [isModalReportOpen]);

  return (
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
      visible={isNewReward ? isModalReportOpen && reportDetails : isModalReportOpen}
      wrapClassName="Report"
      footer={null}
      width={768}
    >
      <ReportHeader
        currencyInfo={currencyInfo}
        reportDetails={reportDetails}
        payoutToken={payoutToken}
      />
      <ReportTableRewards
        currencyInfo={currencyInfo}
        reportDetails={reportDetails}
        payoutToken={payoutToken}
      />
      <ReportTableFees
        currencyInfo={currencyInfo}
        reportDetails={reportDetails}
        payoutToken={payoutToken}
      />
      <ReportFooter
        toggleModal={toggleModal}
        currencyInfo={currencyInfo}
        reportDetails={reportDetails}
        payoutToken={payoutToken}
      />
    </Modal>
  );
};

Report.propTypes = {
  intl: PropTypes.shape().isRequired,
  currencyInfo: PropTypes.shape().isRequired,
  sponsor: PropTypes.shape().isRequired,
  toggleModal: PropTypes.func.isRequired,
  isModalReportOpen: PropTypes.bool.isRequired,
};

export default connect(state => ({ currencyInfo: getCurrentCurrency(state) }))(injectIntl(Report));
