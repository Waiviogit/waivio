import React from 'react';
import { IntlProvider } from 'react-intl';
import { shallow } from 'enzyme';
import PropositionList from '../PropositionList';
import * as mock from '../__mockData__/mockData';

describe('PropositionList', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = mock.mockData;
    wrapper = shallow(
      <IntlProvider locale="en">
        <PropositionList props={props} />
      </IntlProvider>,
    );
  });

  afterEach(() => jest.clearAllMocks());

  it('should create snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
