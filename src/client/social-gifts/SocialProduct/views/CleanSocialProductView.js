import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { isEmpty, isNil } from 'lodash';
import { isMobile } from '../../../../common/helpers/apiHelpers';
import ProductRewardCard from '../../ShopObjectCard/ProductRewardCard/ProductRewardCard';
import Options from '../../../object/Options/Options';
import ObjectFeatures from '../../../object/ObjectFeatures/ObjectFeatures';
import RatingsWrap from '../../../objectCard/RatingsWrap/RatingsWrap';
import PicturesSlider from '../PicturesSlider/PicturesSlider';
import ProductDetails from '../ProductDetails/ProductDetails';
import SocialTagCategories from '../SocialTagCategories/SocialTagCategories';
import ObjectsSlider from '../ObjectsSlider/ObjectsSlider';
import SocialMenuItems from '../SocialMenuItems/SocialMenuItems';
import SocialProductActions from '../SocialProductActions/SocialProductActions';
import SocialProductReviews from '../SocialProductReviews/SocialProductReviews';
import SocialProductDescription from '../SocialProductDescription/SocialProductDescription';
import SocialBookAuthors from '../SocialBookAuthors/SocialBookAuthors';
import SocialListItem from '../SocialListItem/SocialListItem';
import RecipeDetails from '../RecipeDetails/RecipeDetails';
import RecipePost from '../RecipePost/RecipePost';
import Breadcrumbs from '../../Breadcrumbs/Breadcrumbs';
import EarnsCommissionsOnPurchases from '../../../statics/EarnsCommissionsOnPurchases';
import InstacartWidget from '../../../widgets/InstacartWidget';
import { objectFields } from '../../../../common/constants/listOfFields';
import GoogleAds from '../../../adsenseAds/GoogleAds';

import '../SocialProduct.clean.less';

