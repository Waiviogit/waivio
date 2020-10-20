import { setNestedWobject } from '../../wobjActions';
import wobjectReducer from '../../wobjectReducer';

describe('Set nestedWobject in CatalogWrap', () => {
  it('lists should be add in objects is nestedWobject ', () => {
    const mockData = {
      albums_count: 0,
      app: 'waiviodev/1.0.0',
      author: 'vmn31',
      author_permlink: 'kpg-3r76a6-kings-menu',
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
    };

    const action = setNestedWobject(mockData);
    const state = {
      nestedWobject: {},
    };
    const newState = wobjectReducer(state, action);
    expect(newState.nestedWobject).not.toBeNull();
    expect(newState.nestedWobject).not.toBeUndefined();
    expect(newState.nestedWobject).toEqual(mockData);
  });
});
