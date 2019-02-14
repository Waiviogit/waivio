import React from 'react';
import { connect } from 'react-redux';
import './TopInsruments.less';
import InstrumentCardView from '../../../investarena/components/InstrumentsPage/Instrument/CardView';
import {makeGetQuoteState} from "../../../investarena/redux/selectors/quotesSelectors";

const TopInstrumentsItem = props => <InstrumentCardView {...props} />;

function mapStateToProps(state, ownProps) {
  const getQuoteState = makeGetQuoteState();
  return {
    quote: getQuoteState(state, ownProps),
  };
}

export default connect(mapStateToProps)(TopInstrumentsItem);
