import Post from '../../client/post/Post';
import User from '../../client/user/User';
import Views from '../../routes/components';
import URL from '../../routes/constants';
import WobjectContainer from '../../client/object/Wobj/WobjectContainer';
import RedirectedSignIn from '../../client/components/Navigation/redirectedSignIn/RedirectedSignIn';
import RewardsMainPage from '../../client/newRewards/RewardsMainPage';
import createNestedRouts from '../../routes/helper';
import SocialWrapper from './Wrapper';
import Shop from '../Shop/Shop';
import DiscoverObjects from '../discoverObjects/DiscoverObjects';
import Discover from '../discover/Discover';
import { listOfSocialWebsites } from './listOfSocialWebsites';
import SocialGiftsLandingPage from '../SocialGiftsLandingPage/SocialGiftsLandingPage';
import ShopSwitcher from './ShopSwitcher/ShopSwitcher';
import SocialProduct from './SocialProduct/SocialProduct';
import ObjectDepartmentsWobjList from '../object/ObjectTypeShop/ObjectDepartmentsWobjList';
import Checklist from './Checklist/Checklist';
import UserDepartmentsWobjList from '../Shop/DepartmentsWobjList/UserDepartmentsWobjList';
import Feed from './Feed/Feed';

const routes = host => ({
  component: SocialWrapper,
  routes: [
    {
      path: ['/'],
      exact: true,
      component: listOfSocialWebsites.some(site => site === host)
        ? SocialGiftsLandingPage
        : ShopSwitcher,
    },
    {
      path: ['/object-shop/:name/:department?'],
      exact: true,
      component: Shop,
      pathScope: '/object-shop/:name',
      isSocial: true,
      routes: [
        {
          path: '/:department?',
          exact: true,
          component: ObjectDepartmentsWobjList,
        },
      ],
    },
    {
      path: ['/blog'],
      exact: true,
      component: Feed,
    },
    {
      path: ['/user-shop/:name/:department?'],
      exact: true,
      component: Shop,
      pathScope: '/user-shop/:name',
      isSocial: true,
      routes: [
        {
          path: '/:department?',
          exact: true,
          component: UserDepartmentsWobjList,
        },
      ],
    },
    {
      path: ['/checklist/:name'],
      exact: true,
      component: Checklist,
    },
    {
      path: '/discover-objects/:typeName?',
      exact: true,
      component: DiscoverObjects,
    },
    {
      path: '/discover/:search?',
      exact: true,
      component: Discover,
    },
    {
      path: '/object/product/:name',
      exact: true,
      component: SocialProduct,
    },
    {
      path: '/object/page/:name',
      exact: true,
      component: Checklist,
    },
    {
      path: '/confirmation',
      exact: true,
      component: Views.ConfirmationModal,
    },
    {
      path: [`/(${URL.SETTINGS.tabs})`],
      exact: true,
      component: Views.SettingsMain,
      pathScope: '',
      routes: [
        {
          path: '/bookmarks',
          exact: true,
          component: Views.Bookmarks,
        },
        {
          path: '/drafts',
          exact: true,
          component: Views.Drafts,
        },
        {
          path: '/replies',
          exact: true,
          component: Views.Replies,
        },
        {
          path: '/activity',
          exact: true,
          component: Views.Activity,
        },
        {
          path: '/wallet',
          exact: true,
          component: Views.Wallet,
        },
        {
          path: '/editor',
          component: Views.Editor,
          exact: true,
        },
        {
          path: '/settings',
          exact: true,
          component: Views.Settings,
        },
        {
          path: '/edit-profile',
          exact: true,
          component: Views.ProfileSettings,
        },
        {
          path: '/invite',
          exact: true,
          component: Views.Invite,
        },
        {
          path: '/guests-settings',
          exact: true,
          component: Views.GuestsSettings,
        },
        {
          path: '/new-accounts',
          exact: true,
          component: Views.VipTicketsSetting,
        },
        {
          path: '/notification-settings',
          exact: true,
          component: Views.NotificationSettings,
        },
      ],
    },
    {
      path: `/@:name/(${URL.USER.tabs})?/(waiv-table|table)?`,
      component: User,
      exact: true,
      pathScope: '/@:name',
      routes: [
        {
          path: ['', '/(comments|activity)'],
          exact: true,
          component: Views.PostsCommentsActivity,
        },
        {
          path: '/followers',
          exact: true,
          component: Views.UserFollowers,
        },
        {
          path: '/reblogs',
          exact: true,
          component: Views.UserReblogs,
        },
        {
          path: '/transfers',
          exact: true,
          component: Views.UserWallet,
        },
        {
          path: '/transfers/table',
          exact: true,
          component: Views.WalletTable,
        },
        {
          path: '/transfers/waiv-table',
          exact: true,
          component: Views.WAIVwalletTable,
        },
        {
          path: '/expertise',
          exact: true,
          component: Views.UserExpertise,
        },
        {
          path: '/about',
          exact: true,
          component: Views.UserInfo,
        },
      ],
    },
    {
      path: ['/:category?/@:author/:permlink/:original?', '/object/:name/blog/@:author/:permlink'],
      component: Post,
    },
    {
      path: [
        `/object/:name/(${URL.WOBJ.tabs})?/(${URL.WOBJ.filters})?/:parentName?/:itemId?`,
        `/object/:name/shop/:department?`,
      ],
      component: WobjectContainer,
      exact: true,
      pathScope: '/object/:name',
      routes: [
        {
          path: ['', '/newsFilter/:parentName/:itemId?', '/reviews/:itemId'],
          exact: true,
          component: Views.ObjectPageFeed,
        },
        {
          path: '/about',
          exact: true,
          component: Views.ObjectAbout,
        },
        {
          path: '/followers',
          exact: true,
          component: Views.WobjFollowers,
        },
        {
          path: '/gallery',
          exact: true,
          component: Views.ObjectGallery,
        },
        {
          path: '/expertise',
          exact: true,
          component: Views.WobjExpertise,
        },
        {
          path: '/gallery/album/:itemId',
          exact: true,
          component: Views.ObjectGalleryAlbum,
        },
        {
          path: '/(list|menu)',
          exact: true,
          component: Views.CatalogWrap,
        },
        {
          path: '/(page)',
          exact: true,
          component: Views.ObjectOfTypePage,
        },
        {
          path: '/blog/@:name',
          exact: true,
          component: Views.UserProfile,
        },
        {
          path: '/(newsfeed)',
          component: Views.ObjectFeed,
        },
        {
          path: '/form/:permlink',
          exact: true,
          component: Views.FormPage,
        },
        {
          path: '/widget',
          exact: true,
          component: Views.WidgetPage,
        },
        {
          path: '/description',
          exact: true,
          component: Views.DescriptionPage,
        },
        {
          path: '/options/:category',
          exact: true,
          component: Views.OptionsPage,
        },
        {
          path: '/departments/:department',
          exact: true,
          component: Views.DepartmentsPage,
        },
        {
          path: '/shop/:department?',
          exact: true,
          component: ObjectDepartmentsWobjList,
        },
      ],
    },
    {
      path: '/drafts',
      exact: true,
      component: Views.Drafts,
    },
    {
      component: RewardsMainPage,
      path: [
        `/rewards/(details|duplicate|create})/:campaignId?`,
        `/rewards/(local|global)/(all|eligible)?/:requiredObject?`,
        `/rewards/(payable|receivable)/@:userName`,
        `/rewards/(${URL.NEW_REWARDS.tabs})`,
      ],
      pathScope: '/rewards',
      exact: true,
      routes: [
        {
          path: '/manage',
          exact: true,
          component: Views.RewardsManage,
        },
        {
          path: '/(global|local)',
          exact: true,
          component: Views.LocalRewardsList,
        },
        {
          path: '/(details|duplicate|create)/:campaignId?',
          exact: true,
          component: Views.CreateRewards,
        },
        {
          path: '/(global|local)/all/:requiredObject?',
          exact: true,
          component: Views.AllProposition,
        },
        {
          path: '/(global|local)/eligible/:requiredObject?',
          exact: true,
          component: Views.EligibleProposition,
        },
        {
          path: '/reserved',
          exact: true,
          component: Views.ReservedProposition,
        },
        {
          path: '/receivable',
          exact: true,
          component: Views.Receivables,
        },
        {
          path: '/payable/@:userName',
          exact: true,
          component: Views.PayblesListByUser,
        },
        {
          path: '/receivable/@:userName',
          exact: true,
          component: Views.ReceivablesListByUser,
        },
        {
          path: '/match-bots-sponsors',
          exact: true,
          component: Views.SponsorsMatchBots,
        },
        {
          path: '/reservations',
          exact: true,
          component: Views.ReservationsProposition,
        },
        {
          path: '/history',
          exact: true,
          component: Views.HistoryPropositions,
        },
        {
          path: '/messages',
          exact: true,
          component: Views.MessageList,
        },
        {
          path: '/fraud-detection',
          exact: true,
          component: Views.FraudDetectionNew,
        },
        {
          path: '/black-list',
          exact: true,
          component: Views.BlackList,
        },
        {
          path: '/reports',
          exact: true,
          component: Views.ReportsNew,
        },
      ],
    },
    {
      path: '/replies',
      exact: true,
      component: Views.Replies,
    },
    {
      path: '/activity',
      exact: true,
      component: Views.Activity,
    },
    {
      path: '/editor',
      component: Views.Editor,
      exact: true,
    },
    {
      path: '/exit',
      component: Views.ExitPage,
    },
    {
      path: '/sign-in',
      exact: true,
      isSocial: true,
      component: RedirectedSignIn,
    },
    {
      path: '*',
      component: Views.Error404,
    },
  ],
});

export default (host, page) => [createNestedRouts(routes(host, page))];
