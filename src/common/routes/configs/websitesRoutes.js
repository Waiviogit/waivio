import Views from '../components';
import Post from '../../../client/post/Post';
import URL from '../constants';
import createNestedRouts from '../helper';
import WebsiteWrapper from '../../../client/WebsiteWrapper';
import User from '../../../client/user/User';
import WobjectContainer from '../../../client/object/Wobj/WobjectContainer';

const routes = {
  component: WebsiteWrapper,
  routes: [
    {
      path: '/',
      exact: true,
      component: Views.WebsiteBody,
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
        '/rewards/:filterKey/:campaignParent?',
      ],
      pathScope: '/rewards',
      exact: true,
      component: Views.Rewards,
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
          path: '/:filterKey/:campaignParent?',
          exact: true,
          component: Views.RewardsComponent,
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
      path: `/@:name/(${URL.USER.tabs})?/(table)?`,
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
      path: '/:category?/@:author/:permlink/:original?',
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
      path: '/exit',
      component: Views.ExitPage,
    },
    {
      path: '/sign-in',
      exact: true,
      component: Views.RedirectedSignIn,
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
};

export default [createNestedRouts(routes)];
