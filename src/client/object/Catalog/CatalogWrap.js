import React from 'react';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import './CatalogWrap.less';
import CatalogItem from './CatalogItem';

const CatalogWrap = ({ wobject }) => {
  const catalog = wobject.catalog;

  return (
    <div className="CatalogWrap">
      {catalog ? (
        <div>
          {_.map(catalog, catalogItem => (
            <CatalogItem key={`category-${catalogItem.permlink}`} catalogItem={catalogItem} />
          ))}
        </div>
      ) : (
        'nothing to show'
      )}
    </div>
  );
};

CatalogWrap.propTypes = {
  wobject: PropTypes.shape(),
};

CatalogWrap.defaultProps = {
  wobject: {},
};

export default injectIntl(CatalogWrap);
