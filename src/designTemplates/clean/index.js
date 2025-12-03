import ClearHeaderButton from '../../client/components/HeaderButton/CleanHeaderButton/ClearHeaderButton';
import ClearHeader from '../../client/social-gifts/Header/CleanHeader/ClearHeader';
import CleanListHero from './components/ListHero';
import CleanChecklistLayout from '../../client/social-gifts/Checklist/layouts/CleanChecklistLayout';
import CleanShopObjectCardView from '../../client/social-gifts/ShopObjectCard/views/CleanShopObjectCardView';
import CleanSocialProductView from '../../client/social-gifts/SocialProduct/views/CleanSocialProductView';
import CleanBusinessObjectView from '../../client/social-gifts/BusinessObject/views/CleanBusinessObjectView';
import CleanSocialLinksView from '../../client/components/SocialLinks/views/CleanSocialLinksView';
import CleanWalletAddressView from '../../client/app/Sidebar/WalletAddress/views/CleanWalletAddressView';
import CleanSocialMenuItemView from '../../client/social-gifts/SocialProduct/SocialMenuItems/views/CleanSocialMenuItemView';
import CleanSocialCampaignCardView from '../../client/social-gifts/ShopObjectCard/ProductRewardCard/views/CleanSocialCampaignCardView';

const cleanTemplate = {
  meta: {
    id: 'clean',
    label: 'Clean Waivio Theme',
    fonts: {
      heading: 'PlayfairDisplay, serif',
      body: 'PlayfairDisplay, serif',
      serif: 'PlayfairDisplay, serif',
    },
  },
  components: {
    Header: ClearHeader,
    HeaderButtons: ClearHeaderButton,
    ListHero: CleanListHero,
    ChecklistLayout: CleanChecklistLayout,
    ShopObjectCardView: CleanShopObjectCardView,
    SocialProductView: CleanSocialProductView,
    BusinessObjectView: CleanBusinessObjectView,
    SocialLinksView: CleanSocialLinksView,
    WalletAddressView: CleanWalletAddressView,
    SocialMenuItemView: CleanSocialMenuItemView,
    SocialCampaignCardView: CleanSocialCampaignCardView,
  },
};

export default cleanTemplate;
