import Loadable from 'react-loadable';
import Loading from '../client/components/Icon/Loading';

const loableComponent = component =>
  Loadable({
    loader: () => component,
    loading: Loading,
  });

export default {
  Bookmarks: loableComponent(import('../client/bookmarks/Bookmarks')),
  FollowingUserRewards: loableComponent(
    import('../client/newRewards/RewardLists/FollowingUserRewards'),
  ),
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
  Drafts: loableComponent(import('../client/post/Write/Drafts')),
  WebsitesWrapper: loableComponent(
    import('../client/settings/AdminPage/AdminWebsites/WebsitesWrapper'),
  ),
  AdminWhitelist: loableComponent(
    import('../client/settings/AdminPage/AdminWhitelist/AdminWhitelist'),
  ),
  AdminNewAccounts: loableComponent(import('../client/settings/AdminPage/AdminNewAccounts')),
  AdminGuests: loableComponent(import('../client/settings/AdminPage/AdminGuests/AdminGuests')),
  AdminSpam: loableComponent(import('../client/settings/AdminPage/AdminSpam/AdminSpam')),
  Replies: loableComponent(import('../client/replies/Replies')),
  Activity: loableComponent(import('../client/activity/Activity')),
  Editor: loableComponent(import('../client/post/EditPost/EditorContainer')),
  Settings: loableComponent(import('../client/settings/Settings')),
  GuestsSettings: loableComponent(import('../client/settings/GuestsSettings')),
  WebsiteSettings: loableComponent(import('../client/settings/WebsiteSettings')),
  NotificationSettings: loableComponent(import('../client/settings/NotificationSettings')),
  ProfileSettings: loableComponent(import('../client/settings/ProfileSettings')),
  SettingsMain: loableComponent(import('../client/settings/SettingsMain')),
  Invite: loableComponent(import('../client/invite/Invite')),
  UserProfile: loableComponent(import('../client/user/UserProfile')),
  PostsCommentsActivity: loableComponent(
    import('../client/user/PostsCommentsActivity/PostsCommentsActivity'),
  ),
  UserComments: loableComponent(import('../client/user/UserComments')),
  UserReblogs: loableComponent(import('../client/user/UserReblogs')),
  UserWallet: loableComponent(import('../client/wallet/Wallets')),
  WalletTable: loableComponent(import('../client/wallet/WalletTable/BothWalletTable')),
  DetailsTable: loableComponent(import('../client/wallet/WalletTable/DetailsTable')),
  WalletTableSwitcher: loableComponent(import('../client/wallet/WalletTable/WalletTableSwitcher')),
  UserActivity: loableComponent(import('../client/activity/UserActivity')),
  Discover: loableComponent(import('../client/discover/Discover')),
  Objects: loableComponent(import('../client/objects/Objects')),
  Notifications: loableComponent(import('../client/notifications/Notifications')),
  SocialNotifications: loableComponent(
    import('../client/notifications/SocialNotifications/SocialNotifications'),
  ),
  Error404: loableComponent(import('../client/statics/Error404')),
  ExitPage: loableComponent(import('../client/statics/ExitPage')),
  ObjectPageFeed: loableComponent(import('../client/object/ObjectFeed')),
  ObjectFeed: loableComponent(import('../client/object/ObjectFeed')),
  WobjFollowers: loableComponent(import('../client/object/WobjFollowers')),
  ObjectGallery: loableComponent(import('../client/object/ObjectGallery/ObjectGallery')),
  ObjectGalleryAlbum: loableComponent(import('../client/object/ObjectGallery/ObjectGalleryAlbum')),
  WobjHistory: loableComponent(import('../client/object/WobjHistory/UpdateHistory')),
  ObjectAbout: loableComponent(import('../client/object/ObjectAbout')),
  ObjectReviewsAndThreads: loableComponent(
    import('../client/object/ObjectReviewsAndThreads/ObjectReviewsAndThreads'),
  ),
  WobjSwitcherPage: loableComponent(import('../client/object/WobjSwitcherPage/WobjSwitcherPage')),
  CatalogWrap: loableComponent(import('../client/object/Catalog/CatalogWrap')),
  WobjExpertise: loableComponent(import('../client/object/WobjExpertise')),
  UserExpertise: loableComponent(import('../client/user/UserExpertise')),
  DiscoverObjects: loableComponent(import('../client/discoverObjects/DiscoverObjects')),
  Reports: loableComponent(import('../client/rewards/Reports/Reports')),
  ObjectOfTypePage: loableComponent(import('../client/object/ObjectOfTypePage/ObjectOfTypePage')),
  ObjectOfTypeMap: loableComponent(import('../client/object/ObjectOfTypeMap/ObjectOfTypeMap')),
  ObjectOfTypeWebpage: loableComponent(
    import('../client/object/ObjectOfTypeWebpage/ObjectOfTypeWebpage'),
  ),
  SubFeed: loableComponent(import('../client/feed/SubFeed')),
  UserInfo: loableComponent(import('../client/app/Sidebar/UserInfo/UserInfo')),
  ConfirmationModal: loableComponent(import('../client/widgets/ConfirmationModal')),
  CreateWebsite: loableComponent(import('../client/websites/WebsiteTools/Create/CreatePage')),
  ManageWebsite: loableComponent(import('../client/websites/WebsiteTools/Manage/ManageWebsite')),
  ReportsWebsite: loableComponent(import('../client/websites/WebsiteTools/Reports/Reports')),
  SwitchConfigPage: loableComponent(
    import('../client/websites/WebsiteTools/Configuration/SwitchConfigPage'),
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
  WebsitesTrusties: loableComponent(
    import('../client/websites/WebsiteTools/Trusties/WebsitesTrusties'),
  ),
  WebsitesShopify: loableComponent(import('../client/websites/WebsiteTools/Shopify/Shopify')),
  AffiliateCodes: loableComponent(
    import('../client/websites/WebsiteTools/AffiliateCodes/AffiliateCodes'),
  ),
  AdSenseAds: loableComponent(import('../client/websites/WebsiteTools/AdSenseAds/AdSenseAds')),
  UserAffiliateCodes: loableComponent(
    import('../client/websites/WebsiteTools/AffiliateCodes/UserAffiliateCodes'),
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
  DescriptionPage: loableComponent(import('../client/object/Description/DescriptionPage')),
  RelatedPage: loableComponent(import('../client/object/RightSidebarPages/RelatedPage')),
  AddOnPage: loableComponent(import('../client/object/RightSidebarPages/AddOnPage')),
  FeaturedPage: loableComponent(import('../client/object/RightSidebarPages/FeaturedPage')),
  SimilarPage: loableComponent(import('../client/object/RightSidebarPages/SimilarPage')),
  WobjProductsPage: loableComponent(import('../client/object/RightSidebarPages/WobjReferencePage')),
  OptionsPage: loableComponent(import('../client/object/Options/OptionsPage')),
  GroupIdPage: loableComponent(import('../client/object/GroupId/GroupIdPage')),
  DepartmentsPage: loableComponent(import('../client/object/DepartmentsPage/DepartmentsPage')),
  WobjSearchPage: loableComponent(import('../client/object/WobjSearchPage/WobjSearchPage')),
  WebsiteSignIn: loableComponent(import(`../client/websites/WebsiteSignIn/WebsiteSignIn`)),
  VipTicketsSetting: loableComponent(import(`../client/settings/Viptickets/VipTicketsSetting`)),
  MatchBotsAuthors: loableComponent(import('../client/rewards/MatchBots/MatchBotsAuthors')),
  MatchBotsCurators: loableComponent(import('../client/rewards/MatchBots/MatchBotsCurators')),
  MatchBotsSponsors: loableComponent(import('../client/rewards/MatchBotSponsors')),
  DataImport: loableComponent(import('../client/components/DataImport/DataImport')),
  MessageBot: loableComponent(import('../client/components/MessageBot/MessageBot')),
  RepostingBot: loableComponent(import('../client/components/RepostingBot/RepostingBot')),
  DuplicateList: loableComponent(
    import('../client/components/DataImport/DuplicateList/DuplicateList'),
  ),
  ProductExtension: loableComponent(
    import('../client/components/DataImport/ChromeExtension/ChromeExtension'),
  ),
  ClaimAthorityBot: loableComponent(
    import('../client/components/ClaimAthorityBot/ClaimAthorityBot'),
  ),
  DepartmentsBot: loableComponent(import('../client/components/DepartmentsBot/DepartmentsBot')),
  TagsBot: loableComponent(import('../client/components/TagsBot/TagsBot')),
  DescriptionsBot: loableComponent(import('../client/components/DescriptionsBot/DescriptionsBot')),
};
