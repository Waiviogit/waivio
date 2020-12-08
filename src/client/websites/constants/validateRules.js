import { size } from 'lodash';
import { FormattedMessage } from 'react-intl';
import React from 'react';

const validate = {
  text: /[a-z,0-9]+$/,
};

export default {
  domain: [
    {
      required: true,
      message: (
        <FormattedMessage id="website_domain_field_required" defaultMessage="Field is required" />
      ),
    },
    {
      validator: (rule, value) => {
        const symbol = 3;
        if (value === 'www') {
          return Promise.reject(
            <FormattedMessage
              id="website_domain_name_available"
              defaultMessage="You can`t use only www in domain name"
              values={{ value }}
            />,
          );
        }

        if (size(value) < symbol) {
          return Promise.reject(
            <FormattedMessage
              id="website_domain_available"
              defaultMessage="The domain must contain at least 3 characters"
              values={{ symbol }}
            />,
          );
        }

        if (!validate.text.test(value)) {
          return Promise.reject(
            <FormattedMessage
              id="website_domain_pattern"
              defaultMessage="domain value {value} does not match pattern /[a-z,0-9]+$/"
              values={{ value }}
            />,
          );
        }
        return Promise.resolve();
      },
    },
  ],
  politics: [
    {
      validator: (rule, value) =>
        value
          ? Promise.resolve()
          : Promise.reject(
              <FormattedMessage
                id="website_politics_available"
                defaultMessage="Should accept agreement"
              />,
            ),
    },
  ],
  autocomplete: [
    {
      required: true,
      message: (
        <FormattedMessage
          id="website_autocomplete_field_required"
          defaultMessage="Field is required"
        />
      ),
    },
  ],
};
