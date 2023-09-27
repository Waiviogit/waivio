import React from 'react';
import { isEmpty, map } from 'lodash';
import { useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useHistory, useRouteMatch } from 'react-router';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import Loading from '../../components/Icon/Loading';
import { getProxyImageURL } from '../../../common/helpers/image';
import {
  createNewHash,
  getObjectName,
  getTitleForLink,
} from '../../../common/helpers/wObjectHelper';
import ShopObjectCard from '../ShopObjectCard/ShopObjectCard';
import PageContent from '../PageContent/PageContent';
import WidgetContent from '../WidgetContent/WidgetContent';
import ObjectNewsFeed from '../FeedMasonry/ObjectNewsFeed';
import { getWebsiteDefaultIconList } from '../../../store/appStore/appSelectors';
import ListDescription from '../ListDescription/ListDescription';

const CheckListView = ({ wobject, listItems, loading, intl, hideBreadCrumbs }) => {
  const defaultListImage = useSelector(getWebsiteDefaultIconList);
  const history = useHistory();
  const match = useRouteMatch();
  const listType = wobject?.object_type === 'list';
  const getListRow = listItem => {
    const isList = listItem.object_type === 'list';

    if (isList) {
      const avatar = getProxyImageURL(listItem?.avatar || defaultListImage, 'preview');

      return (
        <div className="Checklist__listItems">
          <Link
            to={{
              pathname: `/checklist/${match.params.name}`,
              hash: createNewHash(listItem?.author_permlink, history.location.hash),
              search:
                match.params.name === listItem?.author_permlink
                  ? ''
                  : `currObj=${listItem?.author_permlink}`,
            }}
            title={getTitleForLink(listItem)}
          >
            <div
              className="Checklist__itemsAvatar"
              style={{
                backgroundImage: `url(${avatar})`,
              }}
            >
              {!listItem?.avatar && !defaultListImage && <Icon type="shopping" />}
            </div>
            <span className="Checklist__itemsTitle">
              {getObjectName(listItem)}
              {!isNaN(listItem.listItemsCount) ? (
                <span className="items-count"> ({listItem.listItemsCount})</span>
              ) : null}
            </span>
          </Link>
        </div>
      );
    }

    return <ShopObjectCard isChecklist wObject={listItem} />;
  };

  const getMenuList = () => {
    if (wobject?.object_type === 'page') return <PageContent wobj={wobject} />;
    if (wobject?.object_type === 'widget') return <WidgetContent wobj={wobject} />;
    if (wobject?.object_type === 'newsfeed') return <ObjectNewsFeed wobj={wobject} />;

    if (isEmpty(listItems)) {
      return (
        <div className={'Checklist__empty'}>
          {intl.formatMessage({
            id: 'checklist_empty',
            defaultMessage: 'There are no items in the list',
          })}
        </div>
      );
    }

    if (isEmpty(wobject?.sortCustom?.include)) {
      const itemsListType = listItems.filter(item => item.object_type === 'list');
      const itemsProducts = listItems.filter(item => item.object_type !== 'list');

      return (
        <div>
          <div className="Checklist__list">{itemsListType.map(item => getListRow(item))}</div>
          <div className="Checklist__list">{itemsProducts.map(item => getListRow(item))}</div>
        </div>
      );
    }

    return (
      <div className="Checklist__list">{map(listItems, listItem => getListRow(listItem))}</div>
    );
  };

  return (
    <div className="Checklist">
      {!hideBreadCrumbs && !loading && <Breadcrumbs />}
      {listType && !loading && <ListDescription wobject={wobject} />}
      {listType && wobject?.background && !loading && (
        <div className="Checklist__banner">
          <img src={wobject?.background} alt={'Promotional list banner'} />
        </div>
      )}
      {loading ? <Loading /> : getMenuList()}
    </div>
  );
};

CheckListView.propTypes = {
  wobject: PropTypes.shape({
    object_type: PropTypes.string,
    author_permlink: PropTypes.string,
    background: PropTypes.string,
    sortCustom: PropTypes.shape({
      include: PropTypes.arrayOf(PropTypes.string),
    }),
    listItems: PropTypes.arrayOf(),
  }).isRequired,
  listItems: PropTypes.arrayOf(),
  intl: PropTypes.shape({ formatMessage: PropTypes.func }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
  loading: PropTypes.bool,
  hideBreadCrumbs: PropTypes.bool,
};

export default injectIntl(CheckListView);
