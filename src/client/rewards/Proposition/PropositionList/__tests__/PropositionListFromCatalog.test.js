import React from 'react';
import { IntlProvider } from 'react-intl';
import { shallow } from 'enzyme';
import PropositionListFromCatalog from '../DefaultPropositionList';
import * as mock from '../__mockData__/mockData';

describe('PropositionListFromCatalog', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = mock.PropositionListFromCatalog;
    wrapper = shallow(
      <IntlProvider locale="en">
        <PropositionListFromCatalog props={props} />
      </IntlProvider>,
    );
  });

  afterEach(() => jest.clearAllMocks());

  it('should create snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
