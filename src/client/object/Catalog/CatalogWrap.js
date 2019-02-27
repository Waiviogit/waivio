import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import React from 'react';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import './CatalogWrap.less';
import CatalogItem from './CatalogItem';
import { getFieldWithMaxWeight } from '../wObjectHelper';
import { objectFields } from '../../../common/constants/listOfFields';
import AddItemModal from './AddItemModal';

const innerCategoryCount = 5;

const CatalogWrap = ({ wobject, match, intl }) => {
  let currentItem = {};
  currentItem.items = wobject.catalog;
  let link = '/';
  const breadcrumb = [];
  if (currentItem && match && match.params && wobject.catalog) {
    const params = match.params;
    link = `/object/${params.name}/catalog`;
    breadcrumb.push({ name: getFieldWithMaxWeight(wobject, objectFields.name), link });
    for (let a = 1; a < innerCategoryCount; a += 1) {
      if (params[`item${a}Id`]) {
        link += `/${params[`item${a}Id`]}`;
        currentItem = _.find(currentItem.items, { permlink: params[`item${a}Id`] });
        breadcrumb.push({ name: currentItem.body, link });
      }
    }
  }
  const newCategoryParent = link.split('/').pop();

  return (
    <React.Fragment>
      <div className="CatalogWrap__add-item">
        <AddItemModal
          wobject={wobject}
          parent={newCategoryParent === 'catalog' ? '' : newCategoryParent}
        />
      </div>
      <div className="CatalogWrap">
        {currentItem ? (
          <div>
            <div className="CatalogWrap__breadcrumb">
              <Breadcrumb>
                {_.map(breadcrumb, crumb => (
                  <Breadcrumb.Item key={`crumb-${crumb.name}`}>
                    <Link
                      className="CatalogWrap__breadcrumb__link"
                      to={{ pathname: crumb.link }}
                      title={`${intl.formatMessage({ id: 'GoTo', defaultMessage: 'Go to' })} ${
                        crumb.name
                      }`}
                    >
                      {crumb.name}
                    </Link>
                  </Breadcrumb.Item>
                ))}
              </Breadcrumb>
            </div>
            {!_.isEmpty(currentItem.items) ? (
              _.map(currentItem.items, catalogItem => (
                <div key={`category-${catalogItem.permlink}`}>
                  <Link
                    to={{ pathname: `${link}/${catalogItem.permlink}` }}
                    title={`${intl.formatMessage({ id: 'GoTo', defaultMessage: 'Go to' })} ${
                      catalogItem.body
                    }`}
                  >
                    <CatalogItem catalogItem={catalogItem} />
                  </Link>
                </div>
              ))
            ) : (
              <div>
                {intl.formatMessage({
                  id: 'emptyCategory',
                  defaultMessage: 'This category is empty',
                })}
              </div>
            )}
          </div>
        ) : (
          <div>
            {intl.formatMessage({ id: 'emptyCatalog', defaultMessage: 'This catalog is empty' })}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

CatalogWrap.propTypes = {
  wobject: PropTypes.shape(),
  intl: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
};

CatalogWrap.defaultProps = {
  wobject: {},
};

export default injectIntl(CatalogWrap);
