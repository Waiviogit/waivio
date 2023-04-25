import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Button, Form, message } from 'antd';
import { connect } from 'react-redux';
import { isEmpty, get } from 'lodash';
import {
  getWebConfiguration,
  saveWebConfiguration,
} from '../../../../../store/websiteStore/websiteActions';
import Loading from '../../../../components/Icon/Loading';
import { getAuthenticatedUserName } from '../../../../../store/authStore/authSelectors';
import { getUserLocation } from '../../../../../store/userStore/userSelectors';
import { getObjectsMap } from '../../../../../store/mapStore/mapSelectors';
import {
  getConfiguration,
  getWebsiteLoading,
} from '../../../../../store/websiteStore/websiteSelectors';
import SelectColorBlock from '../SelectColorModal/SelectColorModal';

import ConfigHeader from '../ConfigHeader/ConfigHeader';
import LogoSettings from '../LogoSettings/LogoSettings';
import BaseObjSettings from '../BaseObjSettings/BaseObjSettings';

import './WebsitesConfigurations.less';

const ShopWebsiteConfigurations = ({
  intl,
  loading,
  getWebConfig,
  match,
  config,
  saveWebConfig,
  location,
}) => {
  const [modalsState, setModalState] = useState({});
  const [openColorsModal, setOpenColorsModal] = useState('');
  const [openHeaderConfig, setOpenHeaderConfig] = useState('');
  const [image, setImage] = useState('');
  const [paramsSaving, setParamsSaving] = useState(false);
  const host = match.params.site || '';
  const mobileLogo = get(config, 'mobileLogo');
  const desktopLogo = get(config, 'desktopLogo');
  const shopSettings = get(config, 'shopSettings', {});
  const header = {
    ...{
      name: host,
      message: '',
    },
    ...get(config, 'header', {}),
  };
  const colorsList = get(config, 'colors', {});

  useEffect(() => {
    getWebConfig(host);
  }, [location.pathname]);

  const handleSubmit = param => {
    setParamsSaving(true);

    return saveWebConfig(host, param).then(() => {
      setParamsSaving(false);
      setModalState({});
      setImage('');
      setOpenColorsModal(false);
      setOpenHeaderConfig(false);

      message.success(
        intl.formatMessage({
          id: 'website_save_webconfig_success',
          defaultMessage: 'Website successfully updated',
        }),
      );
    });
  };

  const handleSubmitLogoModal = () =>
    handleSubmit({
      [modalsState.type]: image,
    });

  const handleSubmitColors = colors =>
    handleSubmit({
      colors,
    });

  const handleSubmitObjMain = obj => {
    if (!obj)
      handleSubmit({
        shopSettings: {
          type: '',
          value: '',
        },
      });

    handleSubmit({
      shopSettings: {
        type: obj.account ? 'user' : 'object',
        value: obj.account || obj.author_permlink,
      },
    });
  };

  const handleSubmitHeader = headerConfig =>
    handleSubmit({
      header: headerConfig,
    });

  const handleModalState = key => {
    setModalState({
      type: key,
      method: value => setImage(value[0].src),
    });
  };

  const closeLogoModal = () => {
    setModalState({});
    setImage('');
  };

  return (
    <React.Fragment>
      {!loading ? (
        <React.Fragment>
          <h1>
            <FormattedMessage id="website_configuration" defaultMessage="Website configuration" />
          </h1>
          <Form className="WebsitesConfigurations" id="WebsitesConfigurations">
            <Form.Item>
              <SelectColorBlock
                openColorsModal={openColorsModal}
                handleSubmitColors={handleSubmitColors}
                setOpenColorsModal={setOpenColorsModal}
                colors={colorsList}
                loading={paramsSaving}
              />
            </Form.Item>
            <Form.Item>
              <LogoSettings
                title={intl.formatMessage({
                  id: 'desktop_logo',
                  defaultMessage: 'Desktop logo',
                })}
                src={desktopLogo}
                closeLogoModal={closeLogoModal}
                onImageLoaded={modalsState.method}
                visible={!isEmpty(modalsState)}
                openModal={() => handleModalState('desktopLogo')}
                handleSubmitLogoModal={handleSubmitLogoModal}
                paramsSaving={paramsSaving}
                className={'WebsitesConfigurations__avatar WebsitesConfigurations__avatar--desktop'}
                buttonTitle={intl.formatMessage({
                  id: 'website_change_logo',
                  defaultMessage: 'Change logo',
                })}
              />
              <p>
                <FormattedMessage
                  id="desktop_logo_description"
                  defaultMessage="Desktop logo will appear on the homepage of the desktop version of the site."
                />
              </p>
            </Form.Item>
            <Form.Item>
              <LogoSettings
                title={intl.formatMessage({
                  id: 'mobile_logo',
                  defaultMessage: 'Mobile logo',
                })}
                src={mobileLogo}
                closeLogoModal={closeLogoModal}
                onImageLoaded={modalsState.method}
                visible={!isEmpty(modalsState)}
                openModal={() => handleModalState('mobileLogo')}
                handleSubmitLogoModal={handleSubmitLogoModal}
                paramsSaving={paramsSaving}
                className="WebsitesConfigurations__avatar WebsitesConfigurations__avatar--mobile"
                buttonTitle={intl.formatMessage({
                  id: 'website_change_logo',
                  defaultMessage: 'Change logo',
                })}
              />
              <p>
                <FormattedMessage
                  id="mobile_logo_description"
                  defaultMessage="Mobile logo will appear on the home page of the mobile version of the site."
                />
              </p>
            </Form.Item>
            <Form.Item>
              <h3>
                {intl.formatMessage({
                  id: 'base_object',
                  defaultMessage: 'Base object',
                })}
                :
              </h3>
              <BaseObjSettings shopSettings={shopSettings} handleSubmit={handleSubmitObjMain} />
              <p>
                <FormattedMessage
                  id="base_obj_description"
                  defaultMessage="The main menu of the website will be created using the base object."
                />
              </p>
            </Form.Item>
            <Form.Item>
              <h3>
                {intl.formatMessage({
                  id: 'website_header',
                  defaultMessage: 'Website header:',
                })}
              </h3>
              <div className="WebsitesConfigurations__headers">
                <b>{header.name}</b> | {header.message}
              </div>
              <Button type="primary" onClick={() => setOpenHeaderConfig(true)}>
                Edit
              </Button>
            </Form.Item>
          </Form>
          {openHeaderConfig && (
            <ConfigHeader
              handleSubmitConfig={handleSubmitHeader}
              config={header}
              visible={openHeaderConfig}
              onClose={() => setOpenHeaderConfig(false)}
              loading={paramsSaving}
            />
          )}
        </React.Fragment>
      ) : (
        <Loading />
      )}
    </React.Fragment>
  );
};

ShopWebsiteConfigurations.propTypes = {
  intl: PropTypes.shape().isRequired,
  config: PropTypes.arrayOf.isRequired,
  loading: PropTypes.bool.isRequired,
  getWebConfig: PropTypes.func.isRequired,
  saveWebConfig: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      site: PropTypes.string,
    }),
    path: PropTypes.string.isRequired,
  }).isRequired,
  location: PropTypes.shape().isRequired,
};

export default connect(
  state => ({
    loading: getWebsiteLoading(state),
    config: getConfiguration(state),
    userLocation: getUserLocation(state),
    wobjects: getObjectsMap(state),
    userName: getAuthenticatedUserName(state),
  }),
  {
    getWebConfig: getWebConfiguration,
    saveWebConfig: saveWebConfiguration,
  },
)(withRouter(injectIntl(ShopWebsiteConfigurations)));
