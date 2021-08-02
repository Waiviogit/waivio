import { connect } from 'react-redux';

import WobjectNearby from './WobjectNearby';
import {
  getObjectsNearbyArray,
  getObjectsNearbyIsLoading,
} from '../../../../../store/wObjectStore/wObjectSelectors';
import { setFiltersAndLoad } from '../../../../../store/objectTypeStore/objectTypeActions';
import { getActiveFilters } from '../../../../../store/objectTypeStore/objectTypeSelectors';

const mapStateToProps = state => ({
  activeFilters: getActiveFilters(state),
  nearbyObjects: getObjectsNearbyArray(state),
  nearbyObjectsIsLoading: getObjectsNearbyIsLoading(state),
});

const mapDispatchToProps = dispatch => ({
  setFiltersAndLoad: filters => dispatch(setFiltersAndLoad(filters)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WobjectNearby);
