import { Breadcrumb, message } from 'antd';
import { Link } from 'react-router-dom';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import CatalogItem from './CatalogItem';
import { getFieldWithMaxWeight } from '../wObjectHelper';
import { objectFields } from '../../../common/constants/listOfFields';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';
import AddItemModal from './AddItemModal';
import { getAppendData } from '../../helpers/wObjectHelper';
import { getAuthenticatedUserName } from '../../reducers';
import * as appendActions from '../appendActions';
import './CatalogWrap.less';

const innerCategoryCount = 5;

const CatalogWrap = ({ wobject, match, currentUserName, intl, appendObject }) => {
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

  const handleSelectObject = selectedObj => {
    const bodyMsg = intl.formatMessage(
      {
        id: 'add_catalog_item',
        defaultMessage: `@{user} added {itemType} <strong>{itemValue}</strong> to catalog.`,
      },
      {
        user: currentUserName,
        itemType: 'object',
        itemValue: selectedObj.name,
      },
    );
    const fieldContent = {
      name: 'catalogObject',
      body: selectedObj.id,
      parent: newCategoryParent === 'catalog' ? '' : newCategoryParent,
      locale: 'en-US',
    };
    const appendData = getAppendData(currentUserName, wobject, bodyMsg, fieldContent);
    appendObject(appendData)
      .then(() => {
        message.success(
          intl.formatMessage({
            id: 'notify_create_category',
            defaultMessage: 'Category has been created',
          }),
        );
      })
      .catch(err => {
        console.log('err > ', err);
        message.error(
          intl.formatMessage({
            id: 'notify_create_category_error',
            defaultMessage: "Couldn't create category",
          }),
        );
      });
  };

  return (
    <React.Fragment>
      <div className="CatalogWrap__add-item">
        <SearchObjectsAutocomplete handleSelect={handleSelectObject} canCreateNewObject={false} />
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
  currentUserName: PropTypes.string.isRequired,
  appendObject: PropTypes.func.isRequired,
};

CatalogWrap.defaultProps = {
  wobject: {},
};

export default connect(
  state => ({
    currentUserName: getAuthenticatedUserName(state),
  }),
  { appendObject: appendActions.appendObject },
)(injectIntl(CatalogWrap));
