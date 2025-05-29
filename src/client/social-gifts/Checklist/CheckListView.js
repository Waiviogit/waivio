import React from 'react';
import { isEmpty, map, truncate } from 'lodash';
import { useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router';
import EarnsCommissionsOnPurchases from '../../statics/EarnsCommissionsOnPurchases';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import Loading from '../../components/Icon/Loading';
import { getProxyImageURL } from '../../../common/helpers/image';
import {
  createQueryBreadcrumbs,
  getObjectName,
  getTitleForLink,
} from '../../../common/helpers/wObjectHelper';
import ShopObjectCard from '../ShopObjectCard/ShopObjectCard';
import PageContent from '../PageContent/PageContent';
import WidgetContent from '../WidgetContent/WidgetContent';
import ObjectNewsFeed from '../FeedMasonry/ObjectNewsFeed';
import { getWebsiteDefaultIconList } from '../../../store/appStore/appSelectors';
import ListDescription from '../ListDescription/ListDescription';
import useQuery from '../../../hooks/useQuery';

const CheckListView = ({ wobject, listItems, loading, intl, hideBreadCrumbs, isNested }) => {
  const defaultListImage = useSelector(getWebsiteDefaultIconList);
  const history = useHistory();
  const listType = wobject?.object_type === 'list';
  const query = useQuery();
  const { name } = useParams();

  let breadcrumbsFromQuery = query.get('breadcrumbs');

  breadcrumbsFromQuery = breadcrumbsFromQuery ? breadcrumbsFromQuery.split('/') : null;

  const getListRow = listItem => {
    const isList = listItem.object_type === 'list';

    if (isList) {
      const avatar = getProxyImageURL(listItem?.avatar || defaultListImage, 'preview');

      return (
        <div
          className="Checklist__listItems"
          onClick={() => {
            history.push(
              `/object/${listItem?.author_permlink}?breadcrumbs=${createQueryBreadcrumbs(
                listItem?.author_permlink,
                breadcrumbsFromQuery,
                name || wobject.author_permlink,
              )}`,
            );
          }}
          key={listItem.author_permlink}
        >
          <a
            href={`/object/${listItem.author_permlink}`}
            title={getTitleForLink(listItem)}
            onClick={e => e.preventDefault()}
          >
            {!listItem?.avatar && !defaultListImage ? (
              <div
                className="Checklist__itemsAvatar"
                style={{
                  backgroundImage: `url(${avatar})`,
                }}
              >
                <Icon type="shopping" />
              </div>
            ) : (
              <div
                className="Checklist__itemsAvatar"
                style={{
                  backgroundImage: `url(${avatar})`,
                }}
              >
                <img
                  className="Checklist__itemsAvatarImg"
                  src={avatar}
                  alt={`${getTitleForLink(listItem)} `}
                />
              </div>
            )}
            <span
              className="Checklist__itemsTitle"
              title={
                listItem?.description
                  ? truncate(listItem?.description, { length: 200 })
                  : getObjectName(listItem)
              }
            >
              {getObjectName(listItem)}
              {!isNaN(listItem.listItemsCount) ? (
                <span className="items-count"> ({listItem.listItemsCount})</span>
              ) : null}
            </span>
          </a>
        </div>
      );
    }

    return <ShopObjectCard key={listItem.author_permlink} isChecklist wObject={listItem} />;
  };

  const getMenuList = () => {
    if (wobject?.object_type === 'page') return <PageContent wobj={wobject} />;
    if (wobject?.object_type === 'widget') return <WidgetContent wobj={wobject} />;
    if (wobject?.object_type === 'newsfeed')
      return <ObjectNewsFeed isNested={isNested} wobj={wobject} />;

    if (isEmpty(listItems) && !loading) {
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
      {!hideBreadCrumbs && !loading && wobject?.object_type !== 'newsfeed' && <Breadcrumbs />}
      {listType && wobject?.background && !loading && (
        <div className="Checklist__banner">
          <img src={wobject?.background} alt={'Promotional list banner'} />
        </div>
      )}
      {loading ? <Loading /> : getMenuList()}
      {listType && !loading && <ListDescription wobject={wobject} />}
      {listType && <EarnsCommissionsOnPurchases />}
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
  listItems: PropTypes.arrayOf(PropTypes.shape({})),
  intl: PropTypes.shape({ formatMessage: PropTypes.func }).isRequired,
  loading: PropTypes.bool,
  isNested: PropTypes.bool,
  hideBreadCrumbs: PropTypes.bool,
};

export default injectIntl(CheckListView);
