import Views from '../components';
import Post from '../../client/post/Post';
import URL from '../constants';
import createNestedRouts from '../helper';
import WebsiteWrapper from '../../client/WebsiteWrapper';
import User from '../../client/user/User';
import WobjectContainer from '../../client/object/Wobj/WobjectContainer';
import WebsiteBody from '../../client/websites/WebsiteLayoutComponents/Body/WebsiteBody';
import Rewards from '../../client/rewards/Rewards';
import RewardsComponent from '../../client/rewards/RewardsComponent/RewardsComponent';
import RedirectedSignIn from '../../client/components/Navigation/redirectedSignIn/RedirectedSignIn';
import WebsiteMainPage from '../../client/websites/WebsiteLayoutComponents/MainPage/WebsiteMainPage';
import { listOfWebsiteWithMainPage } from '../../common/constants/listOfWebsite';
import RewardsMainPage from '../../client/newRewards/RewardsMainPage';

const routes = host => ({
  component: WebsiteWrapper,
  routes: [
    {
      path: '/',
      exact: true,
      component: !listOfWebsiteWithMainPage.some(site => site === host)
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
      path: [
        '/rewards/(payables|receivables)/@:userName/:reservationPermlink?',
        `/rewards/(${URL.REWARDS.tabs})/:campaignId?/:permlink?/:username?`,
        '/rewards/:filterKey/:campaignId?',
      ],
      pathScope: '/rewards',
      exact: true,
      component: Rewards,
      routes: [
        {
          path: '/receivables',
          exact: true,
          component: Views.ReceivablesCampaign,
        },
        {
          path: '/(payables|receivables)/@:userName/:reservationPermlink?',
          exact: true,
          component: Views.PaymentCampaign,
        },
        {
          path: '/(history|guideHistory|messages)/:campaignId?/:permlink?/:username?',
          exact: true,
          component: Views.HistoryCampaign,
        },
        {
          path: '/:filterKey/:campaignId?',
          exact: true,
          component: RewardsComponent,
        },
      ],
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
          path: '',
          exact: true,
          component: Views.UserProfile,
        },
        {
          path: '/comments',
          exact: true,
          component: Views.UserComments,
        },
        {
          path: '/followers',
          exact: true,
          component: Views.UserFollowers,
        },
        {
          path: '/following',
          exact: true,
          component: Views.UserFollowing,
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
          path: '/activity',
          exact: true,
          component: Views.UserActivity,
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
      path: `/object/:name/(${URL.WOBJ.tabs})?/(${URL.WOBJ.filters})?/:itemId?`,
      component: WobjectContainer,
      exact: true,
      pathScope: '/object/:name',
      routes: [
        {
          path: ['', '/newsFilter/:itemId'],
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
          path: '/form/:permlink',
          exact: true,
          component: Views.FormPage,
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
        `/rewards-new/(details|duplicate|create})/:campaignId?`,
        `/rewards-new/(all|eligible)/:requiredObject?`,
        `/rewards-new/(payables|receivables)/@:userName`,
        `/rewards-new/(${URL.NEW_REWARDS.tabs})`,
      ],
      pathScope: '/rewards-new',
      exact: true,
      routes: [
        {
          path: '/manage',
          exact: true,
          component: Views.RewardsManage,
        },
        {
          path: '/all',
          exact: true,
          component: Views.RewardsAll,
        },
        {
          path: '/eligible',
          exact: true,
          component: Views.EligibleRewards,
        },
        {
          path: '/(details|duplicate|create)/:campaignId?',
          exact: true,
          component: Views.CreateRewards,
        },
        {
          path: '/all/:requiredObject?',
          exact: true,
          component: Views.AllProposition,
        },
        {
          path: '/eligible/:requiredObject?',
          exact: true,
          component: Views.EligibleProposition,
        },
        {
          path: '/reserved',
          exact: true,
          component: Views.ReservedProposition,
        },
        {
          path: '/payables',
          exact: true,
          component: Views.Payables,
        },
        {
          path: '/receivables',
          exact: true,
          component: Views.Receivables,
        },
        {
          path: '/payables/@:userName',
          exact: true,
          component: Views.PayblesListByUser,
        },
        {
          path: '/receivables/@:userName',
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
    // {
    //   path: `/:sortBy(${URL.FEED.tabs})?/:category?`,
    //   component: Views.Page,
    //   routes: [
    //     {
    //       path: '/confirmation',
    //       exact: true,
    //       component: Views.ConfirmationModal,
    //     },
    //     {
    //       path: '/notifications-list',
    //       component: Views.Notifications,
    //     },
    //     {
    //       path: '/rewards-list',
    //       component: Views.RewardsList,
    //     },
    //     {
    //       path: '/feed/:name',
    //       component: Views.ObjectFeed,
    //     },
    //     {
    //       path: '/blog/@:name',
    //       component: Views.UserProfile,
    //     },
    //     {
    //       path: '/:sortBy(trending|created|hot)?/:category?',
    //       component: Views.SubFeed,
    //     },
    //   ],
    // },
    {
      path: '*',
      component: Views.Error404,
    },
  ],
});

export default host => [createNestedRouts(routes(host))];
