import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Modal } from 'antd';
import { useDispatch } from 'react-redux';
import ReportHeader from './ReportHeader/ReportHeader';
import ReportFooter from './ReportFooter/ReportFooter';
import ReportTableRewards from './ReportTable/ReportTableRewards/ReportTableRewards';
import ReportTableFees from './ReportTable/ReportTableFees/ReportTableFees';
// import { getReport } from '../../../waivioApi/ApiClient';
import { setDataForSingleReport } from '../rewardsActions';
import './Report.less';

const Report = ({ intl, toggleModal, isModalReportOpen }) => {
  // useEffect(() => {
  //   const requestParams = {
  //     guideName: sponsor.sponsor,
  //     userName: sponsor.userName,
  //     reservationPermlink: sponsor.details.reservation_permlink,
  //   };
  //   getReport(requestParams)
  //     .then(data => {
  //       const dispatch = useDispatch();
  //       dispatch(setDataForSingleReport(data));
  //     })
  //     .catch(e => console.log(e));
  // }, []);
  const dispatch = useDispatch();

  useEffect(() => {
    const data = {
      createCampaignDate: '2020-02-10T13:37:05.299Z',
      reservationDate: '2020-02-10T14:29:54.949Z',
      reviewDate: '2020-03-10T12:39:33.066Z',
      title: 'Review: Sushi Mura, Beef Teriyaki',
      rewardHive: 0.11,
      rewardUsd: 0.0021,
      histories: [
        {
          _id: '5e678a85f9c2cb174722106f',
          is_demo_account: false,
          recounted: false,
          memo: '',
          userName: 'wiv01',
          sponsor: 'wiv01',
          type: 'review',
          app: 'waiviodev/1.0.0',
          details: {
            review_permlink: 'review-sushi-mura-beef-teriyaki',
            review_object: 'gqo-beef-teriyaki',
            reservation_permlink: 'reserve-bivtlrr48r',
            main_object: 'iwh-sushi-mura',
            beneficiaries: [
              {
                account: 'waivio',
                weight: 300,
              },
              {
                account: 'test',
                weight: 200,
              },
            ],
            payableInDollars: 0.0021,
          },
          amount: 0.01,
          createdAt: '2020-03-10T12:39:33.066Z',
          updatedAt: '2020-04-22T11:20:20.908Z',
          __v: 0,
        },
        {
          _id: '5e678a85f9c2cb1747221070',
          is_demo_account: false,
          recounted: false,
          memo: '',
          userName: 'waivio',
          sponsor: 'wiv01',
          type: 'index_fee',
          app: 'waiviodev/1.0.0',
          details: {
            review_permlink: 'review-sushi-mura-beef-teriyaki',
            review_object: 'gqo-beef-teriyaki',
            reservation_permlink: 'reserve-bivtlrr48r',
            main_object: 'iwh-sushi-mura',
            beneficiaries: [
              {
                account: 'waivio',
                weight: 300,
              },
            ],
            payableInDollars: 0.000105,
            commissionPercent: 500,
            commissionWeight: 500,
          },
          amount: 0.0005,
          createdAt: '2020-03-10T12:39:33.068Z',
          updatedAt: '2020-04-27T10:07:51.607Z',
          __v: 0,
        },
        {
          _id: '5e678a85f9c2cb1747221070',
          is_demo_account: false,
          recounted: false,
          memo: '',
          userName: 'waivio',
          sponsor: 'wiv01',
          type: 'referral_server_fee',
          app: 'waiviodev/1.0.0',
          details: {
            review_permlink: 'review-sushi-mura-beef-teriyaki',
            review_object: 'gqo-beef-teriyaki',
            reservation_permlink: 'reserve-bivtlrr48r',
            main_object: 'iwh-sushi-mura',
            beneficiaries: [
              {
                account: 'waivio',
                weight: 300,
              },
            ],
            payableInDollars: 0.000105,
            commissionPercent: 500,
            commissionWeight: 500,
          },
          amount: 0.0005,
          createdAt: '2020-03-10T12:39:33.068Z',
          updatedAt: '2020-04-27T10:07:51.607Z',
          __v: 0,
        },
        {
          _id: '5e678a85f9c2cb1747221071',
          is_demo_account: false,
          recounted: false,
          memo: '',
          userName: 'waivio',
          sponsor: 'wiv01',
          type: 'beneficiary_fee',
          app: 'waiviodev/1.0.0',
          details: {
            review_permlink: 'review-sushi-mura-beef-teriyaki',
            review_object: 'gqo-beef-teriyaki',
            reservation_permlink: 'reserve-bivtlrr48r',
            main_object: 'iwh-sushi-mura',
            beneficiaries: [
              {
                account: 'waivio',
                weight: 300,
              },
            ],
            payableInDollars: 0,
          },
          amount: 0.1,
          createdAt: '2020-03-10T12:39:33.071Z',
          updatedAt: '2020-04-22T11:20:20.911Z',
          __v: 0,
        },
      ],
      sponsor: {
        name: 'wiv01',
        wobjects_weight: 6818618.4383750055,
        alias: 'Waivio Service ',
        json_metadata:
          '{"profile":{"about":"This is a Waivio bot service. It is being used to maintain Object Reference Protocol on Steem blockchain.","location":"Internet","name":"Waivio Service ","profile_image":"https://steemitimages.com/u/waiviodev/avatar/large","website":"http://waiviodev.com/","cover_image":"https://www.gigabyte.com/FileUpload/Global/KeyFeature/1212/img/vga/21.png"}}',
      },
      user: {
        name: 'wiv01',
        wobjects_weight: 6818618.4383750055,
        alias: 'Waivio Service ',
        json_metadata:
          '{"profile":{"about":"This is a Waivio bot service. It is being used to maintain Object Reference Protocol on Steem blockchain.","location":"Internet","name":"Waivio Service ","profile_image":"https://steemitimages.com/u/waiviodev/avatar/large","website":"http://waiviodev.com/","cover_image":"https://www.gigabyte.com/FileUpload/Global/KeyFeature/1212/img/vga/21.png"}}',
      },
    };
    dispatch(setDataForSingleReport(data));
  }, []);
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
      closable
      onCancel={toggleModal}
      maskClosable={false}
      visible={isModalReportOpen}
      wrapClassName="Report"
      footer={null}
      width={768}
    >
      <ReportHeader />
      <ReportTableRewards />
      <ReportTableFees />
      <ReportFooter onClick={toggleModal} />
    </Modal>
  );
};

Report.propTypes = {
  intl: PropTypes.shape().isRequired,
  toggleModal: PropTypes.func.isRequired,
  isModalReportOpen: PropTypes.bool.isRequired,
  // sponsor: PropTypes.shape().isRequired,
};

export default injectIntl(Report);
