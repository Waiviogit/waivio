import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import { getModalInfoState, getModalIsOpenState } from '../../../redux/selectors/modalsSelectors';
import ModalOpenDeals from './ModalDealConfirmation';
import { toggleModal } from '../../../redux/actions/modalsActions';

const propTypes = {
  modalInfo: PropTypes.object,
  toggleModal: PropTypes.func.isRequired,
  isModalOpenDealsOpen: PropTypes.bool.isRequired,
};

const ModalOpenDealsContainer = props => <ModalOpenDeals {...props} />;

ModalOpenDealsContainer.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    modalInfo: getModalInfoState(state, 'openDeals'),
    isModalOpenDealsOpen: getModalIsOpenState(state, 'openDeals'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleModal: () => dispatch(toggleModal('openDeals')),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ModalOpenDeals);
