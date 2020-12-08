import React from 'react';
import { IntlProvider } from 'react-intl';
import { shallow } from 'enzyme';
import PropositionMainObjectCard from '../PropositionMainObjectCard';
import * as mock from '../__mockData__/mockData';

describe('PropositionMainObjectCard', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = mock.mockData;
    wrapper = shallow(
      <IntlProvider locale="en">
        <PropositionMainObjectCard props={props} />
      </IntlProvider>,
    );
  });

  afterEach(() => jest.clearAllMocks());

  it('should create snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
