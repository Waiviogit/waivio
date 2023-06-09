import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { getLastPermlinksFromHash } from '../../../common/helpers/wObjectHelper';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getUsedLocale } from '../../../store/appStore/appSelectors';
import Loading from '../../components/Icon/Loading';
import { getObject } from '../../../waivioApi/ApiClient';

const WidgetPage = props => {
  const [nestedWobject, setNestedWobject] = useState();
  const { wobject } = props;
  const userName = useSelector(getAuthenticatedUserName);
  const locale = useSelector(getUsedLocale);
  const hash = useHistory().location.hash;
  const nestedObjPermlink = getLastPermlinksFromHash(hash);
  const currentWobject = hash ? nestedWobject : wobject;
  const widgetForm = currentWobject?.widget && JSON.parse(currentWobject?.widget);

  useEffect(() => {
    if (nestedObjPermlink) {
      getObject(nestedObjPermlink, userName, locale).then(wobj => setNestedWobject(wobj));
    }
  }, [hash]);

  if (!widgetForm?.content) {
    return <Loading />;
  }

  const widgetView = widgetForm?.content?.includes('<iframe') ? (
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

WidgetPage.propTypes = {
  wobject: PropTypes.shape(),
};

WidgetPage.defaultProps = {
  widgetForm: {},
};

export default WidgetPage;
