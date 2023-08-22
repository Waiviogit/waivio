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
import RewardsMainPage from '../../client/newRewards/RewardsMainPage';
import Shop from '../../client/Shop/Shop';
import ShopDepartmentsWobjList from '../../client/Shop/DepartmentsWobjList/ShopDepartmentsWobjList';
import UserDepartmentsWobjList from '../../client/Shop/DepartmentsWobjList/UserDepartmentsWobjList';
import { isMobile } from '../../common/helpers/apiHelpers';
import ObjectDepartmentsWobjList from '../../client/object/ObjectTypeShop/ObjectDepartmentsWobjList';

const routes = {
  component: Wrapper,
  routes: [
    {
      component: Rewards,
      path: [`/rewards-old/reports`],
      pathScope: '/rewards-old',
      exact: true,
      routes: [
        {
          path: '/reports',
          exact: true,
          component: Views.Reports,
        },
      ],
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
          path: '/payable',
          exact: true,
          component: Views.Payables,
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
          path: '/referral-details',
          exact: true,
          component: Views.ReferralDetails,
        },
        {
          path: '/referral-instructions',
          exact: true,
          component: Views.ReferralInstructions,
        },
        {
          path: '/referral-status',
          exact: true,
          component: Views.ReferralStatus,
        },
        {
          path: '/match-bots-authors',
          exact: true,
          component: Views.MatchBotsAuthors,
        },
        // {
        //   path: '/referral-status/:userName/:table?',
        //   exact: true,
        //   component: Views.SponsoredRewards,
        // },
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
          path: '/settings',
          exact: true,
          component: Views.Settings,
        },
        {
          path: '/user-affiliate-codes',
          exact: true,
          component: Views.UserAffiliateCodes,
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
          path: '/data-import',
          exact: true,
          component: Views.DataImport,
        },
        {
          path: '/chrome-extension',
          exact: true,
          component: Views.ProductExtension,
        },
        {
          path: '/claim-athority',
          exact: true,
          component: Views.ClaimAthorityBot,
        },
        {
          path: '/departments-bot',
          exact: true,
          component: Views.DepartmentsBot,
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
              component: Views.SwitchConfigPage,
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
              path: '/affiliate-codes',
              exact: true,
              component: Views.AffiliateCodes,
            },
            {
              path: '/adsense',
              exact: true,
              component: Views.AdSenseAds,
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
      path: [
        `/@:name/(${URL.USER.tabs})?/(waiv-table|table|:departments)?`,
        `/@:name/userShop/:department?`,
      ],
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
          path: '/userShop/:department?',
          exact: true,
          component: UserDepartmentsWobjList,
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
        `/object/:name/search/:searchStr?`,
      ],
      component: WobjectContainer,
      exact: true,
      pathScope: '/object/:name',
      routes: [
        {
          path: ['', '/(newsFilter)/:parentName', '/(newsfeed)/:parentName/:itemId?', '/(reviews)'],
          exact: true,
          component: Views.ObjectPageFeed,
        },
        {
          path: '/about',
          exact: true,
          component: isMobile() ? Views.ObjectAbout : Views.ObjectPageFeed,
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
          path: '/(newsfeed)',
          component: Views.ObjectFeed,
        },
        {
          path: '/shop/:department?',
          exact: true,
          component: ObjectDepartmentsWobjList,
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
      path: '/shop/:department?',
      exact: true,
      component: Shop,
      pathScope: '/shop',
      routes: [
        {
          path: '/:department?',
          exact: true,
          component: ShopDepartmentsWobjList,
        },
      ],
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
          component: Views.FollowingUserRewards,
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
