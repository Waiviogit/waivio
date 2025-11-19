import ClassicHeaderButton from '../client/components/HeaderButton/ClassicHeaderButton';
import ClassicHeader from '../client/social-gifts/Header/ClassicHeader';

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
  },
};

export default classicTemplate;
