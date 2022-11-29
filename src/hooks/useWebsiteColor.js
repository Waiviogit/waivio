import { useSelector } from 'react-redux';
import { getWebsiteColors } from '../store/appStore/appSelectors';
import { initialColors } from '../client/websites/constants/colors';

const useWebsiteColor = () => {
  const colors = useSelector(getWebsiteColors);
  const background = colors?.mapMarkerBody || initialColors.marker;
  const color = colors?.mapMarkerText || initialColors.text;

  return {
    color,
    background,
  };
};

export default useWebsiteColor;
