import _ from 'lodash';
import * as wobjTypesActions from './objectTypesActions';

const initialState = {};
const feed = (state = initialState, action) => {
  switch (action.type) {
    case wobjTypesActions.GET_OBJECT_TYPES.SUCCESS:
      return {
        ..._.keyBy(action.payload, 'name'),
      };
    case wobjTypesActions.GET_MORE_OBJECTS_BY_TYPE.SUCCESS: {
      const relatedWobjects = _.keyBy(
        state[action.payload.type].related_wobjects,
        'author_permlink',
      );
      const newState = state;
      newState[action.payload.type].related_wobjects = {
        ...relatedWobjects,
        ..._.keyBy(action.payload.data, 'author_permlink'),
      };
      return { ...newState };
    }
    default:
      return state;
  }
};

export default feed;

export const getobjectTypesState = state => state;
