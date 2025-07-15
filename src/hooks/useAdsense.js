import { useSelector } from 'react-redux';
import { getSettingsAds } from '../store/websiteStore/websiteSelectors';
import { adIntensityLevels } from '../client/websites/WebsiteTools/AdSenseAds/AdSenseAds';

const useAdLevelData = () => {
  const settings = useSelector(getSettingsAds);
  const level = settings?.level || '';
  const frequency = adIntensityLevels.find(l => l.key === level)?.frequency ?? null;

  return {
    minimal: level === 'minimal',
    moderate: level === 'moderate',
    intensive: level === 'intensive',
    frequency,
  };
};

export default useAdLevelData;
