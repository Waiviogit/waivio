import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getHelmetIcon, getSiteName, getUsedLocale } from '../../../store/appStore/appSelectors';
import {
  getLastPermlinksFromHash,
  getObjectAvatar,
  getObjectName,
} from '../../../common/helpers/wObjectHelper';
import { getObject } from '../../../waivioApi/ApiClient';
import Loading from '../../components/Icon/Loading';
import { useSeoInfoWithAppUrl } from '../../../hooks/useSeoInfo';

const WidgetContent = ({ wobj }) => {
  const [currentWobject, setWobject] = useState(wobj);
  const userName = useSelector(getAuthenticatedUserName);
  const locale = useSelector(getUsedLocale);
  const { name } = useParams();
  const location = useLocation();
  const favicon = useSelector(getHelmetIcon);
  const siteName = useSelector(getSiteName);
  const title = `${getObjectName(currentWobject)}`;
  const { canonicalUrl, descriptionSite } = useSeoInfoWithAppUrl(currentWobject.canonical);
  const desc = currentWobject?.description || descriptionSite || siteName;
  const image = getObjectAvatar(currentWobject) || favicon;
  const objName = location.hash ? getLastPermlinksFromHash(location.hash) : name;
  const widgetForm = currentWobject?.widget && JSON.parse(currentWobject?.widget);

  useEffect(() => {
    if (wobj) {
      setWobject(wobj);
      if (typeof window !== 'undefined' && window.gtag)
        window.gtag('event', getObjectName(wobj), { debug_mode: false });
    } else {
      getObject(objName, userName, locale).then(obj => {
        setWobject(obj);
        if (typeof window !== 'undefined' && window.gtag)
          window.gtag('event', getObjectName(obj), { debug_mode: false });
      });
    }
  }, [objName]);

  const widgetView = () => {
    if (!widgetForm?.content) return <Loading margin />;

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

    return (
      <div className="FormPage__block">
        <iframe
          src={widgetForm.content}
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
      <div className="FormPage">{widgetView()}</div>
    </React.Fragment>
  );
};

WidgetContent.propTypes = {
  wobj: PropTypes.shape(),
};

export default WidgetContent;
