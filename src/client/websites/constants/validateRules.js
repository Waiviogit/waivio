import { size } from 'lodash';

export default {
  domain: [
    {
      required: true,
      message: 'Field is required',
    },
    {
      pattern: /[a-z,0-9]+$/,
      // message:
    },
    {
      validator: (rule, value) => {
        if (value === 'www') {
          return Promise.reject('You can`t use only www in domain name');
        }

        if (size(value) < 3) {
          return Promise.reject('The domain must contain at least 3 characters.');
        }

        return Promise.resolve();
      },
    },
  ],
  politics: [
    {
      validator: (rule, value) =>
        value ? Promise.resolve() : Promise.reject('Should accept agreement'),
    },
  ],
  autocomplete: [
    {
      required: true,
      message: 'Field is required',
    },
  ],
};
