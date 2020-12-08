import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { shallow, mount } from 'enzyme';
import {
  mockDataConfirm,
  mockDataIsBlackListUser,
  mockDataIsLoadingState,
  mockDataView,
} from '../__mock__/mockData';
import ReferralsInstructionsView from '../../Instructions/ReferralInstructionsView';

describe('ReferralInstructionsView', () => {
  const handleCopyTextButton = jest.fn();
  const widget = jest.fn();

  let props;
  let wrapper;

  beforeEach(() => {
    props = mockDataView;
    wrapper = shallow(
      <BrowserRouter>
        <IntlProvider locale="en">
          <ReferralsInstructionsView
            mainProps={props}
            handleCopyTextButton={handleCopyTextButton}
            widget={widget}
          />
        </IntlProvider>
      </BrowserRouter>,
    );
  });

  afterEach(() => jest.clearAllMocks());

  it('should create snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should simulate click on copy-icon', () => {
    props = mockDataConfirm;
    wrapper = mount(
      <BrowserRouter>
        <IntlProvider locale="en">
          <ReferralsInstructionsView
            mainProps={props}
            handleCopyTextButton={handleCopyTextButton}
            widget={widget}
          />
        </IntlProvider>
      </BrowserRouter>,
    );
    const container = wrapper.find('Icon');
    container.simulate('click');
    expect(handleCopyTextButton).toHaveBeenCalled();
  });

  it('should return info for blacklist user', () => {
    props = mockDataIsBlackListUser;
    wrapper = mount(
      <BrowserRouter>
        <IntlProvider locale="en">
          <ReferralsInstructionsView
            mainProps={props}
            handleCopyTextButton={handleCopyTextButton}
            widget={widget}
          />
        </IntlProvider>
      </BrowserRouter>,
    );
    const container = wrapper.find('.ReferralInstructions__is-blacklist').props().children.props
      .defaultMessage;
    expect(container).toBe(
      'Your account {username} is listed in the Waivio’s blacklist or in other blacklists trusted by Waivio and you are not eligible to participate in the Referral program.',
    );
  });

  it('should return loading state', () => {
    props = mockDataIsLoadingState;
    wrapper = mount(
      <BrowserRouter>
        <IntlProvider locale="en">
          <ReferralsInstructionsView
            mainProps={props}
            handleCopyTextButton={handleCopyTextButton}
            widget={widget}
          />
        </IntlProvider>
      </BrowserRouter>,
    );
    const container = wrapper.find('.ReferralInstructions__wrap-conditions__loader').props()
      .children.props;
    expect(container).toEqual({ center: true });
  });
});
