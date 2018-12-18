import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
// import { getLanguageState } from '../../../../redux/selectors/languageSelectors';
import { getModalIsOpenState } from '../../../../redux/selectors/modalsSelectors';
import TchChart from './TchChart';

const propTypes = {
    isOpen: PropTypes.bool.isRequired,
    language: PropTypes.string.isRequired
};

const TchChartContainer = (props) => <TchChart {...props}/>;

TchChartContainer.propTypes = propTypes;

function mapStateToProps (state) {
    return {
        language: 'en',
        // language: getLanguageState(state),
        isOpen: getModalIsOpenState(state, 'modalPost')
    };
}

export default connect(mapStateToProps)(TchChartContainer);
