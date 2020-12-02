import React from 'react';
import PropTypes from 'prop-types';
import { AutoComplete, Input } from 'antd';
import { injectIntl } from 'react-intl';

import './WebsiteSearch.less';

const WebsiteSearch = ({ intl }) => {
  return (
    <AutoComplete className="WebsiteSearch" allowClear>
      <Input.Search
        size="large"
        placeholder={intl.formatMessage({
          id: 'find_restaurants_and_dishes',
          defaultMessage: 'Find restaurants and dishes',
        })}
      />
    </AutoComplete>
  );
};

WebsiteSearch.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

export default injectIntl(WebsiteSearch);
