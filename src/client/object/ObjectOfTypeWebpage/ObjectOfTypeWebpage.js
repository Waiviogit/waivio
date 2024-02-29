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
import { getObject } from '../../../waivioApi/ApiClient';
import { colorPickerPlugin } from './colorPickerPlugin';
import { getIsEditMode } from '../../../store/wObjectStore/wObjectSelectors';
import { objectFields } from '../../../common/constants/listOfFields';
import {
  getLastPermlinksFromHash,
  getObjectAvatar,
  getObjectName,
} from '../../../common/helpers/wObjectHelper';
import { setNestedWobject } from '../../../store/wObjectStore/wobjActions';
import AppendWebpageModal from './AppendWebpageModal';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import {
  getHelmetIcon,
  getIsSocial,
  getSiteName,
  getUsedLocale,
} from '../../../store/appStore/appSelectors';
import customVideoPlugin from './videoPlugin';

import './ObjectOfTypeWebpage.less';
import CatalogBreadcrumb from '../Catalog/CatalogBreadcrumb/CatalogBreadcrumb';
import Loading from '../../components/Icon/Loading';
import { useSeoInfoWithAppUrl } from '../../../hooks/useSeoInfo';
import DEFAULTS from '../const/defaultValues';

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

const ObjectOfTypeWebpage = ({ intl }) => {
  const history = useHistory();
  const { name } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(getAuthenticatedUserName);
  const locale = useSelector(getUsedLocale);
  const authorPermlink = history?.location.hash
    ? getLastPermlinksFromHash(history?.location.hash)
    : name;
  const [wobject, setWobject] = useState({});
  const [currentValue, setCurrentValue] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const isEditMode = useSelector(getIsEditMode);
  const jsonVal = currentValue ? JSON.stringify(currentValue) : null;
  const siteLink = location && `${location?.origin}/`;
  const isSocial = useSelector(getIsSocial);
  const title = `${wobject.name}`;
  const description = `${wobject.description || ''} ${wobject.name}`;
  const { canonicalUrl } = useSeoInfoWithAppUrl(wobject.canonical);
  const siteImage = getObjectAvatar(wobject) || DEFAULTS.AVATAR;
  const siteName = useSelector(getSiteName);
  const helmetIcon = useSelector(getHelmetIcon);

  useEffect(() => {
    setLoading(true);
    getObject(authorPermlink, user, locale).then(res => {
      setWobject(res);
      if (has(res, 'webpage')) {
        const jsonString = isSocial
          ? res.webpage?.replace(/https:\/\/www\.waivio\.com\//g, siteLink)
          : res.webpage;

        setCurrentValue(JSON.parse(jsonString));
        dispatch(setNestedWobject(res));
      }
      setLoading(false);
    });
  }, [authorPermlink]);

  if (((isNil(currentValue) && !loading) || currentValue?.rows.length < 1) && !isEditMode) {
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
        <div className={isEditMode ? 'ObjectOfTypeWebpage margin' : 'ObjectOfTypeWebpage'}>
          {!isEditMode && history?.location.hash && (
            <CatalogBreadcrumb wobject={wobject} intl={intl} />
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
              objName={getObjectName(wobject)}
              wObject={wobject}
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
