import { Link, withRouter } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { isEmpty, map } from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import { getSuitableLanguage } from '../../../store/reducers';
import {
  createNewHash,
  getLastPermlinksFromHash,
  getObjectAvatar,
  getObjectName,
} from '../../../common/helpers/wObjectHelper';
import { setListItems } from '../../../store/wObjectStore/wobjActions';
import { getObjectLists } from '../../../store/wObjectStore/wObjectSelectors';
import Loading from '../../components/Icon/Loading';
import { getAuthenticatedUser } from '../../../store/authStore/authSelectors';

// import CatalogBreadcrumb from "../../object/Catalog/CatalogBreadcrumb/CatalogBreadcrumb";
import ShopObjectCard from '../ShopObjectCard/ShopObjectCard';
import { sortListItemsBy } from '../../object/wObjectHelper';
import { getObject } from '../../../waivioApi/ApiClient';

import './Checklist.less';

const Checklist = ({ userName, listItems, locale, setLists, location, intl, match }) => {
  const [loading, setLoading] = useState();

  useEffect(() => {
    const pathUrl = getLastPermlinksFromHash(location.hash) || match.params.name;

    setLoading(true);

    getObject(pathUrl, userName, locale).then(wObject => {
      setLists(
        sortListItemsBy(
          wObject?.listItems,
          isEmpty(wObject?.sortCustom) ? 'rank' : 'custom',
          wObject?.sortCustom,
        ),
      );
      setLoading(false);
    });
  }, [location.hash, match.params.name]);

  const getListRow = listItem => {
    const isList = listItem.object_type === 'list';

    if (isList) {
      return (
        <div className="Checklist__listItems">
          {getObjectAvatar(listItem) ? (
            <img className="Checklist__itemsAvatar" src={getObjectAvatar(listItem)} alt={''} />
          ) : (
            <div className="Checklist__itemsAvatar">
              <Icon type="shopping" />
            </div>
          )}
          <Link
            to={{
              pathname: `/checklist/${match.params.name}`,
              hash: createNewHash(listItem?.author_permlink, location.hash),
            }}
            className={'Checklist__itemsTitle'}
          >
            {getObjectName(listItem)}
            {!isNaN(listItem.listItemsCount) ? (
              <span className="items-count"> ({listItem.listItemsCount})</span>
            ) : null}
          </Link>
        </div>
      );
    }

    return <ShopObjectCard wObject={listItem} />;
  };

  const getMenuList = () => {
    if (isEmpty(listItems)) {
      return (
        <div className={'Checklist__empty'}>
          {intl.formatMessage({
            id: 'emptyList',
            defaultMessage: 'This list is empty',
          })}
        </div>
      );
    }

    return (
      <div className="Checklist__list">{map(listItems, listItem => getListRow(listItem))}</div>
    );
  };

  return (
    <div className="Checklist">
      {/* <div className="CatalogWrap__breadcrumb"> */}
      {/*  <CatalogBreadcrumb intl={intl} wobject={wobject} /> */}
      {/* </div> */}
      {loading ? <Loading /> : getMenuList()}
    </div>
  );
};

Checklist.propTypes = {
  location: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  listItems: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  intl: PropTypes.arrayOf(PropTypes.shape({ formatMessage: PropTypes.func })).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
  setLists: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  listItems: getObjectLists(state),
  locale: getSuitableLanguage(state),
  userName: getAuthenticatedUser(state),
});

const mapDispatchToProps = {
  setLists: setListItems,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(Checklist)));
