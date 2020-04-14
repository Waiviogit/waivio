import React from 'react';
import { act } from 'react-dom/test-utils';
import { shallow } from 'enzyme';
import ObjectAvatar, { getObjectUrl, defaultUrl } from '../ObjectAvatar';

describe('getObjectUrl', () => {
  let item;
  it('should return body of field with max weight', () => {
    item = {
      fields: [
        {
          name: 'avatar',
          weight: 20,
          body: 'first url',
        },
        {
          name: 'avatar',
          weight: 40,
          body: 'second url',
        },
        {
          name: 'not-avatar',
          weight: 20,
          body: 'third url',
        },
      ],
    };
    expect(getObjectUrl(item)).toBe('second url');
  });

  it('should return null', () => {
    item = {
      fields: [
        {
          name: 'not-avatar',
          weight: 20,
          body: 'url',
        },
      ],
    };
    expect(getObjectUrl(item)).toBe(null);
    expect(getObjectUrl(item)).toBeNull();
  });
});

describe('<ObjectAvatar />', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      item: {
        fields: [
          {
            name: 'avatar',
            weight: 20,
            body: 'first url',
          },
          {
            name: 'avatar',
            weight: 40,
            body: 'waivio.second url',
          },
          {
            name: 'not-avatar',
            weight: 20,
            body: 'third url',
          },
        ],
      },
      size: 42,
    };
  });

  afterEach(() => jest.clearAllMocks());

  it('renders without exploding', () => {
    wrapper = shallow(<ObjectAvatar {...props} />);
    act(() => {
      wrapper.update();
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('should have url with _medium suffix', () => {
    wrapper = shallow(<ObjectAvatar {...props} />);
    act(() => {
      wrapper.update();
    });
    expect(wrapper.props().style.backgroundImage).toBe(`url(waivio.second url_medium)`);
  });

  it('should have url with _small suffix', () => {
    props.size = 40;
    wrapper = shallow(<ObjectAvatar {...props} />);
    act(() => {
      wrapper.update();
    });
    expect(wrapper.props().style.backgroundImage).toBe(`url(waivio.second url_small)`);
  });

  it('should have url without suffix', () => {
    props = {
      item: {
        fields: [
          {
            name: 'avatar',
            weight: 20,
            body: 'first url',
          },
          {
            name: 'avatar',
            weight: 40,
            body: 'second url',
          },
          {
            name: 'not-avatar',
            weight: 20,
            body: 'third url',
          },
        ],
      },
      size: 42,
    };
    wrapper = shallow(<ObjectAvatar {...props} />);
    act(() => {
      wrapper.update();
    });
    expect(wrapper.props().style.backgroundImage).toBe(`url(second url)`);
  });

  it('should have default url', () => {
    props.item = {};
    wrapper = shallow(<ObjectAvatar {...props} />);
    act(() => {
      wrapper.update();
    });
    expect(wrapper.props().style.backgroundImage).toBe(`url(${defaultUrl})`);
  });

  it('should have style rules as prop size', () => {
    props.item = {};
    const style = {
      minWidth: `${props.size}px`,
      width: `${props.size}px`,
      height: `${props.size}px`,
      backgroundImage: `url(${defaultUrl})`,
    };
    wrapper = shallow(<ObjectAvatar {...props} />);
    act(() => {
      wrapper.update();
    });
    expect(wrapper.props().style).toEqual(style);
  });
});
