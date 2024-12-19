import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty, get, throttle, debounce } from 'lodash';
import { connect } from 'react-redux';
import { Transforms } from 'slate';
import { injectIntl, FormattedMessage } from 'react-intl';
import filesize from 'filesize';
import { Form, Input, Avatar, Button, Modal, message } from 'antd';
import moment from 'moment';
import { updateAuthProfile, updateProfile } from '../../store/authStore/authActions';
import { MAXIMUM_UPLOAD_SIZE } from '../../common/helpers/image';
import { getMetadata } from '../../common/helpers/postingMetadata';
import { ACCOUNT_UPDATE } from '../../common/constants/accountHistory';
import { remarkable } from '../components/Story/Body';
import BodyContainer from '../containers/Story/BodyContainer';
import Action from '../components/Button/Action';
import requiresLogin from '../auth/requiresLogin';
import ImageSetter from '../components/ImageSetter/ImageSetter';
import { getGuestAvatarUrl } from '../../waivioApi/ApiClient';
import { getAvatarURL } from '../components/Avatar';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  isGuestUser,
} from '../../store/authStore/authSelectors';
import { getUser } from '../../store/usersStore/usersSelectors';
import EditorSlate from '../components/EditorExtended/editorSlate';
import { checkCursorInSearchSlate } from '../../common/helpers/editorHelper';
import { getObjectName, getObjectType } from '../../common/helpers/wObjectHelper';
import objectTypes from '../object/const/objectTypes';
import { getObjectUrl } from '../../common/helpers/postHelpers';
import { insertObject } from '../components/EditorExtended/util/SlateEditor/utils/common';
import { editorStateToMarkdownSlate } from '../components/EditorExtended/util/editorStateToMarkdown';
import { getSelection, getSelectionRect } from '../components/EditorExtended/util';
import { setCursorCoordinates } from '../../store/slateEditorStore/editorActions';
import { searchObjectsAutoCompete } from '../../store/searchStore/searchActions';
import SocialInputs from './SocialInputs/SocialInputs';
import './Settings.less';

const FormItem = Form.Item;

