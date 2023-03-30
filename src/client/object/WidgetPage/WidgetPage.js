import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { getWobjectNested } from '../../../store/wObjectStore/wObjectSelectors';

const WidgetPage = props => {
  const nestedWobject = useSelector(getWobjectNested);
  const { wobject } = props;
  const hash = useHistory().location.hash;
  const currentWobject = hash ? nestedWobject : wobject;
  const widgetForm = currentWobject?.widget && JSON.parse(currentWobject?.widget);

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
