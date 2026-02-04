import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { has } from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { formColumnsField } from '../../../common/constants/listOfFields';
import { getLastPermlinksFromHash } from '../../../common/helpers/wObjectHelper';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getUsedLocale } from '../../../store/appStore/appSelectors';
import Loading from '../../components/Icon/Loading';
import { getObject } from '../../../waivioApi/ApiClient';
import { setNestedWobject } from '../../../store/wObjectStore/wobjActions';
import CatalogBreadcrumb from '../Catalog/CatalogBreadcrumb/CatalogBreadcrumb';

const WidgetPage = props => {
  const [nestedWobject, setNestedWobj] = useState();
  const { wobject } = props;
  const userName = useSelector(getAuthenticatedUserName);
  const locale = useSelector(getUsedLocale);
  const dispatch = useDispatch();
  const hash = useHistory().location.hash;
  const nestedObjPermlink = getLastPermlinksFromHash(hash);
  const currentWobject = hash ? nestedWobject : wobject;
  const widgetForm = currentWobject?.widget && JSON.parse(currentWobject?.widget);
  const newTabColumn = widgetForm?.column === formColumnsField.newTab;

  useEffect(() => {
    if (nestedObjPermlink) {
      getObject(nestedObjPermlink, userName, locale).then(wobj => {
        dispatch(setNestedWobject(wobj));
        setNestedWobj(wobj);
      });
    }
  }, [hash]);

  if (!has(currentWobject, 'widget')) {
    return (
      <>
        {hash && <CatalogBreadcrumb wobject={wobject} intl={props.intl} />}
        <div role="presentation" className="Threads__row justify-center">
          <FormattedMessage id="empty_widget" defaultMessage="This widget is empty" />
        </div>
      </>
    );
  }

  if (!widgetForm?.content) {
    return <Loading />;
  }

  if (newTabColumn)
    return (
      <div className="feed_empty">
        <p>
          This widget opens in a new tab. Click the{' '}
          <a href={widgetForm.content} target="_blank" rel="noopener noreferrer">
            link
          </a>{' '}
          to continue.
        </p>
      </div>
    );

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
      {hash && <CatalogBreadcrumb wobject={wobject} intl={props.intl} />}
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
  intl: PropTypes.shape(),
};

WidgetPage.defaultProps = {
  widgetForm: {},
};

export default injectIntl(WidgetPage);
