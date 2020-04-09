import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import LinkButton from '../LinkButton/LinkButton';

describe('<LinkButton />', () => {
  let props;
  let button;
  let wrapper;

  beforeEach(() => {
    props = {
      history: {
        push: jest.fn(),
      },
      to: 'to',
      block: true,
      className: 'className',
      size: 'small',
      type: 'primary',
      onClick: jest.fn(),
    };
    wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <LinkButton {...props}>children</LinkButton>
      </MemoryRouter>,
    );
    button = wrapper.find('button');
  });

  afterEach(() => jest.clearAllMocks());

  it('Should not be undefined', () => {
    expect(wrapper).not.toBeUndefined();
  });

  it('button should not be undefined', () => {
    button = wrapper.find('.className');
    expect(button).not.toBeUndefined();
  });

  it('Should have children', () => {
    expect(button.text()).toBe('children');
  });

  it('Should have default className if type is default', () => {
    props.type = 'default';
    wrapper = mount(
      <MemoryRouter>
        <LinkButton {...props}>children</LinkButton>
      </MemoryRouter>,
    );
    expect(button.props().className).toBe(
      'ant-btn  className ant-btn-primary ant-btn-sm ant-btn-block',
    );
  });
});
