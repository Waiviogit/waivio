import React from 'react';
import { IntlProvider } from 'react-intl';
import { shallow } from 'enzyme';
import ReferralUserCard from '../ReferralUserCard';
import { mockData } from '../__mock__/mockData';

describe('ReferralUserCard', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = mockData;
    wrapper = shallow(<IntlProvider locale="en">{ReferralUserCard(props)}</IntlProvider>);
  });

  afterEach(() => jest.clearAllMocks());

  it("should create ReferralUserCard's snapshot", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should simulate click on user card', () => {
    wrapper = shallow(<IntlProvider locale="en">{ReferralUserCard(props)}</IntlProvider>);
    const container = wrapper.find('.ReferralUserCard');
    container.simulate('click');
    expect(mockData.history.push).toHaveBeenCalled();
  });
});
