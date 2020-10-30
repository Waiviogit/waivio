import React from 'react';
import { IntlProvider } from 'react-intl';
import { shallow } from 'enzyme';
import DefaultPropositionList from '../DefaultPropositionList';
import * as mock from '../__mockData__/mockData';

describe('DefaultPropositionList', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = mock.defaultPropositionProps;
    wrapper = shallow(
      <IntlProvider locale="en">
        <DefaultPropositionList props={props} />
      </IntlProvider>,
    );
  });

  afterEach(() => jest.clearAllMocks());

  it('should create snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
