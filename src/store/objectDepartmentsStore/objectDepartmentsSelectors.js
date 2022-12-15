import { createSelector } from 'reselect';

// selector
export const departmentsState = state => state.department;

// reselect function
export const getActiveDepartment = createSelector([departmentsState], state => state.department);
