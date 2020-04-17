import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import { getModalIsOpenState } from '../../redux/selectors/modalsSelectors';
import TchChart from './TchChart';
import { getLocale } from '../../../client/reducers';

const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  locale: PropTypes.string.isRequired,
};

const TchChartContainer = props => <TchChart {...props} />;

TchChartContainer.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    isOpen: getModalIsOpenState(state, 'modalPost'),
    locale: getLocale(state),
  };
}

export default connect(mapStateToProps)(TchChartContainer);
