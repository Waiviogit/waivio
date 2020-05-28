import Loadable from 'react-loadable';
import URL from '../../src/common/constants/routing';
import Wrapper from '../client/Wrapper';
import Page from '../client/feed/Page';
import Loading from '../client/components/Icon/Loading';

const Search = Loadable({
  loader: () => import('../client/search/Search'),
  loading: Loading,
});
const Error404 = Loadable({
  loader: () => import('../client/statics/Error404'),
  loading: Loading,
});
const ExitPage = Loadable({
  loader: () => import('../client/statics/ExitPage'),
  loading: Loading,
});
const User = Loadable({
  loader: () => import('../client/user/User'),
  loading: Loading,
});
const Wobj = Loadable({
  loader: () => import('../client/object/Wobj'),
  loading: Loading,
});
const Post = Loadable({
  loader: () => import('../client/post/Post'),
  loading: Loading,
});
const Objects = Loadable({
  loader: () => import('../client/objects/Objects'),
  loading: Loading,
});
const UserProfile = Loadable({
  loader: () => import('../client/user/UserProfile'),
  loading: Loading,
});
const Discover = Loadable({
  loader: () => import('../client/discover/Discover'),
  loading: Loading,
});
const WobjFollowers = Loadable({
  loader: () => import('../client/object/WobjFollowers'),
  loading: Loading,
});
const ObjectProfile = Loadable({
  loader: () => import('../client/object/ObjectProfile'),
  loading: Loading,
});
const WobjHistory = Loadable({
  loader: () => import('../client/object/WobjHistory'),
  loading: Loading,
});
const UserExpertise = Loadable({
  loader: () => import('../client/user/UserExpertise'),
  loading: Loading,
});
const ObjectAbout = Loadable({
  loader: () => import('../client/object/ObjectAbout'),
  loading: Loading,
});
const WobjExpertise = Loadable({
  loader: () => import('../client/object/WobjExpertise'),
  loading: Loading,
});
const DiscoverObjects = Loadable({
  loader: () => import('../client/discoverObjects/DiscoverObjects'),
  loading: Loading,
});
const ObjectOfTypePage = Loadable({
  loader: () => import('../client/object/ObjectOfTypePage/ObjectOfTypePage'),
  loading: Loading,
});
const UserStatisticsContainer = Loadable({
  loader: () => import('../client/user/UserStatistics/UserStatisticsContainer'),
  loading: Loading,
});

const UserInfo = Loadable({
  loader: () => import('../client/app/Sidebar/UserInfo'),
  loading: Loading,
});

const EconomicalCalendar = Loadable({
  loader: () => import('../investarena/components/EconomicalCalendar/EconomicalCalendar'),
  loading: Loading,
});

const Settings = Loadable({
  loader: () => import('../client/settings/Settings'),
  loading: Loading,
});
const UserComments = Loadable({
  loader: () => import('../client/user/UserComments'),
  loading: Loading,
});
const ProfileSettings = Loadable({
  loader: () => import('../client/settings/ProfileSettings'),
  loading: Loading,
});
const Activity = Loadable({
  loader: () => import('../client/activity/Activity'),
  loading: Loading,
});
const Bookmarks = Loadable({
  loader: () => import('../client/bookmarks/Bookmarks'),
  loading: Loading,
});
const Drafts = Loadable({
  loader: () => import('../client/post/Write/Drafts'),
  loading: Loading,
});
const Replies = Loadable({
  loader: () => import('../client/replies/Replies'),
  loading: Loading,
});
const Editor = Loadable({
  loader: () => import('../client/post/EditPost/EditPost'),
  loading: Loading,
});
const Wallet = Loadable({
  loader: () => import('../client/wallet/Wallet'),
  loading: Loading,
});
const UserFollowers = Loadable({
  loader: () => import('../client/user/UserFollowers'),
  loading: Loading,
});
const UserFollowing = Loadable({
  loader: () => import('../client/user/UserFollowing'),
  loading: Loading,
});
const UserReblogs = Loadable({
  loader: () => import('../client/user/UserReblogs'),
  loading: Loading,
});
const UserWallet = Loadable({
  loader: () => import('../client/user/UserWallet'),
  loading: Loading,
});
const Invite = Loadable({
  loader: () => import('../client/invite/Invite'),
  loading: Loading,
});
const UserActivity = Loadable({
  loader: () => import('../client/activity/UserActivity'),
  loading: Loading,
});
const Notifications = Loadable({
  loader: () => import('../client/notifications/Notifications'),
  loading: Loading,
});

