import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet/es/Helmet';
import { useLocation, useParams } from 'react-router';
import PropTypes from 'prop-types';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getHelmetIcon, getSiteName, getUsedLocale } from '../../../store/appStore/appSelectors';
import { getLastPermlinksFromHash, getObjectName } from '../../../common/helpers/wObjectHelper';
import { getObject } from '../../../waivioApi/ApiClient';
import Loading from '../../components/Icon/Loading';
import { useSeoInfo } from '../../../hooks/useSeoInfo';

const WidgetContent = ({ wobj }) => {
  const [currentWobject, setWobject] = useState();
  const userName = useSelector(getAuthenticatedUserName);
  const locale = useSelector(getUsedLocale);
  const { name } = useParams();
  const location = useLocation();
  const favicon = useSelector(getHelmetIcon);
  const siteName = useSelector(getSiteName);
  const title = `${getObjectName(currentWobject)} - ${siteName}`;
  const desc = siteName;
  const image = favicon;
  const { canonicalUrl } = useSeoInfo();
  const objName = location.hash ? getLastPermlinksFromHash(location.hash) : name;
  const widgetForm = currentWobject?.widget && JSON.parse(currentWobject?.widget);

  useEffect(() => {
    if (wobj) {
      setWobject(wobj);
      if (window.gtag) window.gtag('event', getObjectName(wobj));
    } else {
      getObject(objName, userName, locale).then(obj => {
        setWobject(obj);
        if (window.gtag) window.gtag('event', getObjectName(obj));
      });
    }
  }, [objName]);

  if (!widgetForm?.content) {
    return <Loading />;
  }

  const widgetView = widgetForm?.content?.includes('<iframe') ? (
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
      <div className="FormPage">
        {widgetForm.type === 'Widget' ? (
          widgetView
        ) : (
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
        )}
      </div>
    </React.Fragment>
  );
};

WidgetContent.propTypes = {
  wobj: PropTypes.shape(),
};

export default WidgetContent;
