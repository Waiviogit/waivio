import * as departmentsActions from './objectDepartmentsActions';

const defaultState = {
  department: '',
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case departmentsActions.SET_DEPARTMENT:
      return {
        ...state,
        department: action.payload,
      };
    default:
      return state;
  }
};
