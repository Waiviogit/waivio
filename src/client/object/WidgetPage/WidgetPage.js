import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { formColumnsField } from '../../../common/constants/listOfFields';

const WidgetPage = props => {
  const { wobject, widgetForm } = props;

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
      {widgetForm.column === formColumnsField.entire && (
        <Link to={`/object/${wobject.author_permlink}`} className="FormPage__back-btn">
          <FormattedMessage id="form_back" defaultMessage="Back to reviews" />
        </Link>
      )}
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
  widgetForm: PropTypes.shape(),
};

WidgetPage.defaultProps = {
  wobject: {},
  widgetForm: {},
};

export default WidgetPage;
