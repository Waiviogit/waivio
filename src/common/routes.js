import Loadable from 'react-loadable';
import URL from '../../src/common/constants/routing';
import Wrapper from '../client/Wrapper';
import Page from '../client/feed/Page';
import Loading from '../client/components/Icon/Loading';
import Post from '../client/post/Post';

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
const Activity = Loadable({
  loader: () => import('../client/activity/Activity'),
  loading: Loading,
});
const Wallet = Loadable({
  loader: () => import('../client/wallet/Wallet'),
  loading: Loading,
});
const BusyEditor = Loadable({
  loader: () => import('../client/post/Write/Write'),
  loading: Loading,
});
const Editor = Loadable({
  loader: () => import('../client/post/EditPost/EditPost'),
  loading: Loading,
});
const Settings = Loadable({
  loader: () => import('../client/settings/Settings'),
  loading: Loading,
});
const ProfileSettings = Loadable({
  loader: () => import('../client/settings/ProfileSettings'),
  loading: Loading,
});
const Invite = Loadable({
  loader: () => import('../client/invite/Invite'),
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
const UserProfile = Loadable({
  loader: () => import('../client/user/UserProfile'),
  loading: Loading,
});
const UserComments = Loadable({
  loader: () => import('../client/user/UserComments'),
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
const UserActivity = Loadable({
  loader: () => import('../client/activity/UserActivity'),
  loading: Loading,
});
const Discover = Loadable({
  loader: () => import('../client/discover/Discover'),
  loading: Loading,
});
const Objects = Loadable({
  loader: () => import('../client/objects/Objects'),
  loading: Loading,
});
const Search = Loadable({
  loader: () => import('../client/search/Search'),
  loading: Loading,
});
const Notifications = Loadable({
  loader: () => import('../client/notifications/Notifications'),
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
const ObjectPageFeed = Loadable({
  loader: () => import('../client/object/ObjectFeed'),
  loading: Loading,
});
const ObjectFeed = Loadable({
  loader: () => import('../client/object/ObjectFeed/ObjectFeed'),
  loading: Loading,
});
const WobjFollowers = Loadable({
  loader: () => import('../client/object/WobjFollowers'),
  loading: Loading,
});
const ObjectGallery = Loadable({
  loader: () => import('../client/object/ObjectGallery/ObjectGallery'),
  loading: Loading,
});
const ObjectGalleryAlbum = Loadable({
  loader: () => import('../client/object/ObjectGallery/ObjectGalleryAlbum'),
  loading: Loading,
});
const WobjHistory = Loadable({
  loader: () => import('../client/object/WobjHistory'),
  loading: Loading,
});
const ObjectAbout = Loadable({
  loader: () => import('../client/object/ObjectAbout'),
  loading: Loading,
});
const CatalogWrap = Loadable({
  loader: () => import('../client/object/Catalog/CatalogWrap'),
  loading: Loading,
});
const WobjExpertise = Loadable({
  loader: () => import('../client/object/WobjExpertise'),
  loading: Loading,
});
const UserExpertise = Loadable({
  loader: () => import('../client/user/UserExpertise'),
  loading: Loading,
});
const DiscoverObjects = Loadable({
  loader: () => import('../client/discoverObjects/DiscoverObjects'),
  loading: Loading,
});
const Rewards = Loadable({
  loader: () => import('../client/rewards/Rewards'),
  loading: Loading,
});
const CreateRewardForm = Loadable({
  loader: () => import('../client/rewards/Create-Edit/CreateRewardForm'),
  loading: Loading,
});
const ManageCampaign = Loadable({
  loader: () => import('../client/rewards/Manage/Manage'),
  loading: Loading,
});
const MatchBotCampaign = Loadable({
  loader: () => import('../client/rewards/MatchBot/MatchBot'),
  loading: Loading,
});
const ReceivablesCampaign = Loadable({
  loader: () => import('../client/rewards/Receivables/Receivables'),
  loading: Loading,
});
const PayablesCampaign = Loadable({
  loader: () => import('../client/rewards/Payables/Payables'),
  loading: Loading,
});
const BlacklistCampaign = Loadable({
  loader: () => import('../client/rewards/Blacklist/Blacklist'),
  loading: Loading,
});
const Reports = Loadable({
  loader: () => import('../client/rewards/Reports/Reports'),
  loading: Loading,
});
const PaymentCampaign = Loadable({
  loader: () => import('../client/rewards/Payment/Payment'),
  loading: Loading,
});
const ObjectOfTypePage = Loadable({
  loader: () => import('../client/object/ObjectOfTypePage/ObjectOfTypePage'),
  loading: Loading,
});
const SubFeed = Loadable({
  loader: () => import('../client/feed/SubFeed'),
  loading: Loading,
});
const UserInfo = Loadable({
  loader: () => import('../client/app/Sidebar/UserInfo'),
  loading: Loading,
});
const ConfirmationModal = Loadable({
  loader: () => import('../client/widgets/ConfirmationModal'),
  loading: Loading,
});
const RewardsComponent = Loadable({
  loader: () => import('../client/rewards/RewardsComponent/RewardsComponent'),
  loading: Loading,
});
const HistoryCampaign = Loadable({
  loader: () => import('../client/rewards/History/History'),
  loading: Loading,
});

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
        path: [
          '/rewards/(create|manage|match-bot|edit)/:campaignId?',
          '/rewards/payables',
          '/rewards/reports',
          '/rewards/blacklist',
          '/rewards/blacklist/references',
          '/rewards/blacklist/whitelist',
          '/rewards/receivables',
          '/rewards/payables/@:userName',
          '/rewards/payables/@:userName/:reservationPermlink',
          '/rewards/receivables/@:userName',
          '/rewards/receivables/@:userName/:reservationPermlink',
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
            path: '/rewards/reports',
            exact: true,
            component: Reports,
          },
          {
            path: '/rewards/payables/@:userName/:reservationPermlink?',
            exact: true,
            component: PaymentCampaign,
          },
          {
            path: '/rewards/receivables/@:userName/:reservationPermlink?',
            exact: true,
            component: PaymentCampaign,
          },
          {
            path: '/rewards/match-bot',
            exact: true,
            component: MatchBotCampaign,
          },
          {
            path: '/rewards/history',
            exact: true,
            component: HistoryCampaign,
          },
          {
            path: '/rewards/messages',
            exact: true,
            component: HistoryCampaign,
          },
          {
            path: '/rewards/blacklist',
            exact: true,
            component: BlacklistCampaign,
          },
          {
            path: '/rewards/blacklist/references',
            exact: true,
            component: BlacklistCampaign,
          },
          {
            path: '/rewards/blacklist/whitelist',
            exact: true,
            component: BlacklistCampaign,
          },
          {
            path: '/rewards/details/:campaignId',
            exact: true,
            component: CreateRewardForm,
          },
          {
            path: '/rewards/createDuplicate/:campaignId',
            exact: true,
            component: CreateRewardForm,
          },
          {
            path: '/rewards/:filterKey/:campaignParent?',
            exact: true,
            component: RewardsComponent,
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
        path: '/discover-objects/:typeName?',
        exact: true,
        component: DiscoverObjects,
      },
      {
        path: '/@:name/(comments|followers|followed|reblogs|transfers|activity|expertise|about)?',
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
            component: ObjectPageFeed,
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
            path: `/object/:name/${URL.SEGMENT.GALLERY}`,
            exact: true,
            component: ObjectGallery,
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
        path: '/:category?/@:author/:permlink/:original?',
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
        path: '/:sortBy(trending|created|hot|promoted|feed|blog|notifications-list)?/:category?',
        component: Page,
        exact: true,
        routes: [
          {
            path: '/confirmation',
            exact: true,
            component: ConfirmationModal,
          },
          {
            path: '/notifications-list',
            component: Notifications,
          },
          {
            path: '/feed/:name',
            component: ObjectFeed,
          },
          {
            path: '/blog/@:name',
            component: UserProfile,
          },
          {
            path: '/:sortBy(trending|created|hot)?/:category?',
            component: SubFeed,
          },
        ],
      },
      {
        path: '*',
        component: Error404,
      },
    ],
  },
];

export default routes;
