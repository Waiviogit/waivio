import _ from 'lodash';
import * as wobjTypesActions from './objectTypesActions';

const initialState = {};
const feed = (state = initialState, action) => {
  switch (action.type) {
    case wobjTypesActions.GET_OBJECT_TYPES.SUCCESS:
      return {
        ..._.keyBy(action.payload, 'name'),
      };
    default:
      return state;
  }
};

export default feed;

export const getobjectTypesState = state => state;
