import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import { getModalIsOpenState } from '../../redux/selectors/modalsSelectors';
import { getNightmode } from '../../../client/reducers';
import TchChart from './TchChart';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isNightMode: PropTypes.bool.isRequired,
};

const TchChartContainer = props => <TchChart {...props} />;

TchChartContainer.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isOpen: getModalIsOpenState(state, 'modalPost'),
    isNightMode: getNightmode(state),
  };
}

export default connect(mapStateToProps)(TchChartContainer);
