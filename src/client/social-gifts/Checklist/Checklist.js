import { Link, withRouter } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { isEmpty, map } from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import Helmet from 'react-helmet';

import { getSuitableLanguage } from '../../../store/reducers';
import {
  createNewHash,
  getLastPermlinksFromHash,
  getObjectAvatar,
  getObjectName,
} from '../../../common/helpers/wObjectHelper';
import {
  setBreadcrumbForChecklist,
  setNestedWobject,
} from '../../../store/wObjectStore/wobjActions';
import Loading from '../../components/Icon/Loading';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

import ShopObjectCard from '../ShopObjectCard/ShopObjectCard';
import { sortListItemsBy } from '../../object/wObjectHelper';
import { getObject } from '../../../waivioApi/ApiClient';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import {
  getHelmetIcon,
  getMainObj,
  getSiteName,
  getWebsiteDefaultIconList,
} from '../../../store/appStore/appSelectors';
import { getProxyImageURL } from '../../../common/helpers/image';
import PageContent from '../PageContent/PageContent';
import WidgetContent from '../WidgetContent/WidgetContent';
import ObjectNewsFeed from '../FeedMasonry/ObjectNewsFeed';
import './Checklist.less';

const Checklist = ({
  userName,
  locale,
  history,
  intl,
  match,
  setBreadcrumb,
  defaultListImage,
  permlink,
  hideBreadCrumbs,
  isSocialProduct,
  setNestedObject,
}) => {
  const [loading, setLoading] = useState(true);
  const [listItems, setLists] = useState(true);
  const [object, setObject] = useState(false);
  const favicon = useSelector(getHelmetIcon);
  const siteName = useSelector(getSiteName);
  const mainObj = useSelector(getMainObj);
  const title = `${getObjectName(object)} - ${siteName}`;
  const desc = mainObj?.description;
  const image = getObjectAvatar(object);
  const canonicalUrl = typeof location !== 'undefined' && location?.origin;

  useEffect(() => {
    const pathUrl =
      permlink || getLastPermlinksFromHash(history.location.hash) || match.params.name;

    setLoading(true);
    getObject(pathUrl, userName, locale).then(wObject => {
      if (wObject.object_type === 'list') window.gtag('event', getObjectName(wObject));
      setObject(wObject);
      if (history.location.hash) {
        setNestedObject(wObject);
      }

      if (!isSocialProduct) {
        setBreadcrumb(wObject);
      }
      setLists(
        sortListItemsBy(
          wObject?.listItems,
          isEmpty(wObject?.sortCustom) ? 'rank' : 'custom',
          wObject?.sortCustom,
        ),
      );
      setLoading(false);
    });
  }, [history.location.hash, match.params.name]);

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
            }}
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
    if (object.object_type === 'page') return <PageContent wobj={object} />;
    if (object.object_type === 'widget') return <WidgetContent wobj={object} />;
    if (object.object_type === 'newsfeed') return <ObjectNewsFeed wobj={object} />;

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

    if (isEmpty(object.sortCustom?.include)) {
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
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="description" content={desc} />
        <meta name="twitter:card" content={'summary_large_image'} />
        <meta name="twitter:site" content={'@waivio'} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={image} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={image} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:description" content={desc} />
        <meta property="og:site_name" content={siteName} />
        <link rel="image_src" href={image} />
        <link id="favicon" rel="icon" href={favicon} type="image/x-icon" />
      </Helmet>
      {!hideBreadCrumbs && <Breadcrumbs />}
      {object.object_type === 'list' && object.background && !loading && (
        <div className="Checklist__banner">
          <img src={object.background} alt={'Promotional list banner'} />
        </div>
      )}
      {loading ? <Loading /> : getMenuList()}
    </div>
  );
};

Checklist.propTypes = {
  history: PropTypes.shape({
    location: PropTypes.shape({
      hash: PropTypes.string,
    }),
  }).isRequired,
  userName: PropTypes.string.isRequired,
  defaultListImage: PropTypes.string,
  permlink: PropTypes.string,
  hideBreadCrumbs: PropTypes.bool,
  locale: PropTypes.string.isRequired,
  setNestedObject: PropTypes.func,
  intl: PropTypes.arrayOf(PropTypes.shape({ formatMessage: PropTypes.func })).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
  isSocialProduct: PropTypes.bool,
  setBreadcrumb: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  locale: getSuitableLanguage(state),
  userName: getAuthenticatedUserName(state),
  defaultListImage: getWebsiteDefaultIconList(state),
});

const mapDispatchToProps = {
  setBreadcrumb: setBreadcrumbForChecklist,
  setNestedObject: setNestedWobject,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(Checklist)));
