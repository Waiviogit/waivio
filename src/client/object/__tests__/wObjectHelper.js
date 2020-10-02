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
  it('should sort items by type (lists first) and name by default', () => {
    expect(sortListItemsBy(items)).toEqual([list1, list2, list3, obj1, obj2]);
  });
  it('should sort items by type (lists first) and name asc', () => {
    expect(sortListItemsBy(items, 'by-name-asc')).toEqual([list1, list2, list3, obj1, obj2]);
  });
  it('should sort items by type (lists first) and name desc', () => {
    expect(sortListItemsBy(items, 'by-name-desc')).toEqual([list3, list2, list1, obj2, obj1]);
  });
  it('should sort items by type (lists first) and weight', () => {
    expect(sortListItemsBy(items, 'rank')).toEqual([list2, list3, list1, obj1, obj2]);
  });
  it('should sort items by type (lists first) and weight (by name if ranks are equal)', () => {
    const withSameRank1 = { ...obj1, id: 'id_obj', name: obj1.name.slice(0, -2) };
    const withSameRank2 = { ...obj1, id: 'id_obj-1', name: `${obj1.name}-1` };
    expect(sortListItemsBy([...items, withSameRank1, withSameRank2], 'rank')).toEqual([
      list2,
      list3,
      list1,
      withSameRank1,
      obj1,
      withSameRank2,
      obj2,
    ]);
  });
  it('should not sort if custom sort is defined and sort order is not defined', () => {
    expect(sortListItemsBy([list1, list2, list3, obj1, obj2], 'custom')).toEqual([
      list1,
      list2,
      list3,
      obj1,
      obj2,
    ]);
  });
  it('should sort items according sortOrder', () => {
    const expected = [obj2, list3, list1, obj1, list2];
    expect(
      sortListItemsBy(
        items,
        'custom',
        expected.map(item => item.id),
      ),
    ).toEqual(expected);
  });
  it('should move new items to the end of the list', () => {
    const expected = [obj2, list1, list2];
    expect(
      sortListItemsBy(
        items,
        'custom',
        expected.map(item => item.id),
      ),
    ).toEqual([...expected, list3, obj1]);
  });
  it('should skip item without error if there is no item for id in sort-order', () => {
    const expected = [obj2, list1, list2];
    expect(
      sortListItemsBy(items, 'custom', ['deleted-item_id', ...expected.map(item => item.id)]),
    ).toEqual([...expected, list3, obj1]);
  });
});
