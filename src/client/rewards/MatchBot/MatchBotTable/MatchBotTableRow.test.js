import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { mountWithIntl } from 'enzyme-react-intl';
import { act } from 'react-dom/test-utils';
import MatchBotTableRow from './MatchBotTableRow';

const handleEditRule = jest.fn();
const handleSwitcher = jest.fn();

// const SetModalContent = shallow(
//   <Router>
//     <MatchBotTableRow />
//   </Router>
// );

const mockStore = configureMockStore([thunk]);
const store = mockStore({});

describe('Button handler on Edit', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      handleEditRule,
      handleSwitcher,
      isAuthority: true,
      rule: {},
      isEnabled: 'activated',
    };

    act(() => {
      wrapper = mountWithIntl(
        <Provider store={store}>
          <table>
            <tbody>
              <Router>
                <MatchBotTableRow {...props} />
              </Router>
            </tbody>
          </table>
        </Provider>,
      );
    });
  });

  it('Call button Edit once', () => {
    act(() => {
      wrapper.update();
    });
    wrapper.find('.MatchBotTable__edit').simulate('click');
    expect(handleEditRule).toHaveBeenCalled();
  });

  // it('Click on checkbox', () => {
  //   act(() => {
  //     wrapper.update();
  //   });
  //
  //   wrapper.find('.ant-checkbox-input').simulate('change');
  //   expect(handleSwitcher).toHaveBeenCalled();
  // });
});
