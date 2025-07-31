import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Button, Form, Icon, message, Modal } from 'antd';
import { connect } from 'react-redux';
import { isEmpty, get } from 'lodash';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

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
import BaseObjSettings from '../BaseObjSettings/BaseObjSettings';
import ImageSetter from '../../../../components/ImageSetter/ImageSetter';
import SearchObjectsAutocomplete from '../../../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectAvatar from '../../../../components/ObjectAvatar';
import {
  getObjectName,
  getObjectType,
  getObjectUrlForLink,
} from '../../../../../common/helpers/wObjectHelper';

import './WebsitesConfigurations.less';
import AvatarComp from './AvatarComp';
import { userMenuTabsList } from '../../../../social-gifts/Header/TopNavigation/WebsiteTopNavigation';

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
  const defaultHashtag = get(config, 'defaultHashtag', null);
  const [image, setImage] = useState('');
  const [paramsSaving, setParamsSaving] = useState(false);
  const classListHeaderConfig = classNames('WebsitesConfigurations__headers', {
    'WebsitesConfigurations__headers--upperCase': !config?.header?.name,
  });
  const host = match.params.site || '';
  const mobileLogo = get(config, 'mobileLogo');
  const tabsFilter = get(config, 'tabsFilter', []);
  const tabsSorting = get(config, 'tabsSorting', userMenuTabsList);
  const banner = get(config, 'mainBanner');
  const listDefaultImage = get(config, 'defaultListImage');
  const desktopLogo = get(config, 'desktopLogo');
  const shopSettings = get(config, 'shopSettings', {});
  const disabled = isEmpty(image);
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
  const handleSubmitTabFilters = (filters, sortedTabs) =>
    handleSubmit({
      tabsFilter: filters,
      tabsSorting: sortedTabs,
    });

  const handleSubmitObjMain = obj => {
    if (!obj)
      handleSubmit({
        shopSettings: {
          type: '',
          value: '',
        },
        tabsFilter: [],
      });

    handleSubmit({
      shopSettings: {
        type: obj.account ? 'user' : 'object',
        value: obj.account || obj.author_permlink,
      },
      tabsFilter: [],
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
          <Form className="WebsitesConfigurations center" id="WebsitesConfigurations">
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
              <h3>
                {intl.formatMessage({
                  id: 'desktop_logo',
                  defaultMessage: 'Desktop logo',
                })}
              </h3>
              <div className="Settings__profile-image">
                <AvatarComp link={desktopLogo} />
                <Button type="primary" onClick={() => handleModalState('desktopLogo')}>
                  {intl.formatMessage({
                    id: 'website_change_logo',
                    defaultMessage: 'Change logo',
                  })}
                </Button>
              </div>
              <p>
                <FormattedMessage
                  id="desktop_logo_description"
                  defaultMessage="Desktop logo will appear on the homepage of the desktop version of the site."
                />
              </p>
            </Form.Item>
            <Form.Item>
              <h3>
                {intl.formatMessage({
                  id: 'mobile_logo',
                  defaultMessage: 'Mobile logo',
                })}
              </h3>
              <div className="Settings__profile-image">
                <AvatarComp link={mobileLogo} />
                <Button type="primary" onClick={() => handleModalState('mobileLogo')}>
                  {intl.formatMessage({
                    id: 'website_change_logo',
                    defaultMessage: 'Change logo',
                  })}
                </Button>
              </div>
              <p>
                <FormattedMessage
                  id="mobile_logo_description"
                  defaultMessage="Mobile logo will appear on the home page of the mobile version of the site."
                />
              </p>
            </Form.Item>{' '}
            <Form.Item>
              <h3>
                {intl.formatMessage({
                  id: 'list_default image',
                  defaultMessage: 'List default image',
                })}
              </h3>
              <div className="Settings__profile-image">
                <AvatarComp link={listDefaultImage} />
                <Button type="primary" onClick={() => handleModalState('defaultListImage')}>
                  {intl.formatMessage({
                    id: 'website_change_image',
                    defaultMessage: 'Change image',
                  })}
                </Button>
              </div>
              <p>
                <FormattedMessage
                  id="list_default_image_description"
                  defaultMessage="List default image will be displayed for those lists that don't have an avatar."
                />
              </p>
            </Form.Item>{' '}
            <Form.Item>
              <h3>
                {intl.formatMessage({
                  id: 'main_banner',
                  defaultMessage: 'Main banner',
                })}
              </h3>
              <div className={!banner ? 'Settings__profile-image' : ''}>
                <AvatarComp link={banner} isBanner />
                <Button type="primary" onClick={() => handleModalState('mainBanner')}>
                  {intl.formatMessage({
                    id: 'website_change_banner',
                    defaultMessage: 'Change banner',
                  })}
                </Button>
              </div>
              <p>
                <FormattedMessage
                  id="banner_description"
                  defaultMessage="Main banner will be displayed at the top of all website pages."
                />
              </p>
            </Form.Item>{' '}
            <Form.Item>
              <h3>
                {intl.formatMessage({
                  id: 'base_object',
                  defaultMessage: 'Base object',
                })}
                :
              </h3>
              <BaseObjSettings
                tabsSorting={tabsSorting}
                handleSubmitTabFilters={handleSubmitTabFilters}
                tabsFilter={tabsFilter}
                hideActions
                shopSettings={shopSettings}
                handleSubmit={handleSubmitObjMain}
              />
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
                  id: 'default_hashtag',
                  defaultMessage: 'Default hashtag',
                })}
                :
              </h3>
              {!isEmpty(defaultHashtag) ? (
                <div>
                  <div className="BaseObjSettings__searchCard">
                    <Link
                      to={getObjectUrlForLink(defaultHashtag)}
                      className="BaseObjSettings__content"
                    >
                      <ObjectAvatar item={defaultHashtag} size={40} />
                      <span className="BaseObjSettings__name">{getObjectName(defaultHashtag)}</span>
                    </Link>
                    <b className="BaseObjSettings__type">{getObjectType(defaultHashtag)} </b>
                    {paramsSaving ? (
                      <Icon type={'loading'} />
                    ) : (
                      <span
                        className="BaseObjSettings__clear"
                        onClick={() => {
                          handleSubmit({
                            defaultHashtag: null,
                          });
                        }}
                      >
                        <Icon type="close-circle" />
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <SearchObjectsAutocomplete
                  placeholder={intl.formatMessage({
                    id: 'find_object',
                    defaultMessage: 'Find object',
                  })}
                  handleSelect={u => {
                    handleSubmit({
                      defaultHashtag: u.author_permlink,
                    });
                  }}
                  objectType={'hashtag'}
                  autoFocus={false}
                />
              )}
              <p>
                <FormattedMessage
                  id="default_tag_description"
                  defaultMessage="This hashtag will be recommended for all new posts on the website, ensuring that they consistently appear in the website's custom newsfeed."
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
              <div className={classListHeaderConfig}>{header.name}</div>
              <Button type="primary" onClick={() => setOpenHeaderConfig(true)}>
                {intl.formatMessage({
                  id: 'edit',
                  defaultMessage: 'Edit',
                })}
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
              withioutMessage
            />
          )}
        </React.Fragment>
      ) : (
        <Loading />
      )}
      <Modal
        wrapClassName="Settings__modal"
        title={`Choose image`}
        closable
        onCancel={closeLogoModal}
        onOk={handleSubmitLogoModal}
        visible={!isEmpty(modalsState)}
        okButtonProps={{
          loading: paramsSaving,
          disabled,
        }}
      >
        {!isEmpty(modalsState) && (
          <ImageSetter
            isEditable={['mobileLogo', 'desktopLogo'].includes(modalsState.type)}
            autoFocus
            isDesktop={['desktopLogo'].includes(modalsState.type)}
            onImageLoaded={modalsState.method}
            isRequired
            isMultiple={false}
            clearImage={() => setImage('')}
          />
        )}
      </Modal>
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
