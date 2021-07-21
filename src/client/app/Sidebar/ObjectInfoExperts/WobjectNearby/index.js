import { connect } from 'react-redux';

import WobjectNearby from './WobjectNearby';
import { getNearbyObjects } from '../../../../../store/wObjectStore/wobjectsActions';
import { getObjectsNearbyArray } from '../../../../../store/wObjectStore/wObjectSelectors';
import { setFiltersAndLoad } from "../../../../../store/objectTypeStore/objectTypeActions";
import { getActiveFilters } from "../../../../../store/objectTypeStore/objectTypeSelectors";

const mapStateToProps = state => ({
  activeFilters: getActiveFilters(state),
  nearbyObjects: getObjectsNearbyArray(state),
});

const mapDispatchToProps = dispatch => ({
  getNearbyObjects: authorPermLink => dispatch(getNearbyObjects(authorPermLink)),
  setFiltersAndLoad: filters => dispatch(setFiltersAndLoad(filters)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WobjectNearby);
