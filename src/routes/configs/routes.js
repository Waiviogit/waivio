import Views from '../components';
import Post from '../../client/post/Post';
import Wrapper from '../../client/Wrapper';
import URL from '../constants';
import createNestedRouts from '../helper';
import User from '../../client/user/User';
import WobjectContainer from '../../client/object/Wobj/WobjectContainer';
import Page from '../../client/feed/Page';
import Rewards from '../../client/rewards/Rewards';
import Discover from '../../client/discover/Discover';
import DiscoverObjects from '../../client/discoverObjects/DiscoverObjects';
import RewardsComponent from '../../client/rewards/RewardsComponent/RewardsComponent';
import RewardsMainPage from '../../client/newRewards/RewardsMainPage';

const routes = {
  component: Wrapper,
  routes: [
    {
      component: Rewards,
      path: [
        '/rewards/(payables|receivables)/@:userName/:reservationPermlink?',
        `/rewards/(${URL.REWARDS.tabs})/:campaignId?/:permlink?/:username?`,
        `/rewards/(${URL.REFERRAL.tabs})/:userName?/:table?`,
        '/rewards/blacklist/:listType?',
        '/rewards/:filterKey/:campaignId?',
      ],
      pathScope: '/rewards',
      exact: true,
      routes: [
        {
          path: '/rebalancing',
          exact: true,
          component: Views.Rebalancing,
        },
        {
          path: '/manage',
          exact: true,
          component: Views.ManageCampaign,
        },
        {
          path: '/receivables',
          exact: true,
          component: Views.ReceivablesCampaign,
        },
        {
          path: '/payables',
          exact: true,
          component: Views.PayablesCampaign,
        },
        {
          path: '/reports',
          exact: true,
          component: Views.Reports,
        },
        {
          path: '/(payables|receivables)/@:userName/:reservationPermlink?',
          exact: true,
          component: Views.PaymentCampaign,
        },
        {
          path: '/match-bots-sponsors',
          exact: true,
          component: Views.MatchBotsSponsors,
        },
        {
          path: '/match-bots-curators',
          exact: true,
          component: Views.MatchBotsCurators,
        },
        {
          path: '/match-bots-authors',
          exact: true,
          component: Views.MatchBotsAuthors,
        },
        {
          path: '/(history|guideHistory|messages)/:campaignId?/:permlink?/:username?',
          exact: true,
          component: Views.HistoryCampaign,
        },
        {
          path: '/fraud-detection',
          exact: true,
          component: Views.FraudDetection,
        },
        {
          path: '/blacklist/:listType?',
          exact: true,
          component: Views.BlacklistCampaign,
        },
        {
          path: '/(details|createDuplicate|create)/:campaignId?',
          exact: true,
          component: Views.CreateRewardForm,
        },
        {
          path: '/referral-details/:userName',
          exact: true,
          component: Views.ReferralDetails,
        },
        {
          path: '/referral-instructions/:userName',
          exact: true,
          component: Views.ReferralInstructions,
        },
        {
          path: '/referral-status/:userName',
          exact: true,
          component: Views.ReferralStatus,
        },
        {
          path: '/referral-status/:userName/:table?',
          exact: true,
          component: Views.SponsoredRewards,
        },
        {
          path: '/:filterKey/:campaignId?',
          exact: true,
          component: RewardsComponent,
        },
      ],
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
          path: '/payables/@:userName',
          exact: true,
          component: Views.PayblesListByUser,
        },
      ],
    },
    {
      path: [`/:site/(${URL.WEBSITES.tabs})`, `/(${URL.SETTINGS.tabs})`],
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
          path: '/editor',
          component: Views.Editor,
          exact: true,
        },
        {
          path: '/edit',
          component: Views.BusyEditor,
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
          path: '/notification-settings',
          exact: true,
          component: Views.NotificationSettings,
        },
        {
          path: '/new-accounts',
          exact: true,
          component: Views.VipTicketsSetting,
        },
        {
          path: '/create',
          exact: true,
          component: Views.CreateWebsite,
        },
        {
          path: '/manage',
          exact: true,
          component: Views.ManageWebsite,
        },
        {
          path: '/payments',
          exact: true,
          component: Views.ReportsWebsite,
        },
        {
          path: `/:site/(${URL.WEBSITES.tabs})`,
          pathScope: '/:site',
          exact: true,
          component: Views.WebsiteSettings,
          routes: [
            {
              path: '/configuration',
              exact: true,
              component: Views.WebsitesConfigurations,
            },
            {
              path: '/administrations',
              exact: true,
              component: Views.WebsitesAdministrators,
            },
            {
              path: '/moderators',
              exact: true,
              component: Views.WebsiteModerators,
            },
            {
              path: '/authorities',
              exact: true,
              component: Views.WebsitesAuthorities,
            },
            {
              path: '/settings',
              exact: true,
              component: Views.WebsitesSettings,
            },
            {
              path: '/objects-filters',
              exact: true,
              component: Views.WebsiteObjectFilters,
            },
            {
              path: '/objects',
              exact: true,
              component: Views.WebsiteObjects,
            },
            {
              path: '/muted-users',
              exact: true,
              component: Views.WebsiteRestrictions,
            },
          ],
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
          path: `/updates/(${URL.WOBJ.filters})?`,
          exact: true,
          component: Views.WobjHistory,
        },
        {
          path: '/(list|menu)',
          exact: true,
          component: Views.CatalogWrap,
        },
        {
          path: '/page',
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
      path: '/exit',
      component: Views.ExitPage,
    },
    {
      path: `/:sortBy(${URL.FEED.tabs})?/:category?`,
      component: Page,
      routes: [
        {
          path: '/confirmation',
          exact: true,
          component: Views.ConfirmationModal,
        },
        {
          path: '/notifications-list',
          component: Views.Notifications,
        },
        {
          path: '/rewards-list',
          component: Views.RewardsList,
        },
        {
          path: '/feed/:name',
          component: Views.ObjectFeed,
        },
        {
          path: '/user-blog/@:name',
          component: Views.UserProfile,
        },
        {
          path: '/:sortBy(trending|created|hot)?/:category?',
          component: Views.SubFeed,
        },
      ],
    },
    {
      path: '*',
      component: Views.Error404,
    },
  ],
};

export default [createNestedRouts(routes)];
