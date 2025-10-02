import UserInfo from '../../client/app/Sidebar/UserInfo/UserInfo';
import ObjectFeed from '../../client/object/ObjectFeed';
import PostsCommentsActivity from '../../client/user/PostsCommentsActivity/PostsCommentsActivity';
import UserFollowers from '../../client/user/UserFollowers';
import Views from '../components';
import Post from '../../client/post/Post';
import URL from '../constants';
import createNestedRouts from '../helper';
import WebsiteWrapper from '../../client/WebsiteWrapper';
import User from '../../client/user/User';
import WobjectContainer from '../../client/object/Wobj/WobjectContainer';
import WebsiteBody from '../../client/websites/WebsiteLayoutComponents/Body/WebsiteBody';
import RedirectedSignIn from '../../client/components/Navigation/redirectedSignIn/RedirectedSignIn';
import WebsiteMainPage from '../../client/websites/WebsiteLayoutComponents/MainPage/WebsiteMainPage';
import { listOfWebsiteWithMainPage } from '../../common/constants/listOfWebsite';
import RewardsMainPage from '../../client/newRewards/RewardsMainPage';
import WebsiteFeed from '../../client/websites/WebsiteFeed/WebsiteFeed';
import LocalRewardsList from '../../client/newRewards/RewardLists/LocalRewardsList';
import WaivPage from '../../client/components/WaivPage/WaivPage';

const routes = (host, page) => ({
  component: WebsiteWrapper,
  routes: [
    {
      path: '/',
      exact: true,
      component:
        listOfWebsiteWithMainPage.some(site => site === host) || page === 'about'
          ? WebsiteMainPage
          : WebsiteBody,
    },
    {
      path: '/map',
      exact: true,
      component: WebsiteBody,
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
      ],
    },
    {
      path: [
        `/@:name/(${URL.USER.tabs})?/(waiv-table|table)?`,
        `/@:name/transfers/(details)/:recordId?`,
      ],
      component: User,
      exact: true,
      pathScope: '/@:name',
      routes: [
        {
          path: ['', '/(comments|activity)'],
          exact: true,
          component: PostsCommentsActivity,
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
          component: Views.UserExpertise,
        },
        {
          path: '/about',
          exact: true,
          component: UserInfo,
        },
      ],
    },
    {
      path: ['/:category?/@:author/:permlink/:original?', '/object/:name/blog/@:author/:permlink'],
      component: Post,
    },
    {
      path: [`/object/:name/(${URL.WOBJ.tabs})?/(${URL.WOBJ.filters})?/:parentName?/:itemId?`],
      component: WobjectContainer,
      exact: true,
      pathScope: '/object/:name',
      routes: [
        {
          path: ['', '/newsFilter/:itemId', '/reviews/:itemId', '/(reviews)'],
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
          path: '/(code)',
          exact: true,
          component: Views.ObjectOfTypePage,
        },
        {
          path: '/blog/@:name',
          exact: true,
          component: Views.UserProfile,
        },
        {
          path: '/newsfeed',
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
          path: '/related',
          exact: true,
          component: Views.RelatedPage,
        },
        {
          path: '/(products|books)',
          exact: true,
          component: Views.WobjProductsPage,
        },
        {
          path: '/search/:searchStr',
          exact: true,
          component: Views.WobjSearchPage,
        },
        {
          path: '/add-on',
          exact: true,
          component: Views.AddOnPage,
        },
        {
          path: '/similar',
          exact: true,
          component: Views.SimilarPage,
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
          path: '/groupId/:id',
          exact: true,
          component: Views.GroupIdPage,
        },
        {
          path: '/departments/:department',
          exact: true,
          component: Views.DepartmentsPage,
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
      path: '/wallet',
      exact: true,
      component: Views.UserWallet,
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
