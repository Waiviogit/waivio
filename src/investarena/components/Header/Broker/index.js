import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import Broker from './Broker';
import { toggleModal } from '../../../redux/actions/modalsActions';

const propTypes = {
    toggle: PropTypes.func.isRequired
};

const BrokerContainer = (props) => <Broker {...props}/>;

BrokerContainer.propTypes = propTypes;

function mapDispatchToProps (dispatch) {
    return ({
        toggle: () => { dispatch(toggleModal('broker')) }
    });
}

export default connect(null, mapDispatchToProps)(BrokerContainer);
