import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { shallow } from 'enzyme';
import ReferralInstructionsView from '../../Instructions/ReferralInstructionsView';
import {
  mockDataConfirm,
  mockDataIsBlackListUser,
  mockDataIsLoadingState,
  mockDataIsModal,
  mockDataView,
} from '../__mock__/mockData';

describe('ReferralInstructionsView', () => {
  const handleCopyTextButton = jest.fn();
  const widget = `<iframe></iframe>`;

  let props;
  let wrapper;

  beforeEach(() => {
    props = mockDataView;
    wrapper = shallow(
      <BrowserRouter>
        <IntlProvider locale="en">
          {ReferralInstructionsView(props, handleCopyTextButton, widget)}
        </IntlProvider>
      </BrowserRouter>,
    );
  });

  afterEach(() => jest.clearAllMocks());

  it('should create snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should simulate chackbox button', () => {
    const container = wrapper.find('Checkbox');
    container.simulate('change');
    expect(props.handleAgreeRulesCheckbox).toHaveBeenCalled();
  });

  it('should simulate click on copy-icon', () => {
    props = mockDataConfirm;
    wrapper = shallow(
      <BrowserRouter>
        <IntlProvider locale="en">
          {ReferralInstructionsView(props, handleCopyTextButton, widget)}
        </IntlProvider>
      </BrowserRouter>,
    );
    const container = wrapper.find('Icon');
    container.simulate('click');
    expect(handleCopyTextButton).toHaveBeenCalled();
  });

  it('should simulate click on okay modal button', () => {
    props = mockDataIsModal;
    wrapper = shallow(
      <BrowserRouter>
        <IntlProvider locale="en">
          {ReferralInstructionsView(props, handleCopyTextButton, widget)}
        </IntlProvider>
      </BrowserRouter>,
    );
    const container = wrapper.find('Modal');
    container.simulate('ok');
    expect(props.handleOkButton).toHaveBeenCalled();
  });

  it('should simulate click on cancel modal button', () => {
    props = mockDataIsModal;
    wrapper = shallow(
      <BrowserRouter>
        <IntlProvider locale="en">
          {ReferralInstructionsView(props, handleCopyTextButton, widget)}
        </IntlProvider>
      </BrowserRouter>,
    );
    const container = wrapper.find('Modal');
    container.simulate('cancel');
    expect(props.handleCancelButton).toHaveBeenCalled();
  });

  it('should return info for blacklist user', () => {
    props = mockDataIsBlackListUser;
    wrapper = shallow(
      <BrowserRouter>
        <IntlProvider locale="en">
          {ReferralInstructionsView(props, handleCopyTextButton, widget)}
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
    wrapper = shallow(
      <BrowserRouter>
        <IntlProvider locale="en">
          {ReferralInstructionsView(props, handleCopyTextButton, widget)}
        </IntlProvider>
      </BrowserRouter>,
    );
    const container = wrapper.find('.ReferralInstructions__wrap-conditions__loader').props()
      .children.props;
    expect(container).toEqual({ center: true });
  });
});
