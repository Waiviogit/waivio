import * as appendActions from '../appendActions';
import appendReducer, { getIsAppendLoading } from '../appendReducer';

describe('append reducer', () => {
  it('should return the initial state', () => {
    expect(appendReducer(undefined, [])).toEqual({
      loading: false,
      error: null,
    });
  });
  it('should set loading true if APPEND_WAIVIO_OBJECT.START', () => {
    expect(appendReducer([], { type: appendActions.APPEND_WAIVIO_OBJECT.START })).toEqual({
      loading: true,
      error: null,
    });
  });
  it('should set loading false and error state if APPEND_WAIVIO_OBJECT.ERROR', () => {
    expect(
      appendReducer([], {
        type: appendActions.APPEND_WAIVIO_OBJECT.ERROR,
        payload: { message: 'someError' },
      }),
    ).toEqual({
      loading: false,
      error: 'someError',
    });
  });
  it('should set loading false and error null state if APPEND_WAIVIO_OBJECT.SUCCESS', () => {
    expect(
      appendReducer(
        {
          loading: true,
          error: { message: 'someError' },
        },
        { type: appendActions.APPEND_WAIVIO_OBJECT.SUCCESS, payload: { message: 'someError' } },
      ),
    ).toEqual({
      loading: false,
      error: null,
    });
  });
  it('should return loading state', () => {
    const initialState = { loading: true, error: { message: 'someError' } };
    expect(getIsAppendLoading(initialState)).toEqual(true);
  });
});
