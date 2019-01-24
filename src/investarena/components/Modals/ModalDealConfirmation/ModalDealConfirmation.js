import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import _ from 'lodash';
import React from 'react';
import PostQuotation from '../../PostQuotation';
import './ModalDealConfirmation.less';

const propTypes = {
    modalInfo: PropTypes.object,
    toggleModal: PropTypes.func.isRequired,
    isModalOpenDealsOpen: PropTypes.bool.isRequired
};

const ModalDealConfirmation = (props) => {
    return (
      <Modal
        title={props.intl.formatMessage({ id: 'modalOpen.header.title', defaultMessage: 'Open deal' })}
        visible={props.isModalOpenDealsOpen}
        footer={null}
        onCancel={props.toggleModal}
        style={{width: '451px'}}
      >
        <div className="modal-open-deals">
          <div className="st-modal-open-deals-content-block-wrap">
              {props.modalInfo && !_.isEmpty(props.modalInfo) && <PostQuotation
                  quoteSecurity={props.modalInfo.quote.security}
                  amountModal={props.modalInfo.amount}
                  postId={props.modalInfo.postId}
                  toggleConfirmationModal={props.toggleModal}/>}
          </div>
        </div>
      </Modal>
    );
};

ModalDealConfirmation.propTypes = propTypes;

export default injectIntl(ModalDealConfirmation);
