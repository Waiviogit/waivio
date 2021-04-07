import { expect } from 'chai';
import commentsReducers from '../../store/commentsStore/commentsReducer';

describe('commentsReducer', () => {
  it('is expected to return an object', () => {
    expect(commentsReducers(undefined, {})).to.be.an('object');
  });
});
