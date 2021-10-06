import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { IntlProvider } from 'react-intl';
import FavoriteButton from '../FavoriteButton';

describe('<FavoriteButton />', () => {
  const intlProvider = new IntlProvider({ locale: 'en' }, {});
  const { intl } = intlProvider.getChildContext();
  let props;
  let onClick;
  let wrapper;

  beforeEach(() => {
    onClick = jest.fn();

    props = {
      intl,
      isFavorited: true,
      onClick,
    };

    wrapper = mount(
      <IntlProvider locale="en">
        <FavoriteButton {...props} />
      </IntlProvider>,
    );
    act(() => {
      wrapper.update();
    });
  });

  afterEach(() => jest.clearAllMocks());
  it('renders without exploding', () => {
    wrapper = mount(<shallow />);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should have Remove from favorites title with isFavorited true prop', () => {
    expect(wrapper.find('BTooltip').props().title).toBe('Remove from favorites');
  });

  it('Should include FavoriteButton--active in className in tag a with isFavorited true prop', () => {
    expect(wrapper.find('a').props().className).toBe('FavoriteButton FavoriteButton--active');
  });

  it('Should include icon-collection_fill in className in tag i with isFavorited true prop', () => {
    expect(wrapper.find('i').props().className).toBe('iconfont icon-collection_fill');
  });

  it('Should callonClick prop on click action on tag a', () => {
    wrapper.find('a').simulate('click');
    expect(onClick).toBeCalled();
  });

  it('Should have Add to favorites title with isFavorited false prop', () => {
    props = {
      intl,
      isFavorited: false,
      onClick,
    };

    wrapper = mount(
      <IntlProvider locale="en">
        <FavoriteButton {...props} />
      </IntlProvider>,
    );
    act(() => {
      wrapper.update();
    });
    expect(wrapper.find('BTooltip').props().title).toBe('Add to favorites');
  });

  it('Should not include FavoriteButton--active in className in tag a with isFavorited false prop', () => {
    props = {
      intl,
      isFavorited: false,
      onClick,
    };

    wrapper = mount(
      <IntlProvider locale="en">
        <FavoriteButton {...props} />
      </IntlProvider>,
    );
    act(() => {
      wrapper.update();
    });
    expect(wrapper.find('a').props().className).toBe('FavoriteButton');
  });

  it('Should include icon-collection in className in tag i with isFavorited false prop', () => {
    props = {
      intl,
      isFavorited: false,
      onClick,
    };

    wrapper = mount(
      <IntlProvider locale="en">
        <FavoriteButton {...props} />
      </IntlProvider>,
    );
    act(() => {
      wrapper.update();
    });
    expect(wrapper.find('i').props().className).toBe('iconfont icon-collection');
  });
});
