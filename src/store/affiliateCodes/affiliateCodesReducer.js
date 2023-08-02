import * as affiliateCodesActions from '../affiliateCodes/affiliateCodesActions';

const defaultState = {
  objects: [],
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case affiliateCodesActions.SET_AFFILIATE_OBJECTS.START:
      return {
        ...state,
        objects: state.objects.filter(
          obj => obj.author_permlink !== action.payload?.authorPermlink,
        ),
      };
    case affiliateCodesActions.SET_AFFILIATE_OBJECTS.SUCCESS:
      return {
        ...state,
        objects: action.payload,
      };
    case affiliateCodesActions.RESET_AFFILIATE_OBJECTS:
      return {
        ...state,
        objects: [],
      };
    default:
      return state;
  }
};