@requiresLogin
@injectIntl
@connect(
  state => ({
    user: {
      ...getAuthenticatedUser(state),
      ...getUser(state, getAuthenticatedUserName(state)),
    },
    isGuest: isGuestUser(state),
  }),
  {
    updateProfile,
    updateAuthProfile,
    setCursorCoordinates,
    searchObjectsAutoCompete,
  },
)
@Form.create()
export default class ProfileSettings extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    userName: PropTypes.string,
    isGuest: PropTypes.bool,
    updateProfile: PropTypes.func,
    updateAuthProfile: PropTypes.func,
    setCursorCoordinates: PropTypes.func,
    searchObjectsAutoCompete: PropTypes.func,
    user: PropTypes.shape(),
    history: PropTypes.shape(),
  };

  static defaultProps = {
    onImageUpload: () => {},
    onImageInvalid: () => {},
    userName: '',
    user: {},
    history: {},
    isGuest: false,
    updateProfile: () => {},
    updateAuthProfile: () => {},
  };

  constructor(props) {
    super(props);

    const metadata = getMetadata(props.user);

    this.state = {
      bodyHTML: '',
      profileData: get(metadata, ['profile'], {}),
      profilePicture: `${getAvatarURL(props.userName)}?${moment(
        this.props.user.updatedAt || this.props.user.last_account_update,
      ).unix()}`,
      coverPicture: get(metadata, ['profile', 'cover_image'], ''),
      isModal: false,
      isLoadingImage: false,
      avatarImage: [],
      coverImage: [],
      isCover: false,
      isAvatar: false,
      lastAccountUpdate: moment(props.user.updatedAt).unix(),
      isLoading: false,
      errors: {},
    };

    this.handleSignatureChange = this.handleSignatureChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderBody = this.renderBody.bind(this);
  }

  setShowEditorSearch = isShowEditorSearch => {
    this.setState({ isShowEditorSearch });
  };

  debouncedSearch = debounce(
    searchStr => this.props.searchObjectsAutoCompete(searchStr, '', null, true),
    150,
  );

  handleContentChangeSlate = debounce(editor => {
    const searchInfo = checkCursorInSearchSlate(editor);

    if (searchInfo.isNeedOpenSearch) {
      if (typeof window !== 'undefined') {
        if (!this.state.isShowEditorSearch) {
          const nativeSelection = getSelection(window);
          const selectionBoundary = getSelectionRect(nativeSelection);

          this.props.setCursorCoordinates({
            selectionBoundary,
            selectionState: editor.selection,
            searchString: searchInfo.searchString,
          });
          this.setShowEditorSearch(true);
        }
      }
      this.debouncedSearch(searchInfo.searchString);
    } else if (this.state.isShowEditorSearch) {
      this.setShowEditorSearch(false);
    }
  }, 350);

  handleSignatureChange(body) {
    throttle(this.renderBody, 200, { leading: false, trailing: true })(
      editorStateToMarkdownSlate(body.children),
    );

    this.handleContentChangeSlate(body);
  }

  setSettingsFields = () => {
    // eslint-disable-next-line no-shadow
    const { form, isGuest, userName, user, updateProfile, updateAuthProfile, intl } = this.props;
    const { avatarImage, coverImage, profileData, bodyHTML } = this.state;
    const isChangedAvatar = !!avatarImage.length;
    const isChangedCover = !!coverImage.length;
    const isChangedSingature = Boolean(bodyHTML);

    if (!form.isFieldsTouched() && !isChangedAvatar && !isChangedCover && !isChangedSingature)
      return;

    form.validateFields((err, values) => {
      if (!err) {
        const cleanValues = Object.keys(values)
          .filter(
            field =>
              form.isFieldTouched(field) ||
              (field === 'profile_image' && isChangedAvatar) ||
              field === 'signature' ||
              (field === 'cover_image' && isChangedCover),
          )
          .reduce((a, b) => {
            let value = values[b] || '';

            if (b === 'signature') value = editorStateToMarkdownSlate(this.editor?.children);
            if (b === 'cover_image' && isChangedCover) value = coverImage[0]?.src;
            if (b === 'profile_image' && isChangedAvatar) value = avatarImage[0]?.src;

            return {
              ...a,
              [b]: value,
            };
          }, {});

        if (isGuest) {
          updateProfile(userName, cleanValues)
            .then(data => {
              if (isChangedAvatar || isChangedCover || data.value.isProfileUpdated) {
                message.success(
                  intl.formatMessage({
                    id: 'profile_updated',
                    defaultMessage: 'Profile updated',
                  }),
                );

                this.props.history.push(`/@${user.name}`);
              }
            })
            .catch(e => message.error(e.message));
        } else {
          const profileDateEncoded = [
            ACCOUNT_UPDATE,
            {
              account: userName,
              extensions: [],
              json_metadata: '',
              posting_json_metadata: JSON.stringify({
                profile: { ...profileData, ...cleanValues, version: 2 },
              }),
            },
          ];

          updateAuthProfile(userName, profileDateEncoded, this.props.history, intl);
        }
      }
    });
  };

  handleSubmit(e) {
    e.preventDefault();
    const { isGuest, userName, intl } = this.props;
    const { avatarImage } = this.state;

    this.setState({ isLoading: true });

    if (isGuest && !isEmpty(avatarImage)) {
      getGuestAvatarUrl(userName, avatarImage[0].src, intl)
        .then(data => {
          this.props.form.setFieldsValue({
            profile_image: data.image,
          });
        })
        .then(() => this.setSettingsFields());
    } else this.setSettingsFields();
  }

  setEditor = editor => {
    this.editor = editor;
  };

  handleObjectSelect = selectedObject => {
    const { beforeRange } = checkCursorInSearchSlate(this.editor);
    const objectType = getObjectType(selectedObject);
    const objectName = getObjectName(selectedObject);
    const textReplace = objectType === objectTypes.HASHTAG ? `#${objectName}` : objectName;
    const url = getObjectUrl(selectedObject.id || selectedObject.author_permlink);

    Transforms.select(this.editor, beforeRange);
    insertObject(this.editor, url, textReplace, true);
    this.handleSignatureChange(this.editor);
  };

  onOpenChangeAvatarModal = () => {
    this.setState({ isModal: !this.state.isModal, isAvatar: !this.state.isAvatar });
  };

  onOpenChangeCoverModal = () => {
    this.setState({ isModal: !this.state.isModal, isCover: !this.state.isCover });
  };
  handleImageInvalid = (maxSize = MAXIMUM_UPLOAD_SIZE, allowedFormats = '') => {
    const { formatMessage } = this.props.intl;

    message.error(
      formatMessage(
        {
          id: 'notify_uploading_image_invalid',
          defaultMessage:
            'This file is invalid. Only image files {formats}with maximum size of {size} are supported',
        },
        { size: filesize(maxSize), formats: allowedFormats },
      ),
      3,
    );
  };

  onOkAvatarModal = () => {
    const { avatarImage } = this.state;

    this.setState({
      isModal: !this.state.isModal,
      isAvatar: !this.state.isAvatar,
      profilePicture: avatarImage[0].src,
    });
    this.props.form.setFieldsValue({
      profile_image: avatarImage[0].src,
    });
  };

  onOkCoverModal = () => {
    const { coverImage } = this.state;

    this.setState({
      isModal: !this.state.isModal,
      isCover: !this.state.isCover,
      coverPicture: coverImage[0].src,
    });
    this.props.form.setFieldsValue({
      cover_image: coverImage[0].src,
    });
  };

  renderBody(body) {
    this.setState({
      bodyHTML: remarkable.render(body),
    });
  }

  onLoadingImage = value => this.setState({ isLoadingImage: value });

  getAvatar = image => {
    this.setState({ avatarImage: image });
  };

  getCover = image => {
    this.setState({ coverImage: image });
  };

  render() {
    const { intl, form, user } = this.props;
    const {
      bodyHTML,
      isModal,
      isLoadingImage,
      avatarImage,
      coverImage,
      isAvatar,
      lastAccountUpdate,
      profilePicture,
      coverPicture,
      errors,
    } = this.state;
    const { getFieldDecorator, getFieldValue } = form;
    const metadata = getMetadata(user);
    const profile = metadata.profile || {};

    const hasErrors = Object.values(errors).some(e => e);

    return (
      <div>
        <div className="center">
          <h1>
            <FormattedMessage id="edit_profile" defaultMessage="Edit Profile" />
          </h1>
          <Form>
            <div className="Settings">
              <div className="Settings__section">
                <h3>
                  <FormattedMessage id="profile_name" defaultMessage="Name" />
                </h3>
                <div className="Settings__section__inputs">
                  <FormItem>
                    {getFieldDecorator('name', { initialValue: profile.name || '' })(
                      <Input
                        size="large"
                        placeholder={intl.formatMessage({
                          id: 'profile_name_placeholder',
                          defaultMessage: 'Name to display on your profile',
                        })}
                      />,
                    )}
                  </FormItem>
                </div>
              </div>
              <div className="Settings__section">
                <h3>
                  <FormattedMessage id="profile_about" defaultMessage="About me" />
                </h3>
                <div className="Settings__section__inputs">
                  <FormItem>
                    {getFieldDecorator('about', { initialValue: profile.about || '' })(
                      <Input.TextArea
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        placeholder={intl.formatMessage({
                          id: 'profile_about_placeholder',
                          defaultMessage: 'Few words about you',
                        })}
                      />,
                    )}
                  </FormItem>
                </div>
              </div>
              <div className="Settings__section">
                <h3>
                  <FormattedMessage id="profile_location" defaultMessage="Location" />
                  <FormattedMessage id="public_field" defaultMessage=" (public)" />
                </h3>
                <div className="Settings__section__inputs">
                  <FormItem>
                    {getFieldDecorator('location', { initialValue: profile.location || '' })(
                      <Input
                        size="large"
                        placeholder={intl.formatMessage({
                          id: 'profile_location_placeholder',
                          defaultMessage: 'Your location',
                        })}
                      />,
                    )}
                  </FormItem>
                </div>
              </div>
              <div className="Settings__section">
                <h3>
                  <FormattedMessage id="profile_email" defaultMessage="Email" />
                  <FormattedMessage id="public_field" defaultMessage=" (public)" />
                </h3>
                <div className="Settings__section__inputs">
                  <FormItem>
                    {getFieldDecorator('email', { initialValue: profile.email || '' })(
                      <Input
                        size="large"
                        placeholder={intl.formatMessage({
                          id: 'profile_email_placeholder',
                          defaultMessage: 'Your email',
                        })}
                      />,
                    )}
                  </FormItem>
                </div>
              </div>
              <div className="Settings__section">
                <h3>
                  <FormattedMessage id="profile_website" defaultMessage="Website" />
                  <FormattedMessage id="public_field" defaultMessage=" (public)" />
                </h3>
                <div className="Settings__section__inputs">
                  <FormItem>
                    {getFieldDecorator('website', { initialValue: profile.website || '' })(
                      <Input
                        size="large"
                        placeholder={intl.formatMessage({
                          id: 'profile_website_placeholder',
                          defaultMessage: 'Your website URL',
                        })}
                      />,
                    )}
                  </FormItem>
                </div>
              </div>
              <div className="Settings__section">
                <h3>
                  <FormattedMessage id="profile_picture" defaultMessage="Profile picture" />
                </h3>
                <div className="Settings__section__inputs">
                  <FormItem>
                    {getFieldDecorator('profile_image', {
                      initialValue: profile.profile_image || '',
                    })(
                      <div className="Settings__profile-image">
                        <Avatar
                          size="large"
                          icon="user"
                          src={`${profilePicture}?${lastAccountUpdate}`}
                        />
                        <Button type="primary" onClick={this.onOpenChangeAvatarModal}>
                          {intl.formatMessage({
                            id: 'profile_change_avatar',
                            defaultMessage: 'Change avatar',
                          })}
                        </Button>
                      </div>,
                    )}
                  </FormItem>
                </div>
              </div>
              <div className="Settings__section">
                <h3>
                  <FormattedMessage id="profile_cover" defaultMessage="Cover picture" />
                </h3>
                <div className="Settings__section__inputs">
                  <FormItem>
                    {getFieldDecorator('cover_image', { initialValue: profile.cover_image || '' })(
                      <div className="Settings__profile-image">
                        <Avatar size="large" shape="square" icon="picture" src={coverPicture} />
                        <Button type="primary" onClick={this.onOpenChangeCoverModal}>
                          {intl.formatMessage({
                            id: 'profile_change_cover',
                            defaultMessage: 'Change cover',
                          })}
                        </Button>
                      </div>,
                    )}
                  </FormItem>
                </div>
              </div>
              <div className="Settings__section">
                <h3>
                  <FormattedMessage id="profile_social_profiles" defaultMessage="Social profiles" />
                </h3>
                <div className="Settings__section__inputs">
                  <SocialInputs
                    setErrors={val => this.setState({ errors: val })}
                    intl={intl}
                    metadata={metadata}
                    getFieldDecorator={getFieldDecorator}
                    getFieldValue={getFieldValue}
                    errors={errors}
                  />
                </div>
              </div>
              <div className="Settings__section">
                <h3>
                  <FormattedMessage id="profile_signature" defaultMessage="Signature" />
                </h3>
                <div className="Settings__editor">
                  {getFieldDecorator('signature', { initialValue: profile.signature || '' })(
                    <EditorSlate
                      isComment
                      isShowEditorSearch={this.state.isShowEditorSearch}
                      onChange={this.handleSignatureChange}
                      handleObjectSelect={this.handleObjectSelect}
                      editorEnabled
                      initialPosTopBtn={'11.5px'}
                      initialBody={profile.signature}
                      setShowEditorSearch={this.setShowEditorSearch}
                      setEditorCb={this.setEditor}
                    />,
                  )}
                </div>
                {bodyHTML && (
                  <Form.Item label={<FormattedMessage id="preview" defaultMessage="Preview" />}>
                    <BodyContainer full body={bodyHTML} />
                  </Form.Item>
                )}
              </div>
              <Action
                primary
                big
                onClick={this.handleSubmit}
                disabled={
                  (!form.isFieldsTouched() &&
                    !bodyHTML &&
                    !avatarImage.length &&
                    !coverImage.length) ||
                  hasErrors
                }
                loading={this.state.isLoading}
              >
                <FormattedMessage id="save" defaultMessage="Save" />
              </Action>
            </div>
          </Form>
        </div>
        <Modal
          wrapClassName="Settings__modal"
          title={
            isAvatar
              ? intl.formatMessage({
                  id: 'profile_change_avatar',
                  defaultMessage: 'Change avatar',
                })
              : intl.formatMessage({
                  id: 'profile_change_cover',
                  defaultMessage: 'Change cover',
                })
          }
          closable
          onCancel={isAvatar ? this.onOpenChangeAvatarModal : this.onOpenChangeCoverModal}
          onOk={isAvatar ? this.onOkAvatarModal : this.onOkCoverModal}
          okButtonProps={{ disabled: isAvatar ? isEmpty(avatarImage) : isLoadingImage }}
          cancelButtonProps={{ disabled: isLoadingImage }}
          visible={isModal}
        >
          {isModal && (
            <ImageSetter
              isUserAvatar
              isEditable={!!isAvatar}
              onImageLoaded={isAvatar ? this.getAvatar : this.getCover}
              onLoadingImage={this.onLoadingImage}
              onImageInvalid={this.handleImageInvalid}
              isRequired
              isMultiple={false}
            />
          )}
        </Modal>
      </div>
    );
  }
}
