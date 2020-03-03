import usersReducer, { initialState } from '../usersReducer';
import * as actions from '../usersActions';
import {
  stateOnGetAccountError,
  stateOnGetAccountStart,
  stateOnGetAccountSuccess,
  stateOnGetRandomError,
  stateOnGetRandomStart,
  stateOnGetRandomSuccess,
  stateOnGetTopError,
  stateOnGetTopStart,
  stateOnGetTopSuccess,
} from '../__mock__/mockData';

describe('usersReducer', () => {
  it('GET_ACCOUNT.START', () => {
    const action = {
      type: actions.GET_ACCOUNT.START,
      meta: { username: 'asd09' },
    };

    expect(usersReducer(initialState, action)).toEqual({
      ...stateOnGetAccountStart,
    });
  });

  it('GET_ACCOUNT.SUCCESS', () => {
    const action = {
      type: actions.GET_ACCOUNT.SUCCESS,
      meta: { username: 'asd09' },
    };

    expect(usersReducer(initialState, action)).toEqual({
      ...stateOnGetAccountSuccess,
    });
  });

  it('GET_ACCOUNT.ERROR', () => {
    const action = {
      type: actions.GET_ACCOUNT.ERROR,
      meta: { username: 'asd09' },
    };

    expect(usersReducer(initialState, action)).toEqual({
      ...stateOnGetAccountError,
    });
  });

  it('GET_RANDOM_EXPERTS_START', () => {
    const action = {
      type: actions.GET_RANDOM_EXPERTS_START,
    };

    expect(usersReducer(initialState, action)).toEqual({
      ...stateOnGetRandomStart,
    });
  });

  it('GET_RANDOM_EXPERTS_SUCCESS', () => {
    const action = {
      type: actions.GET_RANDOM_EXPERTS_SUCCESS,
      payload: stateOnGetRandomSuccess.randomExperts.list,
    };

    expect(usersReducer(initialState, action)).toEqual({
      ...stateOnGetRandomSuccess,
    });
  });

  it('GET_RANDOM_EXPERTS_ERROR', () => {
    const action = {
      type: actions.GET_RANDOM_EXPERTS_ERROR,
    };

    expect(usersReducer(initialState, action)).toEqual({
      ...stateOnGetRandomError,
    });
  });

  it('GET_TOP_EXPERTS_START', () => {
    const action = {
      type: actions.GET_TOP_EXPERTS_START,
    };

    expect(usersReducer(initialState, action)).toEqual({
      ...stateOnGetTopStart,
    });
  });

  it('GET_TOP_EXPERTS_SUCCESS', () => {
    const action = {
      type: actions.GET_TOP_EXPERTS_SUCCESS,
      payload: stateOnGetTopSuccess.topExperts.list,
      meta: 2,
    };

    expect(usersReducer(initialState, action)).toEqual({
      ...stateOnGetTopSuccess,
    });
  });

  it('GET_TOP_EXPERTS_ERROR', () => {
    const action = {
      type: actions.GET_TOP_EXPERTS_ERROR,
    };

    expect(usersReducer(initialState, action)).toEqual({
      ...stateOnGetTopError,
    });
  });
});
