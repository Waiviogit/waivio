import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { shallow } from 'enzyme';
import ReferralInstructionsView from '../../Instructions/ReferralInstructionsView';
import { mockDataView } from '../__mock__/mockData';

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

  it('should create snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should simulate chackbox button', () => {
    wrapper.find('Checkbox').simulate('change');
    expect(props.handleAgreeRulesCheckbox).toHaveBeenCalled();
  });
});