// not actual pages
const ObjectGalleryAlbum = Loadable({
  loader: () => import('../client/object/ObjectGallery/ObjectGalleryAlbum'),
  loading: Loading,
});
const CatalogWrap = Loadable({
  loader: () => import('../client/object/Catalog/CatalogWrap'),
  loading: Loading,
});
//
const routes = [
  {
    component: Wrapper,
    routes: [
      {
        path: '/bookmarks',
        exact: true,
        component: Bookmarks,
      },
      {
        path: '/economical-calendar',
        exact: true,
        component: EconomicalCalendar,
      },
      {
        path: '/drafts',
        exact: true,
        component: Drafts,
      },
      {
        path: '/replies',
        exact: true,
        component: Replies,
      },
      {
        path: '/activity',
        exact: true,
        component: Activity,
      },
      {
        path: '/wallet',
        exact: true,
        component: Wallet,
      },
      {
        path: '/editor',
        component: Editor,
        exact: true,
      },
      {
        path: '/settings',
        exact: true,
        component: Settings,
      },
      {
        path: '/edit-profile',
        exact: true,
        component: ProfileSettings,
      },
      {
        path: '/invite',
        exact: true,
        component: Invite,
      },
      {
        path: '/notifications',
        exact: true,
        component: Notifications,
      },
      {
        path: '/discover-objects/:typeName',
        exact: true,
        component: DiscoverObjects,
      },
      {
        path:
          '/@:name/(comments|followers|followed|reblogs|feed|transfers|activity|expertise|statistics|about)?',
        component: User,
        exact: true,
        routes: [
          {
            path: '/@:name',
            exact: true,
            component: UserProfile,
          },
          {
            path: '/@:name/comments',
            exact: true,
            component: UserComments,
          },
          {
            path: '/@:name/followers',
            exact: true,
            component: UserFollowers,
          },
          {
            path: '/@:name/followed',
            exact: true,
            component: UserFollowing,
          },
          {
            path: '/@:name/reblogs',
            exact: true,
            component: UserReblogs,
          },
          {
            path: '/@:name/transfers',
            exact: true,
            component: UserWallet,
          },
          {
            path: '/@:name/activity',
            exact: true,
            component: UserActivity,
          },
          {
            path: '/@:name/expertise',
            exact: true,
            component: UserExpertise,
          },
          {
            path: '/@:name/about',
            exact: true,
            component: UserInfo,
          },
          {
            path: '/@:name/statistics',
            exact: true,
            component: UserStatisticsContainer,
          },
        ],
      },
      {
        path: `/object/:name/(${URL.WOBJ.params[0]})?/(${URL.WOBJ.params[1]})?/:itemId?`,
        component: Wobj,
        exact: true,
        routes: [
          {
            path: '/object/:name',
            exact: true,
            component: ObjectProfile,
          },
          {
            path: `/object/:name/${URL.SEGMENT.ABOUT}`,
            exact: true,
            component: ObjectAbout,
          },
          {
            path: `/object/:name/${URL.SEGMENT.FOLLOWERS}`,
            exact: true,
            component: WobjFollowers,
          },
          {
            path: `/object/:name/${URL.SEGMENT.EXPERTISE}`,
            exact: true,
            component: WobjExpertise,
          },
          {
            path: `/object/:name/${URL.SEGMENT.GALLERY}/${URL.SEGMENT.ALBUM}/:itemId`,
            exact: true,
            component: ObjectGalleryAlbum,
          },
          {
            path: `/object/:name/${URL.SEGMENT.UPDATES}/(${URL.WOBJ.params[1]})?`,
            exact: true,
            component: WobjHistory,
          },
          {
            path: `/object/:name/(${URL.SEGMENT.LIST}|${URL.SEGMENT.MENU})`,
            exact: true,
            component: CatalogWrap,
          },
          {
            path: `/object/:name/(${URL.SEGMENT.PAGE})`,
            exact: true,
            component: ObjectOfTypePage,
          },
        ],
      },

      {
        path: '/discover/:search?',
        exact: true,
        component: Discover,
      },
      {
        path: '/objects',
        component: Objects,
      },
      {
        path: '/:category?/@:author/:permlink',
        component: Post,
      },
      {
        path: '/search',
        component: Search,
      },
      {
        path: '/exit',
        component: ExitPage,
      },
      {
        path: '/',
        exact: true,
        component: Page,
      },
      {
        path: '/my_feed',
        component: Page,
      },
      {
        path: '*',
        component: Error404,
      },
    ],
  },
];

export default routes;
