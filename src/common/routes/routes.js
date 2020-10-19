import Views from '../routes/components';
import createNestedRouts from '../routes/helper';
import Page from '../../client/feed/Page';
import Post from '../../client/post/Post';
import Wrapper from '../../client/Wrapper';
import URL from './constants';

const routes = {
  component: Wrapper,
  routes: [
    {
      path: '/bookmarks',
      exact: true,
      component: Views.Bookmarks,
    },
    {
      path: [
        `/rewards/(${URL.REWARDS.tabs})/:campaignId?/:permlink?`,
        '/rewards/blacklist/:listType?',
        '/rewards/(payables|receivables)/@:userName/:reservationPermlink?',
        '/rewards/:filterKey/:campaignParent?',
      ],
      pathScope: '/rewards',
      exact: true,
      component: Views.Rewards,
      routes: [
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
          path: '/match-bot',
          exact: true,
          component: Views.MatchBotCampaign,
        },
        {
          path: '/(history|guideHistory|messages)/:campaignId?/:permlink?',
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
          path: '/:filterKey/:campaignParent?',
          exact: true,
          component: Views.RewardsComponent,
        },
      ],
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
      path: `/@:name/(${URL.USER.tabs})?/(table)?`,
      component: Views.User,
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
      path: `/object/:name/(${URL.WOBJ.tabs})?/(${URL.WOBJ.filters})?/:itemId?`,
      component: Views.Wobj,
      exact: true,
      pathScope: '/object/:name',
      routes: [
        {
          path: '',
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
          path: '/(page)',
          exact: true,
          component: Views.ObjectOfTypePage,
        },
      ],
    },
    {
      path: '/discover-objects/:typeName?',
      exact: true,
      component: Views.DiscoverObjects,
    },
    {
      path: '/discover/:search?',
      exact: true,
      component: Views.Discover,
    },
    {
      path: '/objects',
      component: Views.Objects,
    },
    {
      path: '/:category?/@:author/:permlink/:original?',
      component: Post,
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
      path: '/search',
      component: Views.Search,
    },
    {
      path: '/exit',
      component: Views.ExitPage,
    },
    {
      path: `/:sortBy(${URL.FEED.tabs})?/:category?`,
      component: Page,
      exact: true,
      pathScope: '',
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
          path: '/blog/@:name',
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
