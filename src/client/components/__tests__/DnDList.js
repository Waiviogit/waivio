import React from 'react';
import { mount } from 'enzyme';
import DnDList, { getItemStyle, reorder } from '../DnDList/DnDList';
import DnDListItem from '../DnDList/DnDListItem';

describe('<DnDList />', () => {
  let props = {
    name: 'name',
    type: 'type',
  };

  describe('<DnDListItem />', () => {
    it('Should not be undefined', () => {
      const wrapper = mount(<DnDListItem {...props} />);

      expect(wrapper).not.toBeUndefined();
    });

    it('Block with className: dnd-list-item__name should not be undefined', () => {
      const wrapper = mount(<DnDListItem {...props} />);

      expect(wrapper.find('.dnd-list-item__name')).not.toBeUndefined();
    });

    it('Block with className: dnd-list-item__type should not be undefined', () => {
      const wrapper = mount(<DnDListItem {...props} />);

      expect(wrapper.find('.dnd-list-item__type')).not.toBeUndefined();
    });

    it('Block with className: dnd-list-item__type should have text "type"', () => {
      const wrapper = mount(<DnDListItem {...props} />);

      expect(wrapper.find('.dnd-list-item__type').text()).toBe('type');
    });

    it('Block with className: dnd-list-item__name should have text "name"', () => {
      const wrapper = mount(<DnDListItem {...props} />);

      expect(wrapper.find('.dnd-list-item__name').text()).toBe('name');
    });
  });

  describe('Function getItemStyle', () => {
    it('Should return object:"boxShadow": "none", opacity: 1  if args: undefined', () => {
      expect(getItemStyle()).toEqual({
        boxShadow: 'none',
        opacity: 1,
      });
    });

    it('Should return object:"boxShadow": "0 0 5px red, 0 0 10px red", opacity: 1  if args: true, true, {}, "red"', () => {
      expect(getItemStyle(true, true, {}, 'red')).toEqual({
        boxShadow: '0 0 5px red, 0 0 10px red',
        opacity: 1,
      });
    });

    it('Should return object:"boxShadow": "none", opacity: 0.65  if args: true, false, {}, "red"', () => {
      expect(getItemStyle(true, false, {}, 'red')).toEqual({
        boxShadow: 'none',
        opacity: '.65',
      });
    });

    it('Should return object:"boxShadow": "0 0 5px red, 0 0 10px red", opacity: 1 if args: false, false, {}, "red"', () => {
      expect(getItemStyle(false, false, {}, 'red')).toEqual({
        boxShadow: 'none',
        opacity: 1,
      });
    });

    it('Should return object:"boxShadow": "0 0 5px red, 0 0 10px red", opacity: 1 if args: false, true, {}, "red"', () => {
      expect(getItemStyle(false, true, {}, 'red')).toEqual({
        boxShadow: '0 0 5px red, 0 0 10px red',
        opacity: 1,
      });
    });

    it('Should return object:"boxShadow": "0 0 5px red, 0 0 10px red", opacity: 1 if args: false, true, {background:red}, "red"', () => {
      expect(getItemStyle(false, true, { background: 'red' }, 'red')).toEqual({
        boxShadow: '0 0 5px red, 0 0 10px red',
        opacity: 1,
        background: 'red',
      });
    });
  });

  describe('Function reorder', () => {
    it('Should reorder array of numbers', () => {
      const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      expect(reorder(list, 4, 7)).toEqual([1, 2, 3, 4, 6, 7, 8, 5, 9, 10]);
    });

    it('Should reorder array of strings', () => {
      const list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'k', 'l', 'm'];

      expect(reorder(list, 4, 7)).toEqual(['a', 'b', 'c', 'd', 'f', 'g', 'k', 'e', 'l', 'm']);
    });

    it('Should reorder array of strings if arg: 0, 0', () => {
      const list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'k', 'l', 'm'];

      expect(reorder(list, 0, 0)).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'k', 'l', 'm']);
    });
  });

  describe('<DnDList/>', () => {
    props = {
      listItems: [{ id: 'id', content: React.createElement('div') }],
      accentColor: 'accentColor',
      onChange: jest.fn(),
      name: 'name',
      type: 'type',
    };

    it('Should not be undefined', () => {
      const wrapper = mount(<DnDList {...props} />);

      expect(wrapper).not.toBeUndefined();
    });
  });
});
