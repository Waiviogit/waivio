import * as actions from '../../wobjActions';
import * as mock from './mockData';
import wobjectReducer from '../../wobjectReducer';

describe('Set nestedWobject in CatalogWrap', () => {
  it('setNestedWobject should be add in objects with backend ', () => {
    const payload = {
      __v: 0,
      _id: '5f50f8eb1cce890625fcff32',
      albums_count: 0,
      app: 'waiviodev/1.0.0',
      author: 'xcv47',
      author_permlink: 'ajx-2b6pzi-pizza',
      authority: {},
      bell: false,
      children: [],
      community: '',
      count_posts: 0,
      createdAt: '2020-09-03T14:08:43.163Z',
      creator: 'waivio_mariia-osadcha',
      defaultShowLink: '/object/ajx-2b6pzi-pizza/list',
      default_name: 'pizza',
      exposedFields: [
        'status',
        'avatar',
        'authority',
        'name',
        'title',
        'background',
        'parent',
        'tagCategory',
        'categoryItem',
        'galleryAlbum',
        'galleryItem',
        'website',
        'description',
        'listItem',
        'sortCustom',
      ],
      fields: [],
      followers_count: 0,
      is_extending_open: true,
      is_posting_open: true,
      last_posts_count: 0,
      last_posts_counts_by_hours: [],
      latest_posts: [],
      listItem: [],
      listItems: [],
      name: 'pizza',
      object_type: 'list',
      parent: {},
      photos_count: 0,
      preview_gallery: [],
      sortCustom: [],
      updatedAt: '2020-10-20T11:00:33.374Z',
      weight: 0,
      youFollows: false,
    };

    const action = actions.setNestedWobject(payload);
    const state = mock.MOCK_GET_NESTED_WOBJECT;
    const newState = wobjectReducer(state, action);
    expect(newState.nestedWobject).not.toBeNull();
    expect(newState.nestedWobject).not.toBeUndefined();
    expect(newState.nestedWobject).not.toEqual({});
    expect(newState.nestedWobject).toEqual(state);
  });
});
