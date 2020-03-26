import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import _ from 'lodash';
import React from 'react';
import PostQuotation from '../../PostQuotation';
import TchChart from '../../TchChart/TchChart';
import TradingForm from '../../TradingForm';
import './ModalDealConfirmation.less';

const propTypes = {
  modalInfo: PropTypes.shape(),
  toggleModal: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  isModalOpenDealsOpen: PropTypes.bool.isRequired,
  platformName: PropTypes.string.isRequired,
};

const ModalDealConfirmation = props => {
  const isModalOpen =
    props.isModalOpenDealsOpen &&
    props.modalInfo &&
    !_.isEmpty(props.modalInfo) &&
    props.modalInfo.quote;
  return (
    <React.Fragment>
      {isModalOpen && (
        <Modal
          title={props.intl.formatMessage({
            id: 'modalOpen.header.title',
            defaultMessage: 'Open deal',
          })}
          visible={!!isModalOpen}
          footer={null}
          onCancel={props.toggleModal}
          width={'90vw'}
        >
          <div className="modal-open-deals">
            <div style={{ width: '100%', height: '50vh' }}>
              <TchChart
                quoteSecurity={props.modalInfo.quote.security}
                market={props.modalInfo.quote.market}
                period={'60'}
              />
            </div>
            <TradingForm caller="od-pm" quoteSecurity={props.modalInfo.quote.security} />
            {/* {props.platformName !== 'widgets' && ( */}
            {/*  <PostQuotation */}
            {/*    quoteSecurity={props.modalInfo.quote.security} */}
            {/*    amountModal={props.modalInfo.amount} */}
            {/*    postId={props.modalInfo.postId} */}
            {/*    toggleConfirmationModal={props.toggleModal} */}
            {/*    caller={props.modalInfo.caller || 'od-pm'} */}
            {/*  /> */}
            {/* )} */}
          </div>
        </Modal>
      )}
    </React.Fragment>
  );
};

ModalDealConfirmation.propTypes = propTypes;

export default injectIntl(ModalDealConfirmation);
