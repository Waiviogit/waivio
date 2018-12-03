import PropTypes from 'prop-types';
import React from 'react';
import './Broker.less';


const propTypes = {
    toggle: PropTypes.func.isRequired
};

const Broker = ({toggle}) => (
        <React.Fragment>
            <a onClick={toggle} className="st-header__image">
                <img src="/images/icons/broker.svg"/>
            </a>
        </React.Fragment>
    );

Broker.propTypes = propTypes;

export default Broker;
