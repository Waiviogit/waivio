import Loadable from 'react-loadable';
import Loading from '../../client/components/Icon/Loading';

const loableComponent = component =>
  Loadable({
    loader: () => component,
    loading: Loading,
  });

export default {
  Bookmarks: loableComponent(import('../../client/bookmarks/Bookmarks')),
  Drafts: loableComponent(import('../../client/post/Write/Drafts')),
  Replies: loableComponent(import('../../client/replies/Replies')),
  Activity: loableComponent(import('../../client/activity/Activity')),
  Wallet: loableComponent(import('../../client/wallet/Wallet')),
  BusyEditor: loableComponent(import('../../client/post/Write/Write')),
  Editor: loableComponent(import('../../client/post/EditPost/EditPost')),
  Settings: loableComponent(import('../../client/settings/Settings')),
  GuestsSettings: loableComponent(import('../../client/settings/GuestsSettings')),
  WebsiteSettings: loableComponent(import('../../client/settings/WebsiteSettings')),
  NotificationSettings: loableComponent(import('../../client/settings/NotificationSettings')),
  ProfileSettings: loableComponent(import('../../client/settings/ProfileSettings')),
  SettingsMain: loableComponent(import('../../client/settings/SettingsMain')),
  Invite: loableComponent(import('../../client/invite/Invite')),
  User: loableComponent(import('../../client/user/User')),
  Wobj: loableComponent(import('../../client/object/Wobj/WobjectContainer')),
  UserProfile: loableComponent(import('../../client/user/UserProfile')),
  UserComments: loableComponent(import('../../client/user/UserComments')),
  UserFollowers: loableComponent(import('../../client/user/UserFollowers')),
  UserFollowing: loableComponent(import('../../client/user/UserFollowing')),
  UserReblogs: loableComponent(import('../../client/user/UserReblogs')),
  UserWallet: loableComponent(import('../../client/user/UserWallet')),
  WalletTable: loableComponent(import('../../client/wallet/WalletTable/WalletTableContainer')),
  UserActivity: loableComponent(import('../../client/activity/UserActivity')),
  Discover: loableComponent(import('../../client/discover/Discover')),
  Objects: loableComponent(import('../../client/objects/Objects')),
  Search: loableComponent(import('../../client/search/Search')),
  Notifications: loableComponent(import('../../client/notifications/Notifications')),
  RewardsList: loableComponent(import('../../client/rewards/RewardsList/RewardsList')),
  Error404: loableComponent(import('../../client/statics/Error404')),
  ExitPage: loableComponent(import('../../client/statics/ExitPage')),
  ObjectPageFeed: loableComponent(import('../../client/object/ObjectFeed')),
  ObjectFeed: loableComponent(import('../../client/object/ObjectFeed')),
  WobjFollowers: loableComponent(import('../../client/object/WobjFollowers')),
  ObjectGallery: loableComponent(import('../../client/object/ObjectGallery/ObjectGallery')),
  ObjectGalleryAlbum: loableComponent(
    import('../../client/object/ObjectGallery/ObjectGalleryAlbum'),
  ),
  WobjHistory: loableComponent(import('../../client/object/WobjHistory')),
  ObjectAbout: loableComponent(import('../../client/object/ObjectAbout')),
  CatalogWrap: loableComponent(import('../../client/object/Catalog/CatalogWrap')),
  WobjExpertise: loableComponent(import('../../client/object/WobjExpertise')),
  UserExpertise: loableComponent(import('../../client/user/UserExpertise')),
  DiscoverObjects: loableComponent(import('../../client/discoverObjects/DiscoverObjects')),
  Rewards: loableComponent(import('../../client/rewards/Rewards')),
  CreateRewardForm: loableComponent(import('../../client/rewards/Create-Edit/CreateRewardForm')),
  ManageCampaign: loableComponent(import('../../client/rewards/Manage/Manage')),
  MatchBotCampaign: loableComponent(import('../../client/rewards/MatchBot/MatchBot')),
  ReceivablesCampaign: loableComponent(import('../../client/rewards/Receivables/Receivables')),
  PayablesCampaign: loableComponent(import('../../client/rewards/Payables/Payables')),
  BlacklistCampaign: loableComponent(import('../../client/rewards/Blacklist/Blacklist')),
  Reports: loableComponent(import('../../client/rewards/Reports/Reports')),
  PaymentCampaign: loableComponent(import('../../client/rewards/Payment/Payment')),
  ObjectOfTypePage: loableComponent(
    import('../../client/object/ObjectOfTypePage/ObjectOfTypePage'),
  ),
  SubFeed: loableComponent(import('../../client/feed/SubFeed')),
  UserInfo: loableComponent(import('../../client/app/Sidebar/UserInfo')),
  ConfirmationModal: loableComponent(import('../../client/widgets/ConfirmationModal')),
  RewardsComponent: loableComponent(
    import('../../client/rewards/RewardsComponent/RewardsComponent'),
  ),
  HistoryCampaign: loableComponent(import('../../client/rewards/History/History')),
  CreateWebsite: loableComponent(import('../../client/websites/WebsiteTools/Create/CreateWebsite')),
  ManageWebsite: loableComponent(import('../../client/websites/WebsiteTools/Manage/ManageWebsite')),
  ReportsWebsite: loableComponent(
    import('../../client/websites/WebsiteTools/Reports/ReportsWebsite'),
  ),
  WebsitesConfigurations: loableComponent(
    import('../../client/websites/WebsiteTools/Configuration/WebsitesConfigurations'),
  ),
  FraudDetection: loableComponent(import('../../client/rewards/FraudDetection/FraudDetection')),
  ReferralDetails: loableComponent(
    import('../../client/rewards/ReferralProgram/Details/ReferralDetails'),
  ),
  ReferralInstructions: loableComponent(
    import('../../client/rewards/ReferralProgram/Instructions/ReferralsInstructions'),
  ),
  ReferralStatus: loableComponent(
    import('../../client/rewards/ReferralProgram/Status/ReferralStatus'),
  ),
  SponsoredRewards: loableComponent(
    import('../../client/rewards/ReferralProgram/SponsoredRewards/SponsoredRewards'),
  ),
  WebsitesAdministrators: loableComponent(
    import('../../client/websites/WebsiteTools/Administrators/Administrators'),
  ),
  WebsiteModerators: loableComponent(
    import('../../client/websites/WebsiteTools/Moderators/WebsiteModerators'),
  ),
  WebsitesAuthorities: loableComponent(
    import('../../client/websites/WebsiteTools/Authorities/WebsitesAuthorities'),
  ),
  WebsitesSettings: loableComponent(
    import('../../client/websites/WebsiteTools/Settings/WebsitesSettings'),
  ),
  WebsiteObjectFilters: loableComponent(
    import('../../client/websites/WebsiteTools/ObjectsFilters/WebsiteObjectFilters'),
  ),
  WebsiteObjects: loableComponent(
    import('../../client/websites/WebsiteTools/Objects/WebsiteObjects'),
  ),
  WebsiteRestrictions: loableComponent(
    import('../../client/websites/WebsiteTools/Restrictions/WebsiteRestrictions'),
  ),
  MainBody: loableComponent(import('../../client/components/LayoutComponents/MainBody')),
};
