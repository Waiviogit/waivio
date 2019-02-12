import React from 'react';
import { connect } from 'react-redux';
import Instrument from './Instrument';
import { getPlatformNameState } from '../../../redux/selectors/platformSelectors';
import {toggleModal} from "../../../redux/actions/modalsActions";

const InstrumentContainer = props => <Instrument {...props} />;

function mapStateToProps(state) {
  return {
    platformConnect: getPlatformNameState(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleModal: (type, modalInfo) => dispatch(toggleModal(type, modalInfo)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InstrumentContainer);
