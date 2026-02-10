import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button } from 'antd';
import Helmet from 'react-helmet';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../../../store/authStore/authSelectors';
import {
  getHelmetIcon,
  getSiteName,
  getUsedLocale,
  getUserAdministrator,
  getAppHost,
} from '../../../store/appStore/appSelectors';
import {
  accessTypesArr,
  getLastPermlinksFromHash,
  getObjectAvatar,
  getObjectName,
  getTitleForLink,
  hasDelegation,
  haveAccess,
} from '../../../common/helpers/wObjectHelper';
import { getObject } from '../../../store/wObjectStore/wobjectsActions';
import {
  getHideHeaderFromWobj,
  getObject as getObjectState,
} from '../../../store/wObjectStore/wObjectSelectors';
// import { getObject } from '../../../waivioApi/ApiClient';
import { useSeoInfoWithAppUrl } from '../../../hooks/useSeoInfo';
import { setEditMode } from '../../../store/wObjectStore/wobjActions';
import { formColumnsField } from '../../../common/constants/listOfFields';
import Loading from '../../components/Icon/Loading';

import './WidgetContent.less';

const WidgetContent = ({ wobj, intl }) => {
  const [loading, setLoading] = useState(false);
  const userName = useSelector(getAuthenticatedUserName);
  const locale = useSelector(getUsedLocale);
  const { name } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const favicon = useSelector(getHelmetIcon);
  const currentWobject = useSelector(getObjectState);
  const siteName = useSelector(getSiteName);
  const username = useSelector(getAuthenticatedUserName);
  const authenticated = useSelector(getIsAuthenticated);
  const isAdministrator = useSelector(getUserAdministrator);
  const appHost = useSelector(getAppHost);
  const accessExtend =
    (haveAccess(wobj || currentWobject, username, accessTypesArr[0]) && isAdministrator) ||
    hasDelegation(wobj || currentWobject, username);
  const title = getTitleForLink(currentWobject);
  const { canonicalUrl, descriptionSite } = useSeoInfoWithAppUrl(currentWobject.canonical);
  const desc = currentWobject?.description || descriptionSite || siteName;
  const image = getObjectAvatar(currentWobject) || favicon;
  const objName = location.hash ? getLastPermlinksFromHash(location.hash) : name;
  const widgetForm = currentWobject?.widget && JSON.parse(currentWobject?.widget);
  const editObjectClick = () => {
    dispatch(setEditMode(true));
  };
  const isActiveCamp = widgetForm?.content?.includes('/active-campaigns?display=widget');
  const hideHeader = useSelector(getHideHeaderFromWobj);
  const newTabColumn = widgetForm?.column === formColumnsField.newTab;

  useEffect(() => {
    if (newTabColumn && widgetForm?.content && typeof window !== 'undefined') {
      window.open(widgetForm.content, '_self');
    }
  }, [newTabColumn, widgetForm?.content]);

  useEffect(() => {
    setLoading(true);
    if (!wobj && wobj.author_permlink !== objName) {
      getObject(objName, userName, locale).then(obj => {
        setLoading(false);
        if (typeof window !== 'undefined' && window.gtag)
          window.gtag('event', getObjectName(obj), { debug_mode: false });
      });
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  }, [objName, wobj.author_permlink]);

  const widgetView = () => {
    if (loading) return <Loading />;
    if (newTabColumn) return null;
    if (!widgetForm) {
      return (
        <div className="Checklist">
          <div className={'Checklist__empty'}>
            <span>
              {intl.formatMessage({
                id: 'empty_widget',
                defaultMessage: 'This widget is empty',
              })}
            </span>
          </div>
        </div>
      );
    }

    if (widgetForm.type === 'Widget')
      return widgetForm?.content?.includes('<iframe') ? (
        // eslint-disable-next-line react/no-danger
        <div className="FormPage__block" dangerouslySetInnerHTML={{ __html: widgetForm.content }} />
      ) : (
        <>
          <iframe
            srcDoc={widgetForm.content}
            title={widgetForm.title}
            width="100%"
            style={{
              height: '100vh',
            }}
          />
        </>
      );

    const createUrl = () => {
      if (isActiveCamp) {
        return `${widgetForm.content}&host=${appHost}`;
      }

      return widgetForm.content;
    };

    return (
      <div className={'FormPage__block'}>
        <iframe
          src={createUrl()}
          width="100%"
          height="100%"
          allowFullScreen
          title={widgetForm.title}
          frameBorder="0"
          allowTransparency
          // allowScriptaccess="always"
        />
      </div>
    );
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="description" content={desc} />
        <meta name="twitter:card" content={'summary_large_image'} />
        <meta name="twitter:site" content={`@${siteName}`} />
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
      {accessExtend && authenticated && !hideHeader && (
        <div className="FeedMasonry__edit-container">
          <Button onClick={editObjectClick}>
            {intl.formatMessage({ id: 'edit', defaultMessage: 'Edit' })}
          </Button>
        </div>
      )}
      <div className="FormPage">{widgetView()}</div>
    </React.Fragment>
  );
};

WidgetContent.propTypes = {
  wobj: PropTypes.shape(),
  intl: PropTypes.shape(),
};

export default injectIntl(WidgetContent);
