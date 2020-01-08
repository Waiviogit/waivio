import { connect } from 'react-redux';
import React from 'react';
import { getModalInfoState, getModalIsOpenState } from '../../../redux/selectors/modalsSelectors';
import ModalOpenDeals from './ModalDealConfirmation';
import { toggleModal } from '../../../redux/actions/modalsActions';
import { getPlatformNameState } from '../../../redux/selectors/platformSelectors';

const ModalOpenDealsContainer = props => <ModalOpenDeals {...props} />;

function mapStateToProps(state) {
  return {
    modalInfo: getModalInfoState(state, 'openDeals'),
    isModalOpenDealsOpen: getModalIsOpenState(state, 'openDeals'),
    platformName: getPlatformNameState(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleModal: () => dispatch(toggleModal('openDeals')),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalOpenDealsContainer);
