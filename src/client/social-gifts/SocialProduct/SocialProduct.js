import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
// eslint-disable-next-line import/no-extraneous-dependencies
import ImageGallery from 'react-image-gallery';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { remove, orderBy, get, isEmpty } from 'lodash';
import {
  getObject,
  getObjectsRewards,
  getRelatedPhotos,
  getWobjectGallery,
} from '../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getUsedLocale } from '../../../store/appStore/appSelectors';
import RatingsWrap from '../../objectCard/RatingsWrap/RatingsWrap';
import Options from '../../object/Options/Options';
import { getActiveCategory, getActiveOption } from '../../../store/optionsStore/optionsSelectors';
import { setStoreActiveOption } from '../../../store/optionsStore/optionsActions';
import './SocialProduct.less';
import AffiliatLink from '../../widgets/AffiliatLinks/AffiliatLink';
import { isMobile } from '../../../common/helpers/apiHelpers';
import ProductRewardCard from '../ShopObjectCard/ProductRewardCard/ProductRewardCard';

const SocialProduct = () => {
  const [wobject, setWobject] = useState({});
  const [allAlbums, setAllAlbums] = useState([]);
  const [reward, setReward] = useState([]);
  const [hoveredOption, setHoveredOption] = useState({});
  const [carouselRef, setCarouselRef] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [relatedAlbum, setRelatedAlbum] = useState({});
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const userName = useSelector(getAuthenticatedUserName);
  const locale = useSelector(getUsedLocale);
  const activeOption = useSelector(getActiveOption);
  const activeCategory = useSelector(getActiveCategory);
  const authorPermlink = match.params.name;
  const affiliateLinks = wobject?.affiliateLinks || [];
  const price = hoveredOption.price || get(wobject, 'price');
  const allPhotos = allAlbums?.flatMap(alb => alb.items.flat());
  const photoAlbum = allPhotos?.sort((a, b) => (b.name === 'avatar') - (a.name === 'avatar'));
  const pictures = [...photoAlbum, ...get(relatedAlbum, 'items', [])].map(pic => ({
    ...pic,
    original: pic.body,
    thumbnail: pic.body,
  }));
  let items = pictures;

  if (hoveredOption?.avatar || activeOption[activeCategory]?.avatar) {
    items = [
      { ...hoveredOption, original: hoveredOption.avatar } || {
        ...activeOption[activeCategory],
        original: activeOption[activeCategory]?.avatar,
      },
      ...pictures,
    ];
  }

  const handleGalleryImageClick = () => {
    carouselRef.fullScreen();
  };

  useEffect(() => {
    if (!isEmpty(authorPermlink)) {
      getObject(authorPermlink, userName, locale).then(obj => setWobject(obj));
      getWobjectGallery(authorPermlink, locale).then(albums => {
        const defaultAlbum = remove(albums, alb => alb.id === authorPermlink);
        const sortedAlbums = orderBy(albums, ['weight'], ['desc']);

        return setAllAlbums([...defaultAlbum, ...sortedAlbums]);
      });
      getRelatedPhotos(authorPermlink, 30, 0).then(alb => setRelatedAlbum(alb));
      getObjectsRewards(authorPermlink, userName).then(res => setReward(res));
    }

    return () => dispatch(setStoreActiveOption({}));
  }, [authorPermlink]);

  return (
    <div className="SocialProduct">
      <div className="SocialProduct__column SocialProduct__column-wrapper">
        <div className="SocialProduct__row">
          {isMobile() && <div className="SocialProduct__wobjName">{wobject.name}</div>}
          <div className="SocialProduct__carouselWrapper">
            {!isEmpty(items) && (
              <ImageGallery
                ref={ref => setCarouselRef(ref)}
                onScreenChange={val => setIsFullScreen(val)}
                items={items}
                showFullscreenButton={isFullScreen}
                thumbnailPosition="left"
                onClick={handleGalleryImageClick}
                additionalClass={!isFullScreen ? 'SocialProduct__imageGallery' : ''}
              />
            )}
          </div>
          <div>
            <ProductRewardCard reward={reward} />
          </div>
        </div>
        <div className="SocialProduct__row SocialProduct__right-row">
          {!isMobile() && <div className="SocialProduct__wobjName">{wobject.name}</div>}
          <div className="SocialProduct__ratings">
            {' '}
            {!isEmpty(wobject.rating) && (
              <RatingsWrap
                ratings={[wobject.rating[0]]}
                username={userName}
                wobjId={wobject.author_permlink}
                wobjName={wobject.name}
              />
            )}
          </div>
          <div className="SocialProduct__price">{price}</div>
          <div className="SocialProduct__paddingBottom">
            {!isEmpty(wobject?.options) && (
              <Options
                setHoveredOption={option => setHoveredOption(option)}
                isEditMode={false}
                wobject={wobject}
              />
            )}
          </div>
          <div className="SocialProduct__paddingBottom">
            {!isEmpty(affiliateLinks) && (
              <>
                <p>
                  {' '}
                  <FormattedMessage id="buy_it_on" defaultMessage="Buy it on" />:
                </p>
                <div className="SocialProduct__affLinks">
                  {affiliateLinks.map(link => (
                    <div key={link.link} className="SocialProduct__links">
                      <AffiliatLink link={link} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="SocialProduct__column"> lalalalalalalalala lalalalalala lalalalalaalal</div>
    </div>
  );
};

export default SocialProduct;
