import { get, isEmpty, remove, findIndex, isEqual, uniqBy } from 'lodash';
import * as searchActions from './searchActions';
import { userToggleFollow } from '../../search/helpers';

const initialState = {
  loading: true,
  searchError: false,
  searchResults: [],
  autoCompleteSearchResults: [],
  searchObjectsResults: [],
  usersForDiscoverPage: {
    result: [],
    loading: false,
  },
  beneficiariesUsers: [{ account: 'waivio', weight: 300 }],
  isStartSearchAutoComplete: false,
  isStartSearchUser: false,
  isStartSearchObject: false,
  isClearSearchObjects: false,
  websiteSearchType: '',
  websiteSearchResult: [],
  searchUsersResults: [],
  websiteSearchString: '',
  tagCategory: [],
  sort: 'weight',
  showSearchResult: false,
  allSearchLoadingMore: false,
  hasMoreObjectsForWebsite: false,
  websiteMap: {},
  searchInBox: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case searchActions.AUTO_COMPLETE_SEARCH.START:
      return {
        ...state,
        isStartSearchAutoComplete: true,
      };
    case searchActions.AUTO_COMPLETE_SEARCH.SUCCESS: {
      const { result, search } = action.payload;
      const { followingUsersList } = action.meta;

      result.users.forEach(user => {
        // eslint-disable-next-line no-param-reassign
        user.isFollowing = followingUsersList.includes(user.account);
      });

      return {
        ...state,
        autoCompleteSearchResults: isEmpty(search) ? [] : result,
        isStartSearchAutoComplete: false,
      };
    }
    case searchActions.RESET_AUTO_COMPLETE_SEARCH: {
      return {
        ...state,
        autoCompleteSearchResults: [],
        searchObjectsResults: [],
        searchUsersResults: [],
        websiteSearchResult: [],
        tagCategory: [],
      };
    }
    case searchActions.SEARCH_OBJECTS.START:
      return {
        ...state,
        isStartSearchObject: true,
      };
    case searchActions.SEARCH_OBJECTS.SUCCESS: {
      const result = get(action, ['payload', 'result']);
      const search = get(action, ['payload', 'search']);

      return {
        ...state,
        searchObjectsResults: isEmpty(search) ? [] : get(result, 'wobjects', []),
        hasMoreObjects: get(result, 'hasMore', false),
        isStartSearchObject: false,
      };
    }

    case searchActions.SEARCH_OBJECTS.ERROR: {
      return initialState;
    }
    case searchActions.SEARCH_OBJECT_TYPES.SUCCESS: {
      const { result, search } = action.payload;

      return {
        ...state,
        searchObjectTypesResults: isEmpty(search) ? [] : result,
      };
    }

    case searchActions.SEARCH_USERS.START:
      return {
        ...state,
        isStartSearchUser: true,
      };

    case searchActions.SEARCH_USERS.SUCCESS: {
      const { result } = action.payload;

      return {
        ...state,
        searchUsersResults: get(result, 'users', []),
        hasMoreUsers: get(result, 'hasMore', []),
        isStartSearchUser: false,
      };
    }

    case searchActions.SEARCH_USERS_LOADING_MORE.START: {
      return {
        ...state,
        allSearchLoadingMore: true,
      };
    }

    case searchActions.SEARCH_USERS_LOADING_MORE.SUCCESS: {
      return {
        ...state,
        searchUsersResults: [...state.searchUsersResults, ...get(action.payload, 'users', [])],
        hasMoreUsers: get(action.payload, 'hasMore', []),
        isStartSearchUser: false,
        allSearchLoadingMore: false,
      };
    }

    case searchActions.SEARCH_USERS_FOR_DISCOVER_PAGE.START: {
      return {
        ...state,
        usersForDiscoverPage: {
          result: [],
          loading: true,
        },
      };
    }
    case searchActions.SEARCH_USERS_FOR_DISCOVER_PAGE.SUCCESS: {
      const { result } = action.payload;

      return {
        ...state,
        usersForDiscoverPage: {
          result: result.users,
          loading: false,
        },
      };
    }
    case searchActions.SEARCH_USERS_FOR_DISCOVER_PAGE.ERROR: {
      return {
        ...state,
        usersForDiscoverPage: {
          result: [...state.usersForDiscoverPage.result],
          loading: false,
        },
      };
    }

    case searchActions.RESET_SEARCH_USERS_FOR_DISCOVER_PAGE: {
      return {
        ...state,
        usersForDiscoverPage: [],
      };
    }
    case searchActions.CLEAR_SEARCH_OBJECTS_RESULT: {
      return {
        ...state,
        searchObjectsResults: [],
        isClearSearchObjects: true,
      };
    }
    case searchActions.RESET_TO_INITIAL_IS_CLEAR_SEARCH_OBJECTS: {
      return {
        ...state,
        isClearSearchObjects: false,
      };
    }

    case searchActions.UNFOLLOW_SEARCH_USER.START: {
      userToggleFollow(state.usersForDiscoverPage.result, action.meta.username, {
        youFollows: true,
      });

      return {
        ...state,
        usersForDiscoverPage: {
          ...state.usersForDiscoverPage,
          result: [...state.usersForDiscoverPage.result],
        },
      };
    }
    case searchActions.UNFOLLOW_SEARCH_USER.SUCCESS: {
      userToggleFollow(state.usersForDiscoverPage.result, action.meta.username, {
        youFollows: false,
        pending: false,
      });

      return {
        ...state,
        usersForDiscoverPage: {
          ...state.usersForDiscoverPage,
          result: [...state.usersForDiscoverPage.result],
        },
      };
    }
    case searchActions.UNFOLLOW_SEARCH_USER.ERROR: {
      userToggleFollow(state.usersForDiscoverPage.result, action.meta.username, {
        pending: false,
      });

      return {
        ...state,
        usersForDiscoverPage: {
          ...state.usersForDiscoverPage,
          result: [...state.usersForDiscoverPage.result],
        },
      };
    }

    case searchActions.FOLLOW_SEARCH_USER.START: {
      userToggleFollow(state.usersForDiscoverPage.result, action.meta.username, {
        pending: true,
      });

      return {
        ...state,
        usersForDiscoverPage: {
          ...state.usersForDiscoverPage,
          result: [...state.usersForDiscoverPage.result],
        },
      };
    }
    case searchActions.FOLLOW_SEARCH_USER.SUCCESS: {
      userToggleFollow(state.usersForDiscoverPage.result, action.meta.username, {
        youFollows: true,
        pending: false,
      });

      return {
        ...state,
        usersForDiscoverPage: {
          ...state.usersForDiscoverPage,
          result: [...state.usersForDiscoverPage.result],
        },
      };
    }
    case searchActions.FOLLOW_SEARCH_USER.ERROR: {
      userToggleFollow(state.usersForDiscoverPage.result, action.meta.username, {
        pending: false,
      });

      return {
        ...state,
        usersForDiscoverPage: {
          ...state.usersForDiscoverPage,
          result: [...state.usersForDiscoverPage.result],
        },
      };
    }

    case searchActions.UNFOLLOW_SEARCH_USER_WEBSITE.START: {
      userToggleFollow(state.searchUsersResults, action.meta.username, {
        pending: true,
      });

      return {
        ...state,
        searchUsersResults: [...state.searchUsersResults],
      };
    }
    case searchActions.UNFOLLOW_SEARCH_USER_WEBSITE.SUCCESS: {
      userToggleFollow(state.searchUsersResults, action.meta.username, {
        pending: false,
        youFollows: false,
      });

      return {
        ...state,
        searchUsersResults: [...state.searchUsersResults],
      };
    }
    case searchActions.UNFOLLOW_SEARCH_USER_WEBSITE.ERROR: {
      userToggleFollow(state.searchUsersResults, action.meta.username, {
        pending: false,
      });

      return {
        ...state,
        searchUsersResults: [...state.searchUsersResults],
      };
    }

    case searchActions.FOLLOW_SEARCH_USER_WEBSITE.START: {
      userToggleFollow(state.searchUsersResults, action.meta.username, {
        pending: true,
      });

      return {
        ...state,
        searchUsersResults: [...state.searchUsersResults],
      };
    }
    case searchActions.FOLLOW_SEARCH_USER_WEBSITE.SUCCESS: {
      userToggleFollow(state.searchUsersResults, action.meta.username, {
        pending: false,
        youFollows: true,
      });

      return {
        ...state,
        searchUsersResults: [...state.searchUsersResults],
      };
    }
    case searchActions.FOLLOW_SEARCH_USER_WEBSITE.ERROR: {
      userToggleFollow(state.searchUsersResults, action.meta.username, {
        pending: false,
      });

      return {
        ...state,
        searchUsersResults: [...state.searchUsersResults],
      };
    }

    case searchActions.SAVE_BENEFICIARIES_USERS.ACTION: {
      const key = action.payload;
      const newBeneficiariesUsers = [...state.beneficiariesUsers, { account: key, weight: 0 }];

      return {
        ...state,
        beneficiariesUsers: newBeneficiariesUsers,
      };
    }

    case searchActions.UPDATE_BENEFICIARIES_USERS.ACTION: {
      const { name, percent } = action.payload;
      const newBeneficiariesUsers = [...state.beneficiariesUsers];
      const benefIndex = findIndex(newBeneficiariesUsers, user => user.account === name);

      newBeneficiariesUsers[benefIndex].weight = percent * 100;

      return {
        ...state,
        beneficiariesUsers: newBeneficiariesUsers,
      };
    }

    case searchActions.REMOVE_BENEFICIARIES_USERS.ACTION: {
      const newBeneficiarieUsers = [...state.beneficiariesUsers];

      remove(newBeneficiarieUsers, user => user.account === action.payload);

      return {
        ...state,
        beneficiariesUsers: newBeneficiarieUsers,
      };
    }

    case searchActions.CLEAR_BENEFICIARIES_USERS.ACTION: {
      return {
        ...state,
        beneficiariesUsers: [{ account: 'waivio', weight: 300 }],
      };
    }

    case searchActions.WEBSITE_SEARCH_TYPE: {
      return {
        ...state,
        websiteSearchType: action.payload,
        tagCategory: [],
      };
    }

    case searchActions.SEARCH_OBJECTS_FOR_WEBSITE.START: {
      return {
        ...state,
        websiteSearchResultLoading: true,
      };
    }
    case searchActions.SEARCH_OBJECTS_FOR_WEBSITE.SUCCESS: {
      return {
        ...state,
        websiteSearchResult: uniqBy(get(action, 'payload.wobjects', []), '_id'),
        hasMoreObjectsForWebsite: action.payload.hasMore,
        websiteSearchResultLoading: false,
      };
    }
    case searchActions.SEARCH_OBJECTS_FOR_WEBSITE.ERROR: {
      return {
        ...state,
        websiteSearchResult: [],
        hasMoreObjectsForWebsite: false,
        websiteSearchResultLoading: false,
      };
    }
    case searchActions.SEARCH_OBJECTS_LOADING_MORE_FOR_WEBSITE.START: {
      return {
        ...state,
        allSearchLoadingMore: true,
      };
    }

    case searchActions.SEARCH_OBJECTS_LOADING_MORE_FOR_WEBSITE.SUCCESS: {
      return {
        ...state,
        websiteSearchResult: uniqBy(
          [...state.websiteSearchResult, ...action.payload.wobjects],
          '_id',
        ),
        hasMoreObjectsForWebsite: action.payload.hasMore,
        isStartSearchObject: false,
        allSearchLoadingMore: false,
      };
    }

    case searchActions.SEARCH_OBJECTS_LOADING_MORE_FOR_WEBSITE.ERROR: {
      return {
        ...state,
        hasMoreObjectsForWebsite: false,
        isStartSearchObject: false,
        allSearchLoadingMore: false,
      };
    }

    case searchActions.GET_FILTER_FOR_SEARCH.SUCCESS: {
      return {
        ...state,
        filters: action.payload,
      };
    }

    case searchActions.GET_FILTER_FOR_SEARCH_MORE.SUCCESS: {
      const currFilters = action.payload.reduce((acc, curr) => {
        const category = state.filters.find(f => f.tagCategory === curr.tagCategory);

        return category
          ? [...acc, { ...category, tags: uniqBy([...category.tags, curr.tags], isEqual) }]
          : [...acc, curr];
      }, []);

      return {
        ...state,
        filters: uniqBy([...state.filters, ...currFilters], 'tagCategory'),
      };
    }

    case searchActions.SET_WEBSITE_SEARCH_FILTER: {
      const { category, tag } = action.payload;
      const showAllResult = tag === 'all';
      let tagCategories = [...state.tagCategory];
      const currentCategory = tagCategories.find(
        currCategory => currCategory.categoryName === category,
      );

      if (!currentCategory && !showAllResult) {
        return {
          ...state,
          tagCategory: [
            ...tagCategories,
            {
              categoryName: category,
              tags: [tag],
            },
          ],
        };
      }

      const isChecked = !currentCategory.tags.includes(tag);

      tagCategories = tagCategories.filter(categ => categ.categoryName !== category);

      if (isChecked && !showAllResult) {
        tagCategories = [
          ...tagCategories,
          {
            categoryName: category,
            tags: [tag],
          },
        ];
      }

      return {
        ...state,
        tagCategory: [...tagCategories],
      };
    }

    case searchActions.SET_WEBSITE_SEARCH_STRING: {
      return {
        ...state,
        websiteSearchString: action.payload,
      };
    }

    case searchActions.SET_FILTER_FROM_QUERY: {
      return {
        ...state,
        tagCategory: action.payload,
      };
    }

    case searchActions.SET_SEARCH_SORT: {
      return {
        ...state,
        sort: action.payload,
      };
    }

    case searchActions.SET_SHOW_RESULT: {
      return {
        ...state,
        showSearchResult: action.payload,
        websiteSearchType: state.websiteSearchType || 'restaurant',
      };
    }

    case searchActions.SET_OWNER_BENEFICIARY: {
      return {
        ...state,
        beneficiariesUsers: action.payload,
      };
    }

    case searchActions.SET_MAP_FOR_SEARCH: {
      return {
        ...state,
        websiteMap: action.payload,
      };
    }

    case searchActions.SET_SEARCH_IN_BOX: {
      return {
        ...state,
        searchInBox: action.payload,
      };
    }

    default:
      return state;
  }
};
