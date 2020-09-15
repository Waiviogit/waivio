import URL from '../../src/common/constants/routing';
import Wrapper from '../client/Wrapper';
import Page from '../client/feed/Page';
import Post from '../client/post/Post';
import {
  PATH_NAME_GUIDE_HISTORY,
  PATH_NAME_MESSAGES,
  PATH_NAME_RECEIVABLES,
  PATH_NAME_CREATE,
  PATH_NAME_PAYABLES,
  PATH_NAME_HISTORY,
} from './constants/rewards';
import Views from '../routes/components';
import Path from '../routes/paths';

const routes = [
  {
    component: Wrapper,
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
        path: '/notification-settings',
        exact: true,
        component: Views.NotificationSettings,
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
        path: '/search',
        component: Views.Search,
      },
      {
        path: Path.Exit,
        component: Views.ExitPage,
      },
      {
        path: [
          '/rewards/(create|manage|match-bot|edit)/:campaignId?',
          '/rewards/(history|guideHistory|messages)',
          PATH_NAME_PAYABLES,
          '/rewards/reports',
          '/rewards/blacklist/:listType?',
          PATH_NAME_RECEIVABLES,
          '/rewards/payables/@:userName/:reservationPermlink?',
          '/rewards/receivables/@:userName/:reservationPermlink?',
          '/rewards/:filterKey/:campaignParent?',
        ],
        exact: true,
        component: Views.Rewards,
        routes: [
          {
            path: Path.ManageCampaign,
            exact: true,
            component: Views.ManageCampaign,
          },
          {
            path: PATH_NAME_RECEIVABLES,
            exact: true,
            component: Views.ReceivablesCampaign,
          },
          {
            path: PATH_NAME_PAYABLES,
            exact: true,
            component: Views.PayablesCampaign,
          },
          {
            path: '/rewards/reports',
            exact: true,
            component: Views.Reports,
          },
          {
            path: [
              '/rewards/payables/@:userName/:reservationPermlink?',
              '/rewards/receivables/@:userName/:reservationPermlink?',
            ],
            exact: true,
            component: Views.PaymentCampaign,
          },
          {
            path: Path.MatchBotCampaign,
            exact: true,
            component: Views.MatchBotCampaign,
          },
          {
            path: [PATH_NAME_HISTORY, PATH_NAME_GUIDE_HISTORY, PATH_NAME_MESSAGES],
            exact: true,
            component: Views.HistoryCampaign,
          },
          {
            path: '/rewards/blacklist/:listType?',
            exact: true,
            component: Views.BlacklistCampaign,
          },
          {
            path: [
              '/rewards/details/:campaignId',
              '/rewards/createDuplicate/:campaignId',
              PATH_NAME_CREATE,
            ],
            exact: true,
            component: Views.CreateRewardForm,
          },
          {
            path: '/rewards/:filterKey/:campaignParent?',
            exact: true,
            component: Views.RewardsComponent,
          },
        ],
      },
      {
        path: [
          '/@:name/(comments|followers|following|reblogs|transfers|activity|expertise|about)?',
          '/@:name/transfers/table',
        ],
        component: Views.User,
        exact: true,
        routes: [
          {
            path: '/@:name',
            exact: true,
            component: Views.UserProfile,
          },
          {
            path: '/@:name/comments',
            exact: true,
            component: Views.UserComments,
          },
          {
            path: '/@:name/followers',
            exact: true,
            component: Views.UserFollowers,
          },
          {
            path: '/@:name/following',
            exact: true,
            component: Views.UserFollowing,
          },
          {
            path: '/@:name/reblogs',
            exact: true,
            component: Views.UserReblogs,
          },
          {
            path: '/@:name/transfers',
            exact: true,
            component: Views.UserWallet,
          },
          {
            path: '/@:name/activity',
            exact: true,
            component: Views.UserActivity,
          },
          {
            path: '/@:name/expertise',
            exact: true,
            component: Views.UserExpertise,
          },
          {
            path: '/@:name/about',
            exact: true,
            component: Views.UserInfo,
          },
        ],
      },
      {
        path: `/object/:name/(${URL.WOBJ.params[0]})?/(${URL.WOBJ.params[1]})?/:itemId?`,
        component: Views.Wobj,
        exact: true,
        routes: [
          {
            path: '/object/:name',
            exact: true,
            component: Views.ObjectPageFeed,
          },
          {
            path: `/object/:name/${URL.SEGMENT.ABOUT}`,
            exact: true,
            component: Views.ObjectAbout,
          },
          {
            path: `/object/:name/${URL.SEGMENT.FOLLOWERS}`,
            exact: true,
            component: Views.WobjFollowers,
          },
          {
            path: `/object/:name/${URL.SEGMENT.GALLERY}`,
            exact: true,
            component: Views.ObjectGallery,
          },
          {
            path: `/object/:name/${URL.SEGMENT.EXPERTISE}`,
            exact: true,
            component: Views.WobjExpertise,
          },
          {
            path: `/object/:name/${URL.SEGMENT.GALLERY}/${URL.SEGMENT.ALBUM}/:itemId`,
            exact: true,
            component: Views.ObjectGalleryAlbum,
          },
          {
            path: `/object/:name/${URL.SEGMENT.UPDATES}/(${URL.WOBJ.params[1]})?`,
            exact: true,
            component: Views.WobjHistory,
          },
          {
            path: `/object/:name/(${URL.SEGMENT.LIST}|${URL.SEGMENT.MENU})`,
            exact: true,
            component: Views.CatalogWrap,
          },
          {
            path: `/object/:name/(${URL.SEGMENT.PAGE})`,
            exact: true,
            component: Views.ObjectOfTypePage,
          },
        ],
      },
      {
        path: '/:sortBy(trending|created|hot|promoted|feed|blog|notifications-list)?/:category?',
        component: Page,
        exact: true,
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
  },
];

export default routes;
