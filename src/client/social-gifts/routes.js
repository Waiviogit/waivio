import Post from '../../client/post/Post';
import User from '../../client/user/User';
import Views from '../../routes/components';
import URL from '../../routes/constants';
import WobjectContainer from '../../client/object/Wobj/WobjectContainer';
import RedirectedSignIn from '../../client/components/Navigation/redirectedSignIn/RedirectedSignIn';
import RewardsMainPage from '../../client/newRewards/RewardsMainPage';
import createNestedRouts from '../../routes/helper';
import ObjectFeed from '../object/ObjectFeed';
import UserExpertise from '../user/UserExpertise';
import UserFollowers from '../user/UserFollowers';
import ActiveCampaignList from './ActiveCampaignList/ActiveCampaignList';
import SocialWrapper from './Wrapper';
import Shop from '../Shop/Shop';
import ShopSwitcher from './ShopSwitcher/ShopSwitcher';
import ObjectDepartmentsWobjList from '../object/ObjectTypeShop/ObjectDepartmentsWobjList';
import Checklist from './Checklist/Checklist';
import UserDepartmentsWobjList from '../Shop/DepartmentsWobjList/UserDepartmentsWobjList';
import WidgetContent from './WidgetContent/WidgetContent';
import UserBlogFeed from './FeedMasonry/UserBlogFeed';
import NewDiscover from './NewDiscover/NewDiscover';
import WebsiteFeed from '../websites/WebsiteFeed/WebsiteFeed';
import DepatmentsSearch from './DepatmentsSearch/DepatmentsSearch';
import PostsCommentsActivity from '../user/PostsCommentsActivity/PostsCommentsActivity';
import LocalRewardsList from '../newRewards/RewardLists/LocalRewardsList';
import UserFavorites from '../components/Favorites/UserFavorites';
import WebsiteBody from '../websites/WebsiteLayoutComponents/Body/WebsiteBody';
import GroupObjectType from '../object/GroupObjectType/GroupObjectType';
import WaivPage from '../components/WaivPage/WaivPage';

const routes = () => ({
  component: SocialWrapper,
  routes: [
    {
      path: ['/'],
      exact: true,
      component: ShopSwitcher,
    },
    {
      path: ['/(object-shop)/:name/:department?'],
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
      path: '/active-campaigns/:objectType?',
      exact: true,
      component: ActiveCampaignList,
    },
    {
      path: ['/(recipe)/:name/:department?'],
      exact: true,
      component: Shop,
      pathScope: '/recipe/:name',
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
      path: ['/blog/:name'],
      exact: true,
      component: UserBlogFeed,
    },
    {
      path: ['/map/:name'],
      exact: true,
      isUserMap: true,
      component: WebsiteBody,
    },
    {
      path: ['/(user-shop)/:name/:department?'],
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
      path: ['/object/:name/map'],
      exact: true,
      component: WebsiteBody,
    },
    {
      path: ['/object/widget/:name'],
      exact: true,
      component: WidgetContent,
    },
    {
      path: '/notifications-list',
      component: Views.SocialNotifications,
    },
    {
      path: '/discover-objects/:type?',
      exact: true,
      component: NewDiscover,
    },
    {
      path: '/discover-users/:user?',
      exact: true,
      component: NewDiscover,
    },
    {
      path: '/discover-departments/:name/:department?',
      exact: true,
      component: DepatmentsSearch,
    },
    {
      path: '/object/page/:name',
      exact: true,
      component: Checklist,
    },
    {
      path: '/object/widget/:name',
      exact: true,
      component: WidgetContent,
    },
    {
      path: '/confirmation',
      exact: true,
      component: Views.ConfirmationModal,
    },
    {
      pathScope: '/waiv-page',
      exact: true,
      component: WaivPage,
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
          path: '/user-affiliate-codes',
          exact: true,
          component: Views.UserAffiliateCodes,
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
          path: '/(editor)',
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
        {
          path: '/data-import',
          exact: true,
          component: Views.DataImport,
        },
      ],
    },
    {
      path: [
        `/@:name/(${URL.USER.tabs})?/(waiv-table|table)?`,
        `/@:name/(userShop|recipe)/:department?`,
        `/@:name/(favorites)/:objectType?`,
        `/@:name/transfers/(details)/:recordId?`,
      ],
      component: User,
      exact: true,
      pathScope: '/@:name',
      routes: [
        {
          path: ['', '/(threads|comments|mentions|activity)'],
          exact: true,
          component: PostsCommentsActivity,
        },
        {
          path: '/(userShop)/:department?',
          exact: true,
          component: UserDepartmentsWobjList,
        },
        {
          path: '/(favorites)/:objectType?',
          exact: true,
          component: UserFavorites,
        },
        {
          path: '/recipe/:department?',
          exact: true,
          component: UserDepartmentsWobjList,
        },
        {
          path: '/map',
          exact: true,
          component: WebsiteBody,
        },
        {
          path: '/(followers|following|following-objects)',
          exact: true,
          component: UserFollowers,
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
          path: '/transfers/(table)',
          exact: true,
          component: Views.WalletTable,
        },
        {
          path: '/transfers/(waiv-table)',
          exact: true,
          component: Views.WalletTableSwitcher,
        },
        {
          path: '/transfers/(details)/:reportId?',
          exact: true,
          component: Views.DetailsTable,
        },
        {
          path: '/(expertise-hashtags|expertise-objects)',
          exact: true,
          component: UserExpertise,
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
      isSocial: true,
      routes: [
        {
          path: ['/newsFilter/:parentName/:itemId?', '/reviews/:itemId', '/(reviews)'],
          exact: true,
          component: Views.ObjectPageFeed,
        },
        {
          path: ['', '/(reviews|threads)'],
          exact: true,
          component: Views.ObjectReviewsAndThreads,
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
          path: '/(group)',
          exact: true,
          component: GroupObjectType,
        },
        {
          path: '/webpage',
          exact: true,
          component: Views.ObjectOfTypeWebpage,
        },
        {
          path: `/updates/(${URL.WOBJ.filters})?`,
          exact: true,
          component: Views.WobjHistory,
        },
        {
          path: '/blog/@:name',
          exact: true,
          component: Views.UserProfile,
        },
        {
          path: '/(newsfeed)',
          component: ObjectFeed,
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
        `/rewards/(local|global|judges)/(all|eligible)?/:requiredObject?`,
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
          path: '/(global|local|judges)',
          exact: true,
          component: LocalRewardsList,
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
          path: '/(global|local|judges)/eligible/:requiredObject?',
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
      path: '/feed',
      exact: true,
      component: WebsiteFeed,
    },
    {
      path: '*',
      component: Views.Error404,
    },
  ],
});

export default (host, page) => [createNestedRouts(routes(host, page))];
