import * as wobjTypeActions from './objectTypeActions';

const initialState = {};
const feed = (state = initialState, action) => {
  switch (action.type) {
    case wobjTypeActions.GET_OBJECT_TYPE.SUCCESS:
      return action.payload;
    case wobjTypeActions.CLEAR_OBJECT_TYPE:
      return initialState;
    default:
      return state;
  }
};

export default feed;

export const getobjectTypesState = state => state;
export const getobjectType = state => state;
