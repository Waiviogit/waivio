import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'antd';
import { injectIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router';
import { has, isNil } from 'lodash';
import Editor from '@react-page/editor';
import slate from '@react-page/plugins-slate';
import image from '@react-page/plugins-image';
import background from '@react-page/plugins-background';
import spacer from '@react-page/plugins-spacer';
import divider from '@react-page/plugins-divider';
import { parseJSON } from '../../../common/helpers/parseJSON';
import { getObject } from '../../../waivioApi/ApiClient';
import { colorPickerPlugin } from './colorPickerPlugin';
import {
  getIsEditMode,
  getWobjectNested,
  getObject as getObjectState,
} from '../../../store/wObjectStore/wObjectSelectors';
import { objectFields } from '../../../common/constants/listOfFields';
import {
  accessTypesArr,
  getLastPermlinksFromHash,
  getObjectAvatar,
  getObjectName,
  getTitleForLink,
  hasDelegation,
  haveAccess,
} from '../../../common/helpers/wObjectHelper';
import { setEditMode, setNestedWobject } from '../../../store/wObjectStore/wobjActions';
import AppendWebpageModal from './AppendWebpageModal';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../../../store/authStore/authSelectors';
import {
  getHelmetIcon,
  getIsSocial,
  getSiteName,
  getUsedLocale,
  getUserAdministrator,
} from '../../../store/appStore/appSelectors';
import customVideoPlugin from './videoPlugin';
import CatalogBreadcrumb from '../Catalog/CatalogBreadcrumb/CatalogBreadcrumb';
import Loading from '../../components/Icon/Loading';
import { useSeoInfoWithAppUrl } from '../../../hooks/useSeoInfo';
import DEFAULTS from '../const/defaultValues';
import './ObjectOfTypeWebpage.less';

const customSlate = slate(config => ({
  ...config,
  plugins: {
    ...config.plugins,
    color: {
      colorPicker: colorPickerPlugin,
    },
  },
}));

const plugins = [customSlate, image, background(), customVideoPlugin, spacer, divider];

const getWebpageJson = (obj, isSocial) => {
  const siteLink = typeof location !== 'undefined' && `${location?.origin}/`;

  return parseJSON(
    isSocial ? obj.webpage?.replace(/https:\/\/www\.waivio\.com\//g, siteLink) : obj.webpage,
  );
};
const ObjectOfTypeWebpage = ({ intl }) => {
  const history = useHistory();
  const { name } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(getAuthenticatedUserName);
  const nestedWobject = useSelector(getWobjectNested);
  const wobject = useSelector(getObjectState);
  const authenticated = useSelector(getIsAuthenticated);
  const isAdministrator = useSelector(getUserAdministrator);
  const accessExtend =
    (haveAccess(wobject, user, accessTypesArr[0]) && isAdministrator) ||
    hasDelegation(wobject, user);
  const isEditMode = useSelector(getIsEditMode);
  const isSocial = useSelector(getIsSocial);
  const siteName = useSelector(getSiteName);
  const helmetIcon = useSelector(getHelmetIcon);
  const locale = useSelector(getUsedLocale);
  const currObj = history?.location.hash ? nestedWobject : wobject;
  const [currentValue, setCurrentValue] = useState(getWebpageJson(currObj, isSocial));
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const jsonVal = currentValue ? JSON.stringify(currentValue) : null;
  const title = getTitleForLink(currObj);
  const description = `${currObj.description || ''} ${currObj.name}`;
  const { canonicalUrl } = useSeoInfoWithAppUrl(currObj.canonical);
  const siteImage = getObjectAvatar(currObj) || DEFAULTS.AVATAR;

  useEffect(() => {
    if (history?.location.hash) {
      const pathUrl = getLastPermlinksFromHash(history?.location.hash);

      setLoading(true);
      getObject(pathUrl, user, locale).then(res => {
        if (has(res, 'webpage')) {
          setCurrentValue(getWebpageJson(res, isSocial));
          dispatch(setNestedWobject(res));
        }
        setLoading(false);
      });
    }
  }, [history.location.hash, name]);
  const editObjectClick = () => {
    dispatch(setEditMode(true));
  };

  if (((isNil(currentValue) && !loading) || currentValue?.rows?.length < 1) && !isEditMode) {
    return (
      <React.Fragment>
        <div className="ObjectOfTypeWebpage__empty-placeholder">
          <span>
            {intl.formatMessage({
              id: 'empty_webpage_content',
              defaultMessage: 'This webpage has no content. Click Edit to start.',
            })}
          </span>
        </div>
      </React.Fragment>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={siteImage} />
        <meta property="og:image:url" content={siteImage} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:description" content={description} />
        <meta name="twitter:card" content={siteImage ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:site" content={`@${siteName}`} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" property="twitter:image" content={siteImage} />
        <meta property="og:site_name" content={siteName} />
        <link rel="image_src" href={siteImage} />
        <link id="favicon" rel="icon" href={helmetIcon} type="image/x-icon" />
      </Helmet>
      <div className={isSocial ? 'SitesWebpage' : ''}>
        {isSocial && !isEditMode && accessExtend && authenticated && (
          <div className="SitesWebpage__edit-container">
            <Button onClick={editObjectClick}>
              {intl.formatMessage({ id: 'edit', defaultMessage: 'Edit' })}
            </Button>
          </div>
        )}
        <div className={isEditMode ? 'ObjectOfTypeWebpage margin' : 'ObjectOfTypeWebpage'}>
          {!isEditMode && history?.location.hash && (
            <CatalogBreadcrumb wobject={currObj} intl={intl} />
          )}
          {loading ? (
            <Loading />
          ) : (
            <Editor
              readOnly={!isEditMode || showModal}
              cellPlugins={plugins}
              value={currentValue}
              onChange={newValue => setCurrentValue(newValue)}
            />
          )}
          {isEditMode && (
            <div className="object-of-type-page__row align-center">
              <Button
                htmlType="button"
                // disabled={isNil(currentValue)}
                onClick={() => setShowModal(true)}
                size="large"
                className={'ready-to-publish-btn'}
              >
                {intl.formatMessage({ id: 'ready_to_publish', defaultMessage: 'Ready to publish' })}
              </Button>
            </div>
          )}
          {showModal && (
            <AppendWebpageModal
              objName={getObjectName(currObj)}
              wObject={currObj}
              showModal={showModal}
              hideModal={() => setShowModal(false)}
              webpageBody={jsonVal}
              field={objectFields.webpage}
            />
          )}
        </div>
      </div>
    </>
  );
};

ObjectOfTypeWebpage.propTypes = {
  intl: PropTypes.shape(),
};

export default injectIntl(ObjectOfTypeWebpage);
