import Wrapper from '../client/Wrapper';
import { supportedObjectFields } from '../../src/common/constants/listOfFields';

import Bookmarks from '../client/bookmarks/Bookmarks';
import Drafts from '../client/post/Write/Drafts';
import Replies from '../client/replies/Replies';
import Activity from '../client/activity/Activity';
import Wallet from '../client/wallet/Wallet';
import Editor from '../client/post/Write/Write';
import Settings from '../client/settings/Settings';
import ProfileSettings from '../client/settings/ProfileSettings';
import Invite from '../client/invite/Invite';
import User from '../client/user/User';
import Wobj from '../client/object/Wobj';
import UserProfile from '../client/user/UserProfile';
import UserComments from '../client/user/UserComments';
import UserFollowers from '../client/user/UserFollowers';
import UserFollowing from '../client/user/UserFollowing';
import UserReblogs from '../client/user/UserReblogs';
import UserWallet from '../client/user/UserWallet';
import UserActivity from '../client/activity/UserActivity';
import Post from '../client/post/Post';
import Page from '../client/feed/Page';
import Discover from '../client/discover/Discover';
import Objects from '../client/objects/Objects';
import Search from '../client/search/Search';
import Notifications from '../client/notifications/Notifications';
import Error404 from '../client/statics/Error404';
import ExitPage from '../client/statics/ExitPage';
import ObjectProfile from '../client/object/ObjectProfile';
import InstrumentsPage from '../investarena/components/InstrumentsPage';
import DealsPage from '../investarena/components/DealsPage';
import WobjFollowers from '../client/object/WobjFollowers';
import ObjectGallery from '../client/object/ObjectGallery/ObjectGallery';
import ObjectGalleryAlbum from '../client/object/ObjectGallery/ObjectGalleryAlbum';
import WobjHistory from '../client/object/WobjHistory';

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
        path: '/@:name/(comments|followers|followed|reblogs|feed|transfers|activity)?',
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
        ],
      },
      {
        path: `/object/@:name/(about|gallery|updates|reviews|followers|feed)?/(${supportedObjectFields.join(
          '|',
        )}|album)?/:albumId?`,
        component: Wobj,
        exact: true,
        routes: [
          {
            path: '/object/@:name',
            exact: true,
            component: ObjectProfile,
          },
          {
            path: '/object/@:name/reviews',
            exact: true,
            component: ObjectProfile,
          },
          {
            path: '/object/@:name/followers',
            exact: true,
            component: WobjFollowers,
          },
          {
            path: '/object/@:name/gallery',
            exact: true,
            component: ObjectGallery,
          },
          {
            path: '/object/@:name/gallery/album/:albumId',
            exact: true,
            component: ObjectGalleryAlbum,
          },
          {
            path: '/object/@:name/updates/:field?',
            exact: true,
            component: WobjHistory,
          },
        ],
      },
      {
        path: '/discover',
        exact: true,
        component: Discover,
      },
      {
        path: '/objects',
        component: Objects,
      },
      {
        path: '/markets/:marketType',
        component: InstrumentsPage,
        exact: true,
      },
      {
        path: '/deals/:dealType',
        component: DealsPage,
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
        path: '/:sortBy(trending|created|hot|promoted)?/:category?',
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
