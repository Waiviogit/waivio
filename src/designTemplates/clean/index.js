import ClearHeaderButton from '../../client/components/HeaderButton/CleanHeaderButton/ClearHeaderButton';
import ClearHeader from '../../client/social-gifts/Header/CleanHeader/ClearHeader';
import CleanListHero from './components/ListHero';

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
  },
};

export default cleanTemplate;