const CleanSocialProductView = ({
  history,
  wobject,
  isRecipe,
  productAuthors,
  wobjTitle,
  currBrand,
  authenticated,
  userName,
  toggleViewEditMode,
  isEditMode,
  showGallery,
  albums,
  description,
  hoveredOption,
  activeOption,
  activeCategory,
  reward,
  showPostModal,
  brand,
  compareAtPrice,
  price,
  sale,
  instacardAff,
  isOldInstacartProgram,
  isNewInstacartProgram,
  showRecipeFields,
  departments,
  productIdBody,
  calories,
  nutrition,
  cookingTime,
  recipeIngredients,
  setHoveredOption,
  affiliateLinks,
  affiliatLinks,
  intensive,
  minimal,
  moderate,
  photosAlbum,
  recipePost,
  signature,
  menuItem,
  customSort,
  sortExclude,
  customVisibility,
  showProductDetails,
  setLinkSafety,
  website,
  locale,
  publisher,
  publisherObject,
  printLength,
  publicationDate,
  language,
  ageRange,
  groupId,
  productWeight,
  dimensions,
  manufacturerObject,
  merchantObject,
  parent,
  addOns,
  features,
  similarObjects,
  relatedObjects,
  references,
  tagCategoriesList,
  authors,
  intl,
}) => (
  <div className="SocialProductClean">
    {history.location.search && (
      <div className="SocialProduct__column SocialProduct__breadcrumbs-center">
        <Breadcrumbs inProduct />
      </div>
    )}
    <div className="SocialProduct__column SocialProduct__column-wrapper">
      {isMobile() && (
        <h1
          className={
            isEmpty(productAuthors) && isEmpty(wobjTitle) && isEmpty(currBrand)
              ? 'SocialProduct__wobjName'
              : 'SocialProduct__bookWobjName'
          }
        >
          {isRecipe ? <span itemProp="name">{wobject?.name}</span> : wobject?.name}
        </h1>
      )}
      {isMobile() && !isEmpty(currBrand) && (
        <div
          className={`SocialProduct__brand ${
            isEmpty(wobjTitle) ? 'SocialProduct__paddingBottom' : ''
          }`}
        >
          <SocialListItem fieldName={objectFields.brand} field={currBrand} showTitle={false} />
        </div>
      )}
      {isMobile() && !isEmpty(wobjTitle) && <div className="SocialProduct__title">{wobjTitle}</div>}
      {isMobile() && !isEmpty(productAuthors) && <SocialBookAuthors authors={productAuthors} />}
      {isMobile() && !isEmpty(wobject?.rating) && (
        <div className="SocialProduct__ratings">
          {wobject.rating.map(rating => (
            <div key={rating.permlink} className="SocialProduct__ratings-item">
              <RatingsWrap
                isSocialProduct
                ratings={[rating]}
                username={userName}
                wobjId={wobject?.author_permlink}
                wobjName={wobject?.name}
              />
            </div>
          ))}
        </div>
      )}
      {isMobile() && authenticated && !isEmpty(wobject) && (
        <div className="SocialProduct__socialActions">
          <SocialProductActions
            toggleViewEditMode={toggleViewEditMode}
            isEditMode={isEditMode}
            authenticated={authenticated}
          />
        </div>
      )}
      {showGallery && (
        <div className="SocialProduct__row">
          <div className="SocialProduct__carouselWrapper">
            <PicturesSlider
              albums={albums}
              altText={description}
              currentWobj={wobject}
              hoveredOption={hoveredOption}
              activeOption={activeOption}
              activeCategory={activeCategory}
              showSliderCount={4}
            />
          </div>
          <div className="SocialProduct__reward-wrap">
            <ProductRewardCard isSocialProduct reward={reward} />
          </div>
        </div>
      )}
      <div className="SocialProduct__row SocialProduct__right-row">
        {!isMobile() && (
          <h1
            className={
              isEmpty(productAuthors) && isEmpty(wobjTitle) && isEmpty(currBrand)
                ? 'SocialProduct__wobjName'
                : 'SocialProduct__bookWobjName'
            }
          >
            {!showPostModal && isRecipe ? (
              <span itemProp="name">{wobject?.name}</span>
            ) : (
              wobject?.name
            )}
          </h1>
        )}
        {!isMobile() && !isEmpty(brand) && (
          <div
            className={`SocialProduct__brand ${
              isEmpty(wobjTitle) ? 'SocialProduct__paddingBottom' : ''
            }`}
          >
            <SocialListItem fieldName={objectFields.brand} field={currBrand} showTitle={false} />
          </div>
        )}
        {!isMobile() && !isEmpty(wobjTitle) && (
          <div className="SocialProduct__title">{wobjTitle}</div>
        )}
        {!isMobile() && !isEmpty(productAuthors) && <SocialBookAuthors authors={productAuthors} />}
        {!isMobile() && authenticated && !isEmpty(wobject) && (
          <div className="SocialProduct__socialActions">
            <SocialProductActions
              currentWobj={wobject}
              toggleViewEditMode={toggleViewEditMode}
              isEditMode={isEditMode}
              authenticated={authenticated}
            />
          </div>
        )}
        {!isMobile() && !isEmpty(wobject?.rating) && (
          <div className="SocialProduct__ratings">
            {wobject.rating.map(rating => (
              <div key={rating.permlink} className="SocialProduct__ratings-item">
                <RatingsWrap
                  isSocialProduct
                  ratings={[rating]}
                  username={userName}
                  wobjId={wobject?.author_permlink}
                  wobjName={wobject?.name}
                />
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-row">
          {compareAtPrice && (
            <div
              className={
                // eslint-disable-next-line no-nested-ternary
                isNil(compareAtPrice) && !isEmpty(wobject?.options)
                  ? 'SocialProduct__price-no'
                  : price
                  ? 'SocialProduct__price--old'
                  : 'SocialProduct__price'
              }
            >
              {compareAtPrice}
            </div>
          )}
          <div
            className={
              // eslint-disable-next-line no-nested-ternary
              isNil(price) && !isEmpty(wobject?.options)
                ? 'SocialProduct__price-no'
                : sale
                ? 'SocialProduct__price--old'
                : 'SocialProduct__price'
            }
          >
            {price}
          </div>
          {sale && (
            <div>
              {' '}
              <span className={'SocialProduct__price'}>{sale}</span>{' '}
              <button className="SocialProduct__sale-button">Sale</button>
            </div>
          )}
        </div>
        {!showPostModal &&
          isRecipe &&
          instacardAff &&
          (isOldInstacartProgram(instacardAff) || isNewInstacartProgram(instacardAff)) && (
            <InstacartWidget
              isProduct
              className={'SocialProduct__instacard'}
              instacartAff={instacardAff}
              wobjPerm={wobject?.author_permlink}
              withDisclamer
              inlineFlex
              marginBottom={'5px'}
              isRecipe={isRecipe}
            />
          )}
        {showRecipeFields && isRecipe && (
          <RecipeDetails
            wobject={wobject}
            history={history}
            departments={departments}
            productIdBody={productIdBody}
            isEditMode={isEditMode}
            calories={calories}
            nutrition={nutrition}
            cookingTime={cookingTime}
            recipeIngredients={recipeIngredients}
          />
        )}
        {!isEmpty(wobject?.options) && (
          <div className="SocialProduct__paddingBottom">
            <Options
              isSocialProduct
              setHoveredOption={setHoveredOption}
              isEditMode={false}
              wobject={wobject}
            />
          </div>
        )}

        {!isEmpty(affiliateLinks) &&
          !affiliatLinks?.every(l => isNil(l)) &&
          !isOldInstacartProgram(instacardAff) &&
          !isNewInstacartProgram(instacardAff) &&
          !(affiliateLinks.length === 1 && instacardAff) && (
            <div className="SocialProduct__paddingBottom">
              <div className="SocialProduct__subtitle">
                <FormattedMessage id="buy_it_on" defaultMessage="Buy it on" />:
              </div>
              <div className="SocialProduct__affiliateContainer">{affiliatLinks}</div>
              <EarnsCommissionsOnPurchases align={'left'} />
            </div>
          )}
        {intensive && <GoogleAds limitWidth />}
        {isEmpty(wobject?.preview_gallery) && <ProductRewardCard isSocialProduct reward={reward} />}
      </div>
    </div>
    <div className="SocialProduct__column">
      {!isEmpty(wobject?.description) && (
        <div className="SocialProduct__aboutItem">
          <div className="SocialProduct__heading">
            {intl.formatMessage({ id: 'about', defaultMessage: 'About' })}
          </div>
          <SocialProductDescription
            objectType={wobject?.object_type}
            description={wobject?.description}
            pictures={photosAlbum.items}
            authorPermlink={wobject?.author_permlink}
          />
        </div>
      )}
      {(minimal || moderate || intensive) && <GoogleAds inList />}
      {recipePost && isRecipe && !showPostModal && (
        <div className={'SocialProduct__postWrapper PageContentClean'}>
          <RecipePost signature={signature} recipePost={recipePost} />
          <br />
        </div>
      )}
      {!isEmpty(menuItem) && (
        <SocialMenuItems
          customSort={customSort}
          sortExclude={sortExclude}
          menuItem={menuItem}
          customVisibility={customVisibility}
          isProduct
          wobject={wobject}
        />
      )}
      {showProductDetails && (
        <ProductDetails
          setLinkSafety={setLinkSafety}
          website={website}
          locale={locale}
          publisher={publisher}
          publisherObject={publisherObject}
          printLength={printLength}
          publicationDate={publicationDate}
          language={language}
          ageRange={ageRange}
          wobject={wobject}
          groupId={groupId}
          history={history}
          productWeight={productWeight}
          dimensions={dimensions}
          productIdBody={productIdBody}
          departments={departments}
          fields={{ manufacturerObject, merchantObject }}
          parent={parent}
        />
      )}
      {intensive && <GoogleAds inList />}
      <ObjectsSlider
        objects={addOns}
        title={intl.formatMessage({
          id: 'bought_together',
          defaultMessage: 'Bought together / Add-on',
        })}
        name={'addOn'}
      />
      {!isEmpty(features) && (
        <div className="SocialProduct__featuresContainer">
          <div className="SocialProduct__heading">
            {intl.formatMessage({ id: 'features', defaultMessage: 'Features' })}
          </div>
          <div className="SocialProduct__centralContent">
            <ObjectFeatures
              isSocialGifts
              features={features}
              isEditMode={false}
              wobjPermlink={wobject?.author_permlink}
            />
          </div>
        </div>
      )}
      <ObjectsSlider
        objects={similarObjects}
        title={intl.formatMessage({ id: 'object_field_similar', defaultMessage: 'Similar' })}
        name={'similar'}
      />
      <ObjectsSlider
        objects={relatedObjects}
        title={intl.formatMessage({ id: 'related_items', defaultMessage: 'Related items' })}
        name={'related'}
      />
      {!isEmpty(references) &&
        references?.map(ref => (
          <ObjectsSlider key={ref[0]} objects={ref[1]} title={`${ref[0]}s`} name={ref[0]} />
        ))}
      {!isEmpty(tagCategoriesList) && (
        <div className="SocialProduct__featuresContainer">
          <div className="SocialProduct__heading">
            {intl.formatMessage({ id: 'tags', defaultMessage: 'Tags' })}
          </div>
          <div className="SocialProduct__centralContent">
            <SocialTagCategories tagCategoriesList={tagCategoriesList} wobject={wobject} />
          </div>
        </div>
      )}
      {!isEmpty(wobject) && <SocialProductReviews wobject={wobject} authors={authors} />}
    </div>
  </div>
);

CleanSocialProductView.propTypes = {
  history: PropTypes.shape(),
  wobject: PropTypes.shape(),
  isRecipe: PropTypes.bool,
  productAuthors: PropTypes.arrayOf(PropTypes.shape()),
  wobjTitle: PropTypes.string,
  currBrand: PropTypes.shape(),
  authenticated: PropTypes.bool,
  userName: PropTypes.string,
  toggleViewEditMode: PropTypes.func,
  isEditMode: PropTypes.bool,
  showGallery: PropTypes.bool,
  albums: PropTypes.arrayOf(PropTypes.shape()),
  description: PropTypes.string,
  hoveredOption: PropTypes.shape(),
  activeOption: PropTypes.shape(),
  activeCategory: PropTypes.string,
  reward: PropTypes.arrayOf(PropTypes.shape()),
  showPostModal: PropTypes.bool,
  brand: PropTypes.shape(),
  compareAtPrice: PropTypes.string,
  price: PropTypes.string,
  sale: PropTypes.string,
  instacardAff: PropTypes.shape(),
  isOldInstacartProgram: PropTypes.func,
  isNewInstacartProgram: PropTypes.func,
  showRecipeFields: PropTypes.bool,
  departments: PropTypes.arrayOf(PropTypes.shape()),
  productIdBody: PropTypes.arrayOf(PropTypes.shape()),
  calories: PropTypes.string,
  nutrition: PropTypes.string,
  cookingTime: PropTypes.string,
  recipeIngredients: PropTypes.arrayOf(PropTypes.shape()),
  setHoveredOption: PropTypes.func,
  affiliateLinks: PropTypes.arrayOf(PropTypes.shape()),
  affiliatLinks: PropTypes.arrayOf(PropTypes.node),
  intensive: PropTypes.bool,
  minimal: PropTypes.bool,
  moderate: PropTypes.bool,
  photosAlbum: PropTypes.shape(),
  recipePost: PropTypes.shape(),
  signature: PropTypes.string,
  menuItem: PropTypes.arrayOf(PropTypes.shape()),
  customSort: PropTypes.arrayOf(PropTypes.string),
  sortExclude: PropTypes.arrayOf(PropTypes.string),
  customVisibility: PropTypes.arrayOf(PropTypes.string),
  showProductDetails: PropTypes.bool,
  setLinkSafety: PropTypes.func,
  website: PropTypes.string,
  locale: PropTypes.string,
  publisher: PropTypes.string,
  publisherObject: PropTypes.shape(),
  printLength: PropTypes.string,
  publicationDate: PropTypes.string,
  language: PropTypes.string,
  ageRange: PropTypes.string,
  groupId: PropTypes.string,
  productWeight: PropTypes.string,
  dimensions: PropTypes.string,
  manufacturerObject: PropTypes.shape(),
  merchantObject: PropTypes.shape(),
  parent: PropTypes.shape(),
  addOns: PropTypes.arrayOf(PropTypes.shape()),
  features: PropTypes.arrayOf(PropTypes.shape()),
  similarObjects: PropTypes.arrayOf(PropTypes.shape()),
  relatedObjects: PropTypes.arrayOf(PropTypes.shape()),
  references: PropTypes.arrayOf(PropTypes.arrayOf()),
  tagCategoriesList: PropTypes.arrayOf(PropTypes.shape()),
  authors: PropTypes.arrayOf(PropTypes.shape()),
  intl: PropTypes.shape().isRequired,
};

export default CleanSocialProductView;
