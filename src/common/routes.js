import URL from '../../src/common/constants/routing';

import Wrapper from '../client/Wrapper';
import Bookmarks from '../client/bookmarks/Bookmarks';
import Drafts from '../client/post/Write/Drafts';
import Replies from '../client/replies/Replies';
import Activity from '../client/activity/Activity';
import Wallet from '../client/wallet/Wallet';
import BusyEditor from '../client/post/Write/Write';
import Editor from '../client/post/EditPost/EditPost';
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
import WobjFollowers from '../client/object/WobjFollowers';
import ObjectGalleryAlbum from '../client/object/ObjectGallery/ObjectGalleryAlbum';
import WobjHistory from '../client/object/WobjHistory';
import ObjectAbout from '../client/object/ObjectAbout';
import CatalogWrap from '../client/object/Catalog/CatalogWrap';
import WobjExpertise from '../client/object/WobjExpertise';
import UserExpertise from '../client/user/UserExpertise';
import DiscoverObjects from '../client/discoverObjects/DiscoverObjects';
import Rewards from '../client/rewards/Rewards';
import CreateRewardForm from '../client/rewards/Create-Edit/CreateRewardForm';
import FilteredRewardsList from '../client/rewards/FilteredRewardsList';
import ManageCampaign from '../client/rewards/Manage/Manage';
import MatchBotCampaign from '../client/rewards/MatchBot/MatchBot';
import ReceivablesCampaign from '../client/rewards/Receivables/Receivables';
import PayablesCampaign from '../client/rewards/Payables/Payables';
import PaymentCampaign from '../client/rewards/Payment/Payment';
import ObjectOfTypePage from '../client/object/ObjectOfTypePage/ObjectOfTypePage';
import UserStatisticsContainer from '../client/user/UserStatistics/UserStatisticsContainer';
import EconomicalCalendar from '../investarena/components/EconomicalCalendar/EconomicalCalendar';
import UserInfo from '../client/app/Sidebar/UserInfo';
import QuickForecastPage from '../investarena/components/QuickForecastPage/QuickForecastPage';

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
        path: [
          '/rewards/(create|manage|match-bot|edit)/:campaignId?',
          '/rewards/payables',
          '/rewards/receivables',
          '/rewards/payables/@:userName',
          '/rewards/receivables/@:userName',
          '/rewards/:filterKey/:campaignParent?',
        ],
        exact: true,
        component: Rewards,
        routes: [
          {
            path: '/rewards/create',
            exact: true,
            component: CreateRewardForm,
          },
          {
            path: '/rewards/manage',
            exact: true,
            component: ManageCampaign,
          },
          {
            path: '/rewards/receivables',
            exact: true,
            component: ReceivablesCampaign,
          },
          {
            path: '/rewards/payables',
            exact: true,
            component: PayablesCampaign,
          },
          {
            path: '/rewards/payables/@:userName',
            exact: true,
            component: PaymentCampaign,
          },
          {
            path: '/rewards/receivables/@:userName',
            exact: true,
            component: PaymentCampaign,
          },
          {
            path: '/rewards/match-bot',
            exact: true,
            component: MatchBotCampaign,
          },
          {
            path: '/rewards/edit/:campaignId',
            exact: true,
            component: CreateRewardForm,
          },
          {
            path: '/rewards/:filterKey/:campaignParent?',
            exact: true,
            component: FilteredRewardsList,
          },
        ],
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
        path: '/quickforecast',
        component: QuickForecastPage,
        exact: true,
      },
      {
        path: '/edit',
        component: BusyEditor,
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
          // {
          //   path: `/object/:name/${URL.SEGMENT.GALLERY}`,
          //   exact: true,
          //   component: ObjectGallery,
          // },
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
