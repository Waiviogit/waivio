import { connect } from 'react-redux';

import WobjectNearby from './WobjectNearby';
import { getNearbyObjects } from '../../../../../store/wObjectStore/wobjectsActions';
import { getObjectsNearbyArray } from '../../../../../store/wObjectStore/wObjectSelectors';

const mapStateToProps = state => ({
  nearbyObjects: getObjectsNearbyArray(state),
});

const mapDispatchToProps = dispatch => ({
  getNearbyObjects: authorPermLink => dispatch(getNearbyObjects(authorPermLink)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WobjectNearby);
