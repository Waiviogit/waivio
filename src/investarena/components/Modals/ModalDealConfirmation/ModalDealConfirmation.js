import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import _ from 'lodash';
import React from 'react';
import PostQuotation from '../../PostQuotation';
import './ModalDealConfirmation.less';
import TchChart from '../ModalTC/TchChart/TchChart';

const propTypes = {
  modalInfo: PropTypes.shape(),
  toggleModal: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  isModalOpenDealsOpen: PropTypes.bool.isRequired,
};

const ModalDealConfirmation = props => {
  return (
    <Modal
      title={props.intl.formatMessage({
        id: 'modalOpen.header.title',
        defaultMessage: 'Open deal',
      })}
      visible={props.isModalOpenDealsOpen}
      footer={null}
      onCancel={props.toggleModal}
      style={{ width: '90%' }}
    >
      <div className="modal-open-deals">
        {props.modalInfo && !_.isEmpty(props.modalInfo) && (
          <div className="st-modal-open-deals-content-block-wrap">
            <div style={{ width: '100%', height: '50vh' }}>
              <TchChart
                quoteSecurity={props.modalInfo.quote.security}
                market={props.modalInfo.quote.market}
                period={'60'}
              />
            </div>
            <PostQuotation
              quoteSecurity={props.modalInfo.quote.security}
              amountModal={props.modalInfo.amount}
              postId={props.modalInfo.postId}
              toggleConfirmationModal={props.toggleModal}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

ModalDealConfirmation.propTypes = propTypes;

export default injectIntl(ModalDealConfirmation);
