import React, { useMemo } from 'react';
import { isEmpty, truncate } from 'lodash';
import { useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router';
import { getProxyImageURL } from '../../../common/helpers/image';
import {
  createQueryBreadcrumbs,
  getObjectName,
  getTitleForLink,
} from '../../../common/helpers/wObjectHelper';
import GoogleAds from '../../adsenseAds/GoogleAds';
import ShopObjectCard from '../ShopObjectCard/ShopObjectCard';
import PageContent from '../PageContent/PageContent';
import WidgetContent from '../WidgetContent/WidgetContent';
import ObjectNewsFeed from '../FeedMasonry/ObjectNewsFeed';
import { getWebsiteDefaultIconList } from '../../../store/appStore/appSelectors';
import useQuery from '../../../hooks/useQuery';
import useAdLevelData from '../../../hooks/useAdsense';
import useTemplateProvider from '../../../designTemplates/TemplateProvider';
import { removeEmptyLines, shortenDescription } from '../../object/wObjectHelper';

const CheckListView = ({ wobject, listItems, loading, intl, hideBreadCrumbs, isNested }) => {
  const defaultListImage = useSelector(getWebsiteDefaultIconList);
  const history = useHistory();
  const listType = wobject?.object_type === 'list';
  const query = useQuery();
  const { name } = useParams();
  const { minimal, intensive, moderate } = useAdLevelData();
  const templateComponents = useTemplateProvider();
  const ChecklistLayout = templateComponents?.ChecklistLayout;

  const hasProducts = listItems && listItems.some(item => item.object_type !== 'list');

  let breadcrumbsFromQuery = query.get('breadcrumbs');

  breadcrumbsFromQuery = breadcrumbsFromQuery ? breadcrumbsFromQuery.split('/') : null;

  const cleanListSummary = useMemo(() => {
    if (!listType) return null;

    const preparedDescription = removeEmptyLines(wobject?.description || '');
    const { firstDescrPart } = shortenDescription(preparedDescription, 260);

    return {
      label: wobject?.name,
      title: wobject?.title || getObjectName(wobject),
      description: firstDescrPart,
    };
  }, [listType, wobject]);

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

    const injectAds = (items, getRowFn, isProducts) => {
      const result = [];
      const rows = [];

      for (let i = 0; i < items.length; i += 4) {
        rows.push(items.slice(i, i + 4));
      }

      rows.forEach((row, rowIndex) => {
        const rowElements = [...row.map(getRowFn)];

        if (intensive && isProducts) {
          const adPosition = Math.floor(Math.random() * (rowElements.length + 1));

          rowElements.splice(
            adPosition,
            0,

            <GoogleAds
              listItem={!isProducts}
              listItemProducts={isProducts}
              // eslint-disable-next-line react/no-array-index-key
              key={`ad-${rowIndex}-${adPosition}`}
            />,
          );
        }

        result.push(...rowElements);
      });

      return result;
    };

    if (isEmpty(wobject?.sortCustom?.include)) {
      const itemsListType = listItems.filter(item => item.object_type === 'list');
      const itemsProducts = listItems.filter(item => item.object_type !== 'list');

      return (
        <div>
          <div className="Checklist__list">{itemsListType.map(getListRow)}</div>
          <div className="Checklist__list">{injectAds(itemsProducts, getListRow, true)}</div>
        </div>
      );
    }

    return <div className="Checklist__list">{injectAds(listItems, getListRow, hasProducts)}</div>;
  };

  if (!ChecklistLayout) {
    return null;
  }

  return (
    <ChecklistLayout
      wobject={wobject}
      listType={listType}
      loading={loading}
      hideBreadCrumbs={hideBreadCrumbs}
      getMenuList={getMenuList}
      minimal={minimal}
      moderate={moderate}
      intensive={intensive}
      cleanListSummary={cleanListSummary}
    />
  );
};

CheckListView.propTypes = {
  wobject: PropTypes.shape({
    object_type: PropTypes.string,
    author_permlink: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    title: PropTypes.string,
    background: PropTypes.string,
    sortCustom: PropTypes.shape({
      include: PropTypes.arrayOf(PropTypes.string),
    }),
    listItems: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
  listItems: PropTypes.arrayOf(PropTypes.shape({})),
  intl: PropTypes.shape({ formatMessage: PropTypes.func }).isRequired,
  loading: PropTypes.bool,
  isNested: PropTypes.bool,
  hideBreadCrumbs: PropTypes.bool,
};

export default injectIntl(CheckListView);
