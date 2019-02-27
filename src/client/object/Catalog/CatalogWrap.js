import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import CatalogItem from './CatalogItem';
import { getFieldWithMaxWeight } from '../wObjectHelper';
import { getClientWObj } from '../../adapters';
import { objectFields } from '../../../common/constants/listOfFields';
import AddItemModal from './AddItemModal/AddItemModal';
import CreateObjectModal from '../../post/CreateObjectModal/CreateObject';
import * as wobjectActions from '../../../client/object/wobjActions';
import * as notificationActions from '../../../client/app/Notification/notificationActions';
import './CatalogWrap.less';

const innerCategoryCount = 5;

const CatalogWrap = ({ wobject, match, intl, createObject, notify, isEditMode }) => {
  const handleCreateObject = wobj => {
    createObject(wobj)
      .then(() =>
        notify(
          intl.formatMessage({
            id: 'create_object_success',
            defaultMessage: 'Object has been created',
          }),
          'success',
        ),
      )
      .catch(() =>
        notify(
          intl.formatMessage({
            id: 'create_object_error',
            defaultMessage: 'Something went wrong. Object is not created',
          }),
          'error',
        ),
      );
  };

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

  return (
    <React.Fragment>
      {isEditMode && (
        <div className="CatalogWrap__add-item">
          <AddItemModal wobject={wobject} />
          <CreateObjectModal handleCreateObject={handleCreateObject} />
        </div>
      )}
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
                    <CatalogItem wobject={getClientWObj(catalogItem)} />
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
  createObject: PropTypes.func,
  notify: PropTypes.func,
  isEditMode: PropTypes.bool.isRequired,
};

CatalogWrap.defaultProps = {
  wobject: {},
  createObject: () => {},
  notify: () => {},
};

export default connect(
  null,
  {
    createObject: wobjectActions.createObject,
    notify: notificationActions.notify,
  },
)(injectIntl(CatalogWrap));
