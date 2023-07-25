import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router';
import PropTypes from 'prop-types';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getUsedLocale } from '../../../store/appStore/appSelectors';
import { getLastPermlinksFromHash } from '../../../common/helpers/wObjectHelper';
import { getObject } from '../../../waivioApi/ApiClient';
import Loading from '../../components/Icon/Loading';

const WidgetContent = ({ wobj }) => {
  const [currentWobject, setWobject] = useState();
  const userName = useSelector(getAuthenticatedUserName);
  const locale = useSelector(getUsedLocale);
  const { name } = useParams();
  const location = useLocation();
  const objName = location.hash ? getLastPermlinksFromHash(location.hash) : name;
  const widgetForm = currentWobject?.widget && JSON.parse(currentWobject?.widget);

  useEffect(() => {
    if (wobj) {
      setWobject(wobj);
    } else {
      getObject(objName, userName, locale).then(obj => setWobject(obj));
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
  );
};

WidgetContent.propTypes = {
  wobj: PropTypes.shape(),
};

export default WidgetContent;
