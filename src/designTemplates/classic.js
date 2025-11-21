import ClassicHeaderButton from '../client/components/HeaderButton/ClassicHeaderButton';
import ClassicHeader from '../client/social-gifts/Header/ClassicHeader';
import ClassicChecklistLayout from '../client/social-gifts/Checklist/layouts/ClassicChecklistLayout';
import ClassicShopObjectCardView from '../client/social-gifts/ShopObjectCard/views/ClassicShopObjectCardView';

const classicTemplate = {
  meta: {
    id: 'classic',
    label: 'Classic Waivio Theme',
    fonts: {
      heading: 'Whitney, "Source Sans Pro", sans-serif',
      body: 'Whitney, "Source Sans Pro", sans-serif',
      serif: 'PlayfairDisplay, serif',
    },
  },
  components: {
    Header: ClassicHeader,
    HeaderButtons: ClassicHeaderButton,
    ListHero: undefined,
    ChecklistLayout: ClassicChecklistLayout,
    ShopObjectCardView: ClassicShopObjectCardView,
  },
};

export default classicTemplate;
