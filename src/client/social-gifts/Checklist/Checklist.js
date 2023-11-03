import { withRouter } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { useSeoInfo } from '../../../hooks/useSeoInfo';
import { getSuitableLanguage } from '../../../store/reducers';
import {
  getLastPermlinksFromHash,
  getObjectAvatar,
  getObjectName,
} from '../../../common/helpers/wObjectHelper';
import {
  setBreadcrumbForChecklist,
  setNestedWobject,
} from '../../../store/wObjectStore/wobjActions';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

import { removeEmptyLines, shortenDescription, sortListItemsBy } from '../../object/wObjectHelper';
import { getHelmetIcon, getMainObj, getSiteName } from '../../../store/appStore/appSelectors';
import { login } from '../../../store/authStore/authActions';
import { getObject as getObjectState } from '../../../store/wObjectStore/wObjectSelectors';
import { getObject } from '../../../store/wObjectStore/wobjectsActions';
import CheckListView from './CheckListView';

import './Checklist.less';

const Checklist = ({
  userName,
  locale,
  history,
  match,
  setBreadcrumb,
  permlink,
  isSocialProduct,
  setNestedObject,
  wobject,
  getObjectAction,
}) => {
  const [loading, setLoading] = useState(false);
  const [listItems, setLists] = useState(
    sortListItemsBy(
      wobject?.listItems,
      isEmpty(wobject?.sortCustom) ? 'rank' : 'custom',
      wobject?.sortCustom,
    ),
  );
  const favicon = useSelector(getHelmetIcon);
  const siteName = useSelector(getSiteName);
  const mainObj = useSelector(getMainObj);
  const title = `${getObjectName(wobject)} - ${siteName}`;
  const desc = wobject?.description || mainObj?.description;
  const { firstDescrPart } = shortenDescription(desc, 200);
  const description = removeEmptyLines(firstDescrPart);
  const image = getObjectAvatar(wobject) || favicon;
  const { canonicalUrl } = useSeoInfo(true);

  useEffect(() => {
    const pathUrl =
      permlink || getLastPermlinksFromHash(history.location.hash) || match.params.name;

    if (wobject?.author_permlink !== pathUrl) {
      setLoading(true);
    }

    getObjectAction(pathUrl, userName, locale).then(res => {
      const wObject = res?.value;

      if (wObject?.object_type === 'list' && window.gtag) {
        window.gtag('event', getObjectName(wObject), { debug_mode: true });
      }
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

  return (
    <React.Fragment>
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="description" content={description} />
        <meta name="twitter:card" content={'summary_large_image'} />
        <meta name="twitter:site" content={'@waivio'} />
        <meta name="twitter:title" content={title} />
        <meta name="author" content={wobject?.creator} />
        <meta name="wobject-title" content={wobject?.title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={image} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content={siteName} />
        <link rel="image_src" href={image} />
        <link id="favicon" rel="icon" href={favicon} type="image/x-icon" />
      </Helmet>
      <CheckListView wobject={wobject} listItems={listItems} loading={loading} />
    </React.Fragment>
  );
};

Checklist.propTypes = {
  history: PropTypes.shape({
    location: PropTypes.shape({
      hash: PropTypes.string,
    }),
  }).isRequired,
  wobject: PropTypes.shape({
    object_type: PropTypes.string,
    description: PropTypes.string,
    creator: PropTypes.string,
    title: PropTypes.string,
    author_permlink: PropTypes.string,
    background: PropTypes.string,
    sortCustom: PropTypes.shape({
      include: PropTypes.arrayOf(PropTypes.string),
    }),
    listItems: PropTypes.arrayOf(),
  }).isRequired,
  userName: PropTypes.string,
  permlink: PropTypes.string,
  locale: PropTypes.string.isRequired,
  setNestedObject: PropTypes.func,
  getObjectAction: PropTypes.func,
  intl: PropTypes.shape({ formatMessage: PropTypes.func }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
  isSocialProduct: PropTypes.bool,
  setBreadcrumb: PropTypes.func.isRequired,
};

Checklist.fetchData = ({ store, match, query }) => {
  const objName = query ? query.get('currObj') : match.params.name;

  return store.dispatch(login()).then(res => store.dispatch(getObject(objName, res?.value?.name)));
};

const mapStateToProps = state => ({
  locale: getSuitableLanguage(state),
  userName: getAuthenticatedUserName(state),
  wobject: getObjectState(state),
});

const mapDispatchToProps = {
  setBreadcrumb: setBreadcrumbForChecklist,
  setNestedObject: setNestedWobject,
  getObjectAction: getObject,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(Checklist)));
