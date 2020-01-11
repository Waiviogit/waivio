import {
  addressFields,
  objectFields,
  phoneFields,
  ratingFields,
  TYPES_OF_MENU_ITEM,
} from '../../../common/constants/listOfFields';
import {
  emailValidationRegExp,
  objectURLValidationRegExp,
  phoneNameValidationRegExp,
} from '../../../common/constants/validation';

export const fieldsRules = {
  [objectFields.name]: [
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
  [objectFields.tagCloud]: [
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
        intlMeta: { field: 'Tag cloud' },
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
  [TYPES_OF_MENU_ITEM.LIST]: [
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
        intlMeta: { field: 'Short description' },
      },
    },
    {
      validator: true,
    },
  ],
  [objectFields.workTime]: [
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
      max: 512,
      message: {
        intlId: {
          id: 'value_error_long',
          defaultMessage: "Value can't be longer than 512 characters.",
        },
        intlMeta: { value: 512 },
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
          id: 'field_error',
          defaultMessage: 'Field is required',
        },
        intlMeta: { field: 'Button' },
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
  [ratingFields.category]: [
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
};

export default null;
