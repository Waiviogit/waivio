import React from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { mountWithIntl } from 'enzyme-react-intl';
import AppendForm from '../AppendForm';
import { initialState } from '../__mock__/mockData';
import * as settReducer from '../../reducers';
import * as appReduc from '../../app/appReducer';

jest.mock('../AppendFormFooter', () => () => '');
jest.mock('../../translations/languages');
jest.mock('../../translations', () => {});
jest.mock('../wobjectReducer', () => () => {});
jest.mock('../../auth/authReducer', () => () => '');

const getObjectMock = jest.spyOn(settReducer, 'getObject');
getObjectMock.mockReturnValue({});

const getRatingFieldsMock = jest.spyOn(settReducer, 'getRatingFields');
getRatingFieldsMock.mockReturnValue('');

const getAuthenticatedUser = jest.spyOn(settReducer, 'getAuthenticatedUser');
getAuthenticatedUser.mockReturnValue('');

const getSuitableLanguage = jest.spyOn(settReducer, 'getSuitableLanguage');
getSuitableLanguage.mockReturnValue('');

const getLocaleMock = jest.spyOn(settReducer, 'getLocale');
getLocaleMock.mockReturnValue({});

const getVotingPower = jest.spyOn(settReducer, 'getVotingPower');
getVotingPower.mockReturnValue({});

const getFollowingObjectsListMock = jest.spyOn(settReducer, 'getFollowingObjectsList');
getFollowingObjectsListMock.mockReturnValue({});

const getVotePercentMock = jest.spyOn(settReducer, 'getVotePercent');
getVotePercentMock.mockReturnValue({});

const getRewardFundMock = jest.spyOn(appReduc, 'getRewardFund');
getRewardFundMock.mockReturnValue({});

const getRateMock = jest.spyOn(appReduc, 'getRate');
getRateMock.mockReturnValue(1);

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('AppendForm', () => {
  let wrapper;

  beforeEach(() => {
    const store = mockStore({});
    const props = {
      rate: 0.17448994918829397,
      wObject: {
        fields: initialState,
      },
    };

    wrapper = mountWithIntl(
      <Provider store={store}>
        <AppendForm {...props} />
      </Provider>,
    );
  });
  afterEach(() => jest.clearAllMocks());

  it('should check props on validation', () => {
    const props = {
      rate: 0.17448994918829397,
      wObject: {
        fields: initialState,
      },
    };

    const store = mockStore({});

    wrapper = mountWithIntl(
      <Provider store={store}>
        <AppendForm {...props} />
      </Provider>,
    );
    const input = wrapper.find('.AppendForm__input').at(1);
    input.simulate('change', { target: { value: 'молоко' } });

    expect(wrapper.find('.ant-form-explain').text()).toEqual(
      'The field with this value already exists',
    );
  });
});
