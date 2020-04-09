import React from 'react';
import { mount } from 'enzyme';
import PolicyConfirmation from '../PolicyConfirmation/PolicyConfirmation';

describe('<PolicyConfirmation />', () => {
  let props;
  let wrapper;
  let checkBox;
  let confirmationText;
  let policyConfirmation;

  beforeEach(() => {
    props = {
      isChecked: true,
      disabled: false,
      checkboxLabel: 'checkboxLabel',
      policyText: 'policyText',
      className: 'className',
      onChange: jest.fn(),
    };

    wrapper = mount(<PolicyConfirmation {...props} />);
    policyConfirmation = wrapper.find('.policy-confirmation');
    checkBox = wrapper.find('input');
    confirmationText = policyConfirmation.find('.policy-confirmation__text');
  });

  afterEach(() => jest.clearAllMocks());

  it('Should not be undefined', () => {
    expect(wrapper).not.toBeUndefined();
  });

  it('policyConfirmation should not be undefined', () => {
    expect(policyConfirmation).not.toBeUndefined();
  });

  it('checkBox should not be undefined checkBox', () => {
    expect(checkBox).not.toBeUndefined();
  });

  it('checkBox should have checked: true', () => {
    expect(checkBox.props().checked).toBe(true);
  });

  it('Should have class as policy-confirmation className', () => {
    expect(policyConfirmation.props().className).toBe('policy-confirmation className');
  });

  it('confirmationText should have text : "policyText"', () => {
    expect(confirmationText.text()).toBe('policyText');
  });
});
