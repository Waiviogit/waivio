import {
  addressFields,
  dimensionsFields,
  authorsFields,
  mapFields,
  objectFields,
  phoneFields,
  TYPES_OF_MENU_ITEM,
  weightFields,
  publisherFields,
  optionsFields,
  featuresFields,
  manufacturerFields,
  brandFields,
  merchantFields,
  menuItemFields,
  walletAddressFields,
  recipeFields,
} from '../../../common/constants/listOfFields';
import {
  emailValidationRegExp,
  objectURLValidationRegExp,
  phoneNameValidationRegExp,
} from '../../../common/constants/validation';
import { regexCoordsLatitude, regexCoordsLongitude } from '../../components/Maps/mapHelpers';
import { validateAffiliateUrl } from '../AppendModal/appendFormHelper';

export const fieldsRules = {
  [objectFields.objectName]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Name' },
      },
    },
    {
      max: 200,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 200 characters.",
        },
        intlMeta: { value: 200 },
      },
    },
    {
      validator: true,
    },
  ],
  [objectFields.ageRange]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Reading age' },
      },
    },
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      validator: true,
    },
  ],
  [walletAddressFields.walletAddress]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Address' },
      },
    },

    {
      validator: true,
    },
  ],
  [objectFields.printLength]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Print length' },
      },
    },
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      validator: true,
    },
  ],
  [weightFields.weight]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Weight' },
      },
    },
    {
      validator: true,
    },
  ],
  [dimensionsFields.length]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Length' },
      },
    },
    {
      validator: true,
    },
  ],
  [dimensionsFields.width]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Width' },
      },
    },
    {
      validator: true,
    },
  ],
  [dimensionsFields.depth]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Depth' },
      },
    },
    {
      validator: true,
    },
  ],
  [optionsFields.category]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Category' },
      },
    },
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    // {
    //   validator: true,
    // },
  ],
  [optionsFields.value]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Value' },
      },
    },
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    // {
    //   validator: true,
    // },
  ],
  [optionsFields.position]: [
    {
      transform: value => value && value.toLowerCase(),
    },

    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    // {
    //   validator: true,
    // },
  ],
  [objectFields.affiliateUrlTemplate]: [
    {
      validator: validateAffiliateUrl,
      message: {
        intlId: {
          id: 'affiliate_url_error',
          defaultMessage:
            'Please enter valid URL. It should begin with the website name and include PRODUCTID and AFFILIATECODE.',
        },
      },
    },
  ],
  [optionsFields.image]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    // {
    //   validator: true,
    // },
  ],
  [objectFields.language]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Book language' },
      },
    },
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      validator: true,
    },
  ],
  [recipeFields.calories]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Book language' },
      },
    },
    {
      max: 500,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 500 characters.",
        },
        intlMeta: { value: 500 },
      },
    },
    {
      validator: true,
    },
  ],
  [recipeFields.recipeIngredients]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Recipe ingredients' },
      },
    },
    {
      max: 1500,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 1500 characters.",
        },
        intlMeta: { value: 1500 },
      },
    },
    {
      validator: true,
    },
  ],
  [objectFields.affiliateCode]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Affiliate code' },
      },
    },
    {
      max: 200,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 200 },
      },
    },
    {
      validator: true,
    },
  ],
  [featuresFields.featuresValue]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Value' },
      },
    },
    {
      max: 500,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 500 characters.",
        },
        intlMeta: { value: 500 },
      },
    },
    {
      validator: true,
    },
  ],
  [featuresFields.featuresName]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Name' },
      },
    },
    {
      max: 500,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 500 characters.",
        },
        intlMeta: { value: 500 },
      },
    },
    {
      validator: true,
    },
  ],
  [objectFields.departments]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Departments' },
      },
    },
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      validator: true,
    },
  ],
  [objectFields.groupId]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Group ID' },
      },
    },
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      validator: true,
    },
  ],
  [objectFields.authority]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'authority' },
      },
    },
    {
      validator: true,
    },
  ],
  [objectFields.parent]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Parent' },
      },
    },
    {
      validator: true,
    },
  ],
  [authorsFields.author]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      validator: false,
    },
  ],
  [authorsFields.name]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: false,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Author' },
      },
    },
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      validator: false,
    },
  ],

  [publisherFields.publisher]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      validator: false,
    },
  ],
  [publisherFields.publisherName]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: false,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Publisher' },
      },
    },
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      validator: false,
    },
  ],
  [manufacturerFields.manufacturer]: [
    {
      transform: value => value && value.toLowerCase(),
    },
  ],
  [manufacturerFields.manufacturerName]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
  ],
  [brandFields.brand]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      validator: false,
    },
  ],
  [brandFields.brandName]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: false,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Brand' },
      },
    },
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      validator: false,
    },
  ],
  [merchantFields.merchant]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      validator: false,
    },
  ],
  [merchantFields.merchantName]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: false,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Merchant' },
      },
    },
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      validator: false,
    },
  ],
  [TYPES_OF_MENU_ITEM.LIST]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    // {
    //   required: true,
    //   message: {
    //     intlId: {
    //       id: 'field_error',
    //       defaultMessage: 'Field is required',
    //     },
    //     intlMeta: { field: 'Menu item' },
    //   },
    // },
    {
      validator: true,
    },
  ],
  [TYPES_OF_MENU_ITEM.PAGE]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Menu item' },
      },
    },
    {
      validator: true,
    },
  ],
  [objectFields.avatar]: [
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Avatar URL' },
      },
    },
    {
      pattern: objectURLValidationRegExp,
      message: {
        intlId: {
          id: 'image_link_validation',
          defaultMessage: 'Please enter valid link',
        },
      },
    },
  ],
  [objectFields.background]: [
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Background image URL' },
      },
    },
    {
      pattern: objectURLValidationRegExp,
      message: {
        intlId: {
          id: 'image_link_validation',
          defaultMessage: 'Please enter valid link',
        },
      },
    },
  ],
  'objectFields.title': [
    {
      max: 500,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 500 characters.",
        },
        intlMeta: { value: 500 },
      },
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Short description' },
      },
    },
    {
      validator: true,
    },
  ],
  [objectFields.workTime]: [
    {
      max: 250,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 250 },
      },
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Work time' },
      },
    },
    {
      validator: true,
    },
  ],
  [objectFields.price]: [
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Price' },
      },
    },
    {
      validator: true,
    },
  ],
  [objectFields.description]: [
    {
      max: 5000,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 5000 characters.",
        },
        intlMeta: { value: 5000 },
      },
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Full description' },
      },
    },
    {
      validator: true,
    },
  ],
  [objectFields.companyIdType]: [
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Full description' },
      },
    },
    {
      validator: true,
    },
  ],
  [objectFields.companyId]: [
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Full description' },
      },
    },
    {
      validator: true,
    },
  ],
  [objectFields.productIdType]: [
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Full description' },
      },
    },
    {
      validator: true,
    },
  ],
  [objectFields.productId]: [
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Full description' },
      },
    },
    {
      validator: true,
    },
  ],
  [objectFields.productIdImage]: [
    {
      required: false,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Image URL' },
      },
    },
    {
      pattern: objectURLValidationRegExp,
      message: {
        intlId: {
          id: 'image_link_validation',
          defaultMessage: 'Please enter valid link',
        },
      },
    },
  ],
  [addressFields.address]: [
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      validator: true,
    },
  ],
  [addressFields.street]: [
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      validator: true,
    },
  ],
  [addressFields.city]: [
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      validator: true,
    },
  ],
  [addressFields.state]: [
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      validator: true,
    },
  ],
  [addressFields.postalCode]: [
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      validator: true,
    },
  ],
  [addressFields.country]: [
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      validator: true,
    },
  ],
  [mapFields.latitude]: [
    {
      pattern: regexCoordsLatitude,
      message: {
        intlId: {
          id: 'value_invalid_latitude',
          defaultMessage: 'Should be number from -85 to 85',
        },
        intlMeta: { value: 100 },
      },
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Latitude' },
      },
    },
    {
      validator: true,
    },
  ],
  [mapFields.longitude]: [
    {
      pattern: regexCoordsLongitude,
      message: {
        intlId: {
          id: 'value_invalid_longitude',
          defaultMessage: 'Should be number from -180 to 180',
        },
        intlMeta: { value: 100 },
      },
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Longitude' },
      },
    },
    {
      validator: true,
    },
  ],
  'websiteFields.title': [
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Title' },
      },
    },
    // {
    //   pattern: websiteTitleRegExp,
    //   message: {
    //     intlId: {
    //       id: 'website_symbols_validation',
    //       defaultMessage: 'Please dont use special symbols',
    //     },
    //   },
    // },
    {
      validator: true,
    },
  ],
  'websiteFields.link': [
    {
      max: 255,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 255 characters.",
        },
        intlMeta: { value: 255 },
      },
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Website' },
      },
    },
    {
      pattern: objectURLValidationRegExp,
      message: {
        intlId: {
          id: 'website_validation',
          defaultMessage: 'Please enter valid website',
        },
      },
    },
    {
      validator: true,
    },
  ],
  'buttonFields.title': [
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Title' },
      },
    },
    // {
    //   pattern: websiteTitleRegExp,
    //   message: {
    //     intlId: {
    //       id: 'website_symbols_validation',
    //       defaultMessage: 'Please dont use special symbols',
    //     },
    //   },
    // },
    {
      validator: true,
    },
  ],
  'buttonFields.link': [
    {
      max: 255,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 255 characters.",
        },
        intlMeta: { value: 255 },
      },
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'object_link_required',
          defaultMessage: 'Link to new object is required',
        },
      },
    },
    {
      pattern: objectURLValidationRegExp,
      message: {
        intlId: {
          id: 'image_link_validation',
          defaultMessage: 'Please enter valid link',
        },
      },
    },
    {
      validator: true,
    },
  ],
  currentLocale: [
    {
      validator: true,
    },
  ],
  phoneName: [
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      pattern: phoneNameValidationRegExp,
      message: {
        intlId: {
          id: 'website_symbols_validation',
          defaultMessage: "Please don't use special symbols",
        },
      },
    },
    {
      validator: true,
    },
  ],
  [phoneFields.number]: [
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Phone number' },
      },
    },
    {
      pattern: phoneNameValidationRegExp,
      message: {
        intlId: {
          id: 'website_symbols_validation',
          defaultMessage: "Please don't use special symbols",
        },
      },
    },
    {
      validator: true,
    },
  ],
  [objectFields.email]: [
    {
      max: 256,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 256 },
      },
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Email address' },
      },
    },
    {
      pattern: emailValidationRegExp,
      message: {
        intlId: {
          id: 'email_append_validation',
          defaultMessage: 'Please enter valid email',
        },
      },
    },
    {
      validator: true,
    },
  ],
  [objectFields.rating]: [
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Category' },
      },
    },
    { transform: value => value && value.trim() },
    {
      validator: true,
    },
  ],
  buttonTitle: [
    {
      max: 13,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 13 characters.",
        },
        intlMeta: { value: 13 },
      },
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Category' },
      },
    },
    { transform: value => value && value.trim() },
    {
      validator: true,
    },
  ],
  [objectFields.tagCategory]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Tag Category' },
      },
    },
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      validator: true,
    },
  ],
  [menuItemFields.menuItemTitle]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      max: 100,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 100 characters.",
        },
        intlMeta: { value: 100 },
      },
    },
    {
      validator: false,
    },
  ],
  [objectFields.categoryItem]: [
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Category Item' },
      },
    },
    {
      validator: true,
    },
  ],
  [objectFields.blog]: [
    {
      transform: value => value && value.toLowerCase(),
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'User' },
      },
    },
    {
      validator: true,
    },
  ],
  formTitle: [
    {
      max: 13,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 13 characters.",
        },
        intlMeta: { value: 13 },
      },
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Form title' },
      },
    },
    { transform: value => value && value.trim() },
    {
      validator: true,
    },
  ],
  formLink: [
    {
      max: 255,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 255 characters.",
        },
        intlMeta: { value: 255 },
      },
    },
    {
      required: true,
      message: {
        intlId: {
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Link' },
      },
    },
    {
      pattern: objectURLValidationRegExp,
      message: {
        intlId: {
          id: 'website_validation',
          defaultMessage: 'Please enter valid link',
        },
      },
    },
    {
      validator: true,
    },
  ],
};

export default null;
