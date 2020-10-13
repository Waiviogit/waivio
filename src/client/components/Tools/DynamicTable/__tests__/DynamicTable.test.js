import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow } from 'enzyme';

import { configUsersWebsitesTableHeader } from '../../../../websites/constants/tableConfig';

import { DynamicTable } from '../DynamicTable';

describe('<DynamicTable />', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      intl: { formatMessage: jest.fn() },
      header: configUsersWebsitesTableHeader,
      bodyConfig: [
        {
          active: 'active',
          name: 'name',
          parent: 'parent',
          status: 'pending',
          averageDau: 'averageDau',
          host: 'id-host.com',
        },
        {
          active: 'active',
          name: 'name',
          parent: 'parent',
          status: 'active',
          averageDau: 'averageDau',
        },
        {
          active: 'active',
          name: 'name',
          parent: 'parent',
          status: 'active',
          averageDau: 'averageDau',
          host: 'rest.com',
          pending: ['checkbox'],
        },
      ],
      onChange: jest.fn(),
      deleteItem: jest.fn(),
    };

    wrapper = shallow(<DynamicTable {...props} />);
    act(() => {
      wrapper.update();
    });
  });

  it('should render without exploding', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render 6 th node', () => {
    expect(wrapper.find('th')).toHaveLength(6);
  });

  it('should call deleteItem if click in "delete"', () => {
    wrapper.find('.DynamicTable__delete').simulate('click');
    expect(props.deleteItem).toHaveBeenCalledWith(props.bodyConfig[0]);
  });

  it('should call onChange if click in checkbox', () => {
    wrapper.find('[data-key="check/id-host.com"]').simulate('change');
    expect(props.onChange).toHaveBeenCalled();
  });

  it('shouldn`t render delete if status to be "active"', () => {
    expect(wrapper.find('.DynamicTable__delete')).toHaveLength(1);
  });

  it('should render loading in active 3th row', () => {
    expect(wrapper.find('[data-test="loading/rest.com"]')).toHaveLength(1);
  });
});
