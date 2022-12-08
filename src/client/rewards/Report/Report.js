import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Modal } from 'antd';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { isEmpty } from 'lodash';

import { getCurrentCurrency } from '../../../store/appStore/appSelectors';
import ReportHeader from './ReportHeader/ReportHeader';
import ReportFooter from './ReportFooter/ReportFooter';
import ReportTableRewards from './ReportTable/ReportTableRewards/ReportTableRewards';
import ReportTableFees from './ReportTable/ReportTableFees/ReportTableFees';
import { getReport, getReportByUser } from '../../../waivioApi/ApiClient';
import { getBeneficiariesUsers } from '../../../store/searchStore/searchSelectors';

import './Report.less';
import { getCryptoPriceHistory } from '../../../store/appStore/appActions';

const Report = ({ intl, toggleModal, isModalReportOpen, currencyInfo, sponsor }) => {
  const [reportDetails, setReportDetails] = useState();
  const location = useLocation();
  const dispatch = useDispatch();
  const oldReward = location.pathname.includes('rewards-old');
  const payoutToken = oldReward ? 'HIVE' : 'WAIV';
  const currBenefis = useSelector(getBeneficiariesUsers);

  useEffect(() => {
    if (isModalReportOpen) {
      if (oldReward) {
        const requestParams = {
          guideName: sponsor.sponsor,
          userName: sponsor.userName,
          reservationPermlink: sponsor?.details?.reservation_permlink || sponsor?.reviewPermlink,
        };

        dispatch(getCryptoPriceHistory());
        getReport(requestParams).then(res => {
          setReportDetails({
            ...res,
            histories: res.histories.map(hist => ({ ...hist, beneficiaries: currBenefis })),
          });
        });
      } else {
        getReportByUser({
          userName: sponsor.userName,
          guideName: sponsor.guideName,
          reviewPermlink: sponsor.reviewPermlink,
        }).then(res => {
          setReportDetails(res);
        });
      }
    }
  }, [isModalReportOpen]);

  if (isEmpty(reportDetails)) return null;

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
      visible={!oldReward ? isModalReportOpen && reportDetails : isModalReportOpen}
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
