import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import { getModalIsOpenState } from '../../redux/selectors/modalsSelectors';
import TchChart from './TchChart';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

const TchChartContainer = props => <TchChart {...props} />;

TchChartContainer.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isOpen: getModalIsOpenState(state, 'modalPost'),
  };
}

export default connect(mapStateToProps)(TchChartContainer);
