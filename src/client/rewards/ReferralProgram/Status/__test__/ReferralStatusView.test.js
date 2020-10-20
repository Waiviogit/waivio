import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { shallow } from 'enzyme';
import { mockData } from '../__mock__/mockData';
import ReferralStatusView from '../ReferralStatusView';

describe('ReferralStatusView', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = mockData;
    wrapper = shallow(
      <BrowserRouter>
        <IntlProvider locale="en">
          <ReferralStatusView propsData={props} />
        </IntlProvider>
      </BrowserRouter>,
    );
  });

  afterEach(() => jest.clearAllMocks());

  it("should create ReferralStatusView's snapshot", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
