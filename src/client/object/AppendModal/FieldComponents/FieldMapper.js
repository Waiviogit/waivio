import React from 'react';
import {
  objectFields,
  recipeFields,
  TYPES_OF_MENU_ITEM,
} from '../../../../common/constants/listOfFields';

// Simple Fields
import {
  NameField,
  TitleField,
  DescriptionField,
  EmailField,
  UrlField,
  PriceField,
  CompareAtPriceField,
  PrintLengthField,
  AgeRangeField,
  WorkTimeField,
  NutritionField,
  LanguageField,
  AuthorityField,
  AffiliateUrlTemplateField,
  HashtagField,
  ContentViewField,
} from './SimpleFields';

// Date Fields
import { PublicationDateField } from './DateFields';

// Recipe Fields
import {
  CaloriesField,
  BudgetField,
  CookingTimeField,
  RecipeIngredientsField,
} from './RecipeFields';

// Object Selection Fields
import { ParentField, FeaturedField, CategoryItemField } from './ObjectSelectionFields';

// Menu Fields
import { MenuPageField, MenuListField } from './MenuFields';

// Existing Form Components, Map Forms, and Group Forms
import {
  AuthorForm,
  BrandForm,
  ManufacturerForm,
  MerchantForm,
  PublisherForm,
  RelatedForm,
  SimilarForm,
  AddOnForm,
  CompanyIdForm,
  GroupIdForm,
  AffiliateCodeForm,
  AffiliateGeoAreaForm,
  AffiliateProductIdTypesForm,
  LinkUrlForm,
  ShopFilterForm,
  NewsFilterForm,
  ExtendedNewsFilterForm,
  PromotionForm,
  SaleForm,
  WalletAddressForm,
  DelegationForm,
  DimensionsForm,
  ObjectFeaturesForm,
  MenuItemForm,
  MapAreasForm,
  MapDesktopViewForm,
  MapObjectsListForm,
  MapObjectTypesForm,
  MapTagsForm,
  ProductIdForm,
  AddUserForm,
  ExpertiseForm,
  GroupFollowersForm,
  LastActivityForm,
} from './index';

/**
 * Field Mapper - maps field names to their corresponding components
 * Це дозволяє динамічно рендерити правильний компонент для кожного типу поля
 */
export const FieldMapper = {
  // Simple text fields
  [objectFields.name]: NameField,
  [objectFields.title]: TitleField,
  [objectFields.description]: DescriptionField,
  [objectFields.email]: EmailField,
  [objectFields.url]: UrlField,
  [objectFields.workTime]: WorkTimeField,
  [objectFields.nutrition]: NutritionField,
  [objectFields.language]: LanguageField,
  [objectFields.authority]: AuthorityField,
  [objectFields.affiliateUrlTemplate]: AffiliateUrlTemplateField,
  [objectFields.hashtag]: HashtagField,
  [objectFields.contentView]: ContentViewField,

  // Numeric fields
  [objectFields.price]: PriceField,
  [objectFields.compareAtPrice]: CompareAtPriceField,
  [objectFields.printLength]: PrintLengthField,
  [objectFields.ageRange]: AgeRangeField,

  // Date fields
  [objectFields.publicationDate]: PublicationDateField,

  // Recipe fields
  [recipeFields.calories]: CaloriesField,
  [recipeFields.budget]: BudgetField,
  [recipeFields.cookingTime]: CookingTimeField,
  [recipeFields.recipeIngredients]: RecipeIngredientsField,

  // Object selection fields
  [objectFields.parent]: ParentField,
  [objectFields.featured]: FeaturedField,
  [objectFields.categoryItem]: CategoryItemField,

  // Company/Business fields
  [objectFields.brand]: BrandForm,
  [objectFields.manufacturer]: ManufacturerForm,
  [objectFields.merchant]: MerchantForm,
  [objectFields.publisher]: PublisherForm,
  [objectFields.authors]: AuthorForm,

  // Related objects
  [objectFields.related]: RelatedForm,
  [objectFields.similar]: SimilarForm,
  [objectFields.addOn]: AddOnForm,

  // Identifiers
  [objectFields.companyId]: CompanyIdForm,
  [objectFields.groupId]: GroupIdForm,

  // Affiliate fields
  [objectFields.affiliateCode]: AffiliateCodeForm,
  [objectFields.affiliateGeoArea]: AffiliateGeoAreaForm,
  [objectFields.affiliateProductIdTypes]: AffiliateProductIdTypesForm,

  // Link and navigation
  [objectFields.link]: LinkUrlForm,
  [objectFields.menuItem]: MenuItemForm,

  // Menu fields (TYPES_OF_MENU_ITEM)
  [TYPES_OF_MENU_ITEM.PAGE]: MenuPageField,
  [TYPES_OF_MENU_ITEM.LIST]: MenuListField,

  // Filters
  [objectFields.shopFilter]: ShopFilterForm,
  [objectFields.newsFilter]: NewsFilterForm,
  [objectFields.newsFeed]: ExtendedNewsFilterForm,

  // Promotional
  [objectFields.promotion]: PromotionForm,
  [objectFields.sale]: SaleForm,

  // Financial/Crypto
  [objectFields.walletAddress]: WalletAddressForm,
  [objectFields.delegation]: DelegationForm,

  // Product specifications
  [objectFields.dimensions]: DimensionsForm,
  [objectFields.features]: ObjectFeaturesForm,

  // Map fields
  [objectFields.mapObjectsList]: MapObjectsListForm,
  [objectFields.mapDesktopView]: MapDesktopViewForm,
  [objectFields.mapObjectTypes]: MapObjectTypesForm,
  [objectFields.mapObjectTags]: MapTagsForm,
  [objectFields.mapRectangles]: MapAreasForm,
  [objectFields.productId]: ProductIdForm,

  // Group fields
  [objectFields.groupAdd]: AddUserForm,
  [objectFields.groupExpertise]: ExpertiseForm,
  [objectFields.groupFollowers]: GroupFollowersForm,
  [objectFields.groupLastActivity]: LastActivityForm,
};

/**
 * Render field component based on field name
 * @param {string} fieldName - The field name from objectFields constants
 * @param {object} props - Props to pass to the field component
 * @returns {React.Element|null} The rendered field component or null
 */
export const renderField = (fieldName, props) => {
  const FieldComponent = FieldMapper[fieldName];

  if (!FieldComponent) {
    // Якщо компонент не знайдено, повертаємо null
    // Це означає що поле ще не мігроване на нову систему
    return null;
  }

  return <FieldComponent {...props} />;
};

/**
 * Check if field has been migrated to new component system
 * @param {string} fieldName - The field name to check
 * @returns {boolean} True if field component exists
 */
export const isFieldMigrated = fieldName => !!FieldMapper[fieldName];
