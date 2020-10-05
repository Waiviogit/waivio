import React from 'react';
import {mount} from 'enzyme';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import {IntlProvider} from "react-intl";
import {BrowserRouter as Router} from 'react-router-dom';

import CreateWebsite from "../CreateWebsite";

describe('<CreateWebsite />', () => {
  const mockStore = configureStore();
  const props = {
    form: {
      validateFieldsAndScroll: jest.fn(),
      getFieldValue: jest.fn(),
      getFieldDecorator: jest.fn(() => c => c),
    },
    getDomainList: () => {
    },
    parentDomain: [],
    checkStatusAvailableDomain: () => {
    },
    availableStatus: '',
    createWebsite: () => {
    },
    loading: false,
  };

  const wrapper = mount(
    <Provider store={mockStore()}>
      <Router>
        <IntlProvider locale="en">
          <CreateWebsite {...props} />
        </IntlProvider>
      </Router>
    </Provider>
  );

  it('renders without exploding', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('getDomainList should called when component did mount', () => {
    expect(props.getDomainList).toHaveBeenCalled();
  })

  it('form submit', () => {

    wrapper.find('#CreateWebsite').simulate('submit');
    expect(props.createWebsite).toHaveBeenCalled();
  });
})
