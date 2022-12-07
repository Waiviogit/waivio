import Loadable from 'react-loadable';
import Loading from '../client/components/Icon/Loading';

const loableComponent = component =>
  Loadable({
    loader: () => component,
    loading: Loading,
  });

export default {
  Bookmarks: loableComponent(import('../client/bookmarks/Bookmarks')),
  ReservedProposition: loableComponent(
    import('../client/newRewards/PropositionLists/ReservedProposition'),
  ),
  Payables: loableComponent(import('../client/newRewards/Debts/Paybles')),
  BlackList: loableComponent(import('../client/newRewards/BlackList/BlackList')),
  ReportsNew: loableComponent(import('../client/newRewards/Reports/Reports')),
  SponsorsMatchBots: loableComponent(
    import('../client/newRewards/SponsorsMatchBots/SponsorsMatchBots'),
  ),
  Receivables: loableComponent(import('../client/newRewards/Debts/Receivables')),
  ReceivablesListByUser: loableComponent(
    import('../client/newRewards/Debts/ReceivablesListByUser'),
  ),
  PayblesListByUser: loableComponent(import('../client/newRewards/Debts/PayblesListByUser')),
  EligibleRewards: loableComponent(import('../client/newRewards/RewardLists/EligibleRewards')),
  AllProposition: loableComponent(import('../client/newRewards/PropositionLists/AllPropositions')),
  MessageList: loableComponent(import('../client/newRewards/PropositionLists/MessageList')),
  FraudDetectionNew: loableComponent(
    import('../client/newRewards/PropositionLists/FraudDetection'),
  ),
  ReservationsProposition: loableComponent(
    import('../client/newRewards/PropositionLists/ReservationsProposition'),
  ),
  HistoryPropositions: loableComponent(
    import('../client/newRewards/PropositionLists/HistoryPropositions'),
  ),
  EligibleProposition: loableComponent(
    import('../client/newRewards/PropositionLists/EligibleProposition'),
  ),
  CreateRewards: loableComponent(import('../client/newRewards/CreateRewards/CreateRewards')),
  RewardsManage: loableComponent(
    import('../client/newRewards/ManageCampaingsTab/ManageCampaingsTab'),
  ),
  RewardsAll: loableComponent(import('../client/newRewards/RewardLists/RewardsAll')),
  Drafts: loableComponent(import('../client/post/Write/Drafts')),
  Replies: loableComponent(import('../client/replies/Replies')),
  Activity: loableComponent(import('../client/activity/Activity')),
  Editor: loableComponent(import('../client/post/EditPost')),
  Settings: loableComponent(import('../client/settings/Settings')),
  GuestsSettings: loableComponent(import('../client/settings/GuestsSettings')),
  WebsiteSettings: loableComponent(import('../client/settings/WebsiteSettings')),
  NotificationSettings: loableComponent(import('../client/settings/NotificationSettings')),
  ProfileSettings: loableComponent(import('../client/settings/ProfileSettings')),
  SettingsMain: loableComponent(import('../client/settings/SettingsMain')),
  Invite: loableComponent(import('../client/invite/Invite')),
  UserProfile: loableComponent(import('../client/user/UserProfile')),
  PostsCommentsActivity: loableComponent(import('../client/user/PostsCommentsActivity')),
  UserComments: loableComponent(import('../client/user/UserComments')),
  UserFollowers: loableComponent(import('../client/user/UserFollowers')),
  UserFollowing: loableComponent(import('../client/user/UserFollowing')),
  UserReblogs: loableComponent(import('../client/user/UserReblogs')),
  UserWallet: loableComponent(import('../client/wallet/Wallets')),
  WalletTable: loableComponent(import('../client/wallet/WalletTable/WalletTable')),
  WAIVwalletTable: loableComponent(import('../client/wallet/WalletTable/WAIVwalletTable')),
  UserActivity: loableComponent(import('../client/activity/UserActivity')),
  Discover: loableComponent(import('../client/discover/Discover')),
  Objects: loableComponent(import('../client/objects/Objects')),
  Notifications: loableComponent(import('../client/notifications/Notifications')),
  Error404: loableComponent(import('../client/statics/Error404')),
  ExitPage: loableComponent(import('../client/statics/ExitPage')),
  ObjectPageFeed: loableComponent(import('../client/object/ObjectFeed')),
  ObjectFeed: loableComponent(import('../client/object/ObjectFeed')),
  WobjFollowers: loableComponent(import('../client/object/WobjFollowers')),
  ObjectGallery: loableComponent(import('../client/object/ObjectGallery/ObjectGallery')),
  ObjectGalleryAlbum: loableComponent(import('../client/object/ObjectGallery/ObjectGalleryAlbum')),
  WobjHistory: loableComponent(import('../client/object/WobjHistory/UpdateHistory')),
  ObjectAbout: loableComponent(import('../client/object/ObjectAbout')),
  CatalogWrap: loableComponent(import('../client/object/Catalog/CatalogWrap')),
  WobjExpertise: loableComponent(import('../client/object/WobjExpertise')),
  UserExpertise: loableComponent(import('../client/user/UserExpertise')),
  DiscoverObjects: loableComponent(import('../client/discoverObjects/DiscoverObjects')),
  Rewards: loableComponent(import('../client/rewards/Rewards')),
  Reports: loableComponent(import('../client/rewards/Reports/Reports')),
  ObjectOfTypePage: loableComponent(import('../client/object/ObjectOfTypePage/ObjectOfTypePage')),
  SubFeed: loableComponent(import('../client/feed/SubFeed')),
  UserInfo: loableComponent(import('../client/app/Sidebar/UserInfo/UserInfo')),
  ConfirmationModal: loableComponent(import('../client/widgets/ConfirmationModal')),
  CreateWebsite: loableComponent(import('../client/websites/WebsiteTools/Create/CreateWebsite')),
  ManageWebsite: loableComponent(import('../client/websites/WebsiteTools/Manage/ManageWebsite')),
  ReportsWebsite: loableComponent(import('../client/websites/WebsiteTools/Reports/ReportsWebsite')),
  WebsitesConfigurations: loableComponent(
    import('../client/websites/WebsiteTools/Configuration/WebsitesConfigurations'),
  ),
  ReferralDetails: loableComponent(
    import('../client/rewards/ReferralProgram/Details/ReferralDetails'),
  ),
  ReferralInstructions: loableComponent(
    import('../client/rewards/ReferralProgram/Instructions/ReferralsInstructions'),
  ),
  ReferralStatus: loableComponent(
    import('../client/rewards/ReferralProgram/Status/ReferralStatus'),
  ),
  WebsitesAdministrators: loableComponent(
    import('../client/websites/WebsiteTools/Administrators/Administrators'),
  ),
  WebsiteModerators: loableComponent(
    import('../client/websites/WebsiteTools/Moderators/WebsiteModerators'),
  ),
  WebsitesAuthorities: loableComponent(
    import('../client/websites/WebsiteTools/Authorities/WebsitesAuthorities'),
  ),
  WebsitesSettings: loableComponent(
    import('../client/websites/WebsiteTools/Settings/WebsitesSettings'),
  ),
  WebsiteObjectFilters: loableComponent(
    import('../client/websites/WebsiteTools/ObjectsFilters/WebsiteObjectFilters'),
  ),
  WebsiteObjects: loableComponent(import('../client/websites/WebsiteTools/Objects/WebsiteObjects')),
  WebsiteRestrictions: loableComponent(
    import('../client/websites/WebsiteTools/Restrictions/WebsiteRestrictions'),
  ),
  WebsiteBody: loableComponent(
    import('../client/websites/WebsiteLayoutComponents/Body/WebsiteBody'),
  ),
  FormPage: loableComponent(import('../client/object/FormPage/FormPage')),
  WidgetPage: loableComponent(import('../client/object/WidgetPage/WidgetPage')),
  WebsiteSignIn: loableComponent(import(`../client/websites/WebsiteSignIn/WebsiteSignIn`)),
  VipTicketsSetting: loableComponent(import(`../client/settings/Viptickets/VipTicketsSetting`)),
  MatchBotsAuthors: loableComponent(import('../client/rewards/MatchBots/MatchBotsAuthors')),
  MatchBotsCurators: loableComponent(import('../client/rewards/MatchBots/MatchBotsCurators')),
  MatchBotsSponsors: loableComponent(import('../client/rewards/MatchBotSponsors')),
  DataImport: loableComponent(import('../client/components/DataImport/DataImport')),
};
