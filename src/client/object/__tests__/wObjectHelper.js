import { sortListItemsBy } from '../wObjectHelper';

describe('sortListItemsBy', () => {
  const obj1 = { id: 'id_obj1', type: 'item', name: 'obj-1', weight: 22 };
  const obj2 = { id: 'id_obj2', type: 'crypto', name: 'obj-2', weight: 11 };
  const list1 = { id: 'id_lst1', type: 'list', name: 'list-1', weight: 77 };
  const list2 = { id: 'id_lst2', type: 'list', name: 'list-2', weight: 99 };
  const list3 = { id: 'id_lst3', type: 'list', name: 'list-3', weight: 88 };

  let items = [];
  beforeEach(() => {
    items = [obj1, list1, list3, obj2, list2]
      .map(item => ({ sort: Math.random(), value: item }))
      .sort((a, b) => a.sort - b.sort)
      .map(item => item.value);
  });
  it('should return the the same items instance', () => {
    items = [];
    expect(sortListItemsBy(items, 'noMatter')).toEqual(items);
  });
});
