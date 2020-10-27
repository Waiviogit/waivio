import wobjectReducer from '../wobjectReducer';
import * as actions from '../wobjActions';

const reducerInitialState = {
  wobject: {},
  nestedWobject: {},
  isFetching: false,
  isFailed: false,
  breadcrumb: [],
};

describe('wobjectReducer reducer', () => {
  it('should be set nestedWobject with API', () => {
    const action = {
      type: actions.SET_WOBJECT_NESTED,
      payload: ['item 1', 'item 2', 'item 3'],
    };
    expect(wobjectReducer(reducerInitialState, action)).toEqual({
      ...reducerInitialState,
      nestedWobject: action.payload,
    });
  });
  it('should be set breadCrumbs', () => {
    const action = {
      type: actions.SET_CATALOG_BREADCRUMBS,
      payload: [
        {
          id: 'kpg-3r76a6-kings-menu',
          name: 'Kings menu',
          title: '',
          path: '/object/kpg-3r76a6-kings-menu/list',
        },
      ],
    };
    expect(wobjectReducer(reducerInitialState, action)).toEqual({
      ...reducerInitialState,
      breadcrumb: action.payload,
    });
  });
});
