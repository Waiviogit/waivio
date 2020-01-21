import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import _ from 'lodash';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Input, Avatar, Button, Modal, message } from 'antd';
import uuidv4 from 'uuid/v4';
import SteemConnect from '../steemConnectAPI';
import { getIsReloading, getAuthenticatedUser } from '../reducers';
import socialProfiles from '../helpers/socialProfiles';
import withEditor from '../components/Editor/withEditor';
import EditorInput from '../components/Editor/EditorInput';
import { remarkable } from '../components/Story/Body';
import BodyContainer from '../containers/Story/BodyContainer';
import Action from '../components/Button/Action';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import requiresLogin from '../auth/requiresLogin';
import ImageSetter from '../components/ImageSetter/ImageSetter';
import { isValidImage } from '../helpers/image';
import { ALLOWED_IMG_FORMATS, MAX_IMG_SIZE } from '../../common/constants/validation';
import { objectFields } from '../../common/constants/listOfFields';
import './Settings.less';

const FormItem = Form.Item;

function mapPropsToFields(props) {
  let metadata = _.attempt(JSON.parse, props.user.json_metadata);
  if (_.isError(metadata)) metadata = {};

  const profile = metadata.profile || {};

  return Object.keys(profile).reduce(
    (a, b) => ({
      ...a,
      [b]: Form.createFormField({
        value: profile[b],
      }),
    }),
    {},
  );
}

@requiresLogin
@injectIntl
@connect(state => ({
  user: getAuthenticatedUser(state),
  reloading: getIsReloading(state),
}))
@Form.create({
  mapPropsToFields,
})
@withEditor
export default class ProfileSettings extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    user: PropTypes.shape(),
    onImageUpload: PropTypes.func,
    onImageInvalid: PropTypes.func,
  };

  static defaultProps = {
    onImageUpload: () => {},
    onImageInvalid: () => {},
    user: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      bodyHTML: '',
      coverPicture: {},
      profilePicture: {},
      isAvatar: false,
      isCover: false,
      isGuest: false,
      isModal: false,
      avatarImage: [],
      coverImage: [],
      isLoadingImage: false,
    };

    this.handleSignatureChange = this.handleSignatureChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderBody = this.renderBody.bind(this);
  }

  componentDidMount() {
    const { user } = this.props;
    const profileData = _.attempt(JSON.parse, user.json_metadata);
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      profilePicture: profileData.profile.profile_image,
      coverPicture: profileData.profile.cover_image,
    });
  }

  setSettingsFields = () => {
    // eslint-disable-next-line no-shadow
    const { form } = this.props;
    const { avatarImage, coverImage } = this.state;
    const isChangedAvatar = !!avatarImage.length;
    const isChangedCover = !!coverImage.length;

    if (!form.isFieldsTouched() && !isChangedAvatar && !isChangedCover) return;

    form.validateFields((err, values) => {
      if (!err) {
        const cleanValues = Object.keys(values)
          .filter(
            field =>
              form.isFieldTouched(field) ||
              (field === 'profile_image' && isChangedAvatar) ||
              (field === 'cover_image' && isChangedCover),
          )
          .reduce(
            (a, b) => ({
              ...a,
              [b]: values[b] || '',
            }),
            {},
          );
        const win = window.open(SteemConnect.sign('profile-update', cleanValues), '_blank');
        win.focus();
        // TODO: to do when guest is ready
        // if (isGuest) {
        //   updateProfile(userName, cleanValues);
        // } else {
        //   const win = window.open(SteemConnect.sign('profile-update', cleanValues), '_blank');
        //   win.focus();
        // }
      }
    });
  };

  handleChangeImage = e => {
    if (e.target.files && e.target.files[0]) {
      if (
        !isValidImage(e.target.files[0], MAX_IMG_SIZE[objectFields.background], ALLOWED_IMG_FORMATS)
      ) {
        this.props.onImageInvalid(
          MAX_IMG_SIZE[objectFields.background],
          `(${ALLOWED_IMG_FORMATS.join(', ')}) `,
        );
        return;
      }

      this.setState({
        isLoadingImage: true,
      });

      if (this.state.isAvatar) this.setState({ avatarImage: [] });
      if (this.state.isCover) this.setState({ coverImage: [] });

      this.props.onImageUpload(e.target.files[0], this.disableAndInsertImage, () =>
        this.setState({
          isLoadingImage: false,
        }),
      );
    }
  };

  handleSubmit(e) {
    e.preventDefault();

    // TODO: to do when guest is ready
    // if (isGuest && !_.isEmpty(avatarImage)) {
    //   getGuestAvatarUrl(userName, profilePicture, intl)
    //     .then(data => {
    //       this.props.form.setFieldsValue({
    //         profile_image: data.image,
    //       });
    //     })
    //     .then(() => this.setSettingsFields());
    // } else this.setSettingsFields();
    this.setSettingsFields();
  }

  disableAndInsertImage = (image, imageName = 'image') => {
    const { isAvatar } = this.state;
    const newImage = {
      src: image,
      name: imageName,
      id: uuidv4(),
    };
    this.setState({
      [`${isAvatar ? 'profilePicture' : 'coverPicture'}`]: image,
      [`${isAvatar ? 'avatarImage' : 'coverImage'}`]: [newImage],
      isLoadingImage: false,
    });

    this.props.form.setFieldsValue({
      [`${isAvatar ? 'profile_image' : 'cover_image'}`]: image,
    });
  };

  handleAddImageByLink = image => {
    this.checkIsValidImageLink(image, this.checkIsImage);
  };

  checkIsValidImageLink = (image, setImageIsValid) => {
    const img = new Image();
    img.src = image.src;
    img.onload = () => setImageIsValid(image, true);
    img.onerror = () => setImageIsValid(image, false);
  };

  checkIsImage = (image, isValidLink) => {
    const { intl } = this.props;
    const { isAvatar, isGuest } = this.state;

    if (!isGuest && isValidLink) {
      this.setState({
        [`${isAvatar ? 'profilePicture' : 'coverPicture'}`]: image.src,
        [`${isAvatar ? 'avatarImage' : 'coverImage'}`]: [image],
      });
      this.props.form.setFieldsValue({
        [`${isAvatar ? 'profile_image' : 'cover_image'}`]: image.src,
      });
    } else {
      message.error(
        intl.formatMessage({
          id: 'imageSetter_invalid_link',
          defaultMessage: 'The link is invalid',
        }),
      );
    }
  };

  handleRemoveImage = () => {
    const { isAvatar } = this.state;
    this.setState({ [`${isAvatar ? 'avatarImage' : 'coverImage'}`]: [] });
  };

  handleSignatureChange(body) {
    _.throttle(this.renderBody, 200, { leading: false, trailing: true })(body);
  }

  openChangeAvatarModal = () => {
    this.setState({ isModal: !this.state.isModal, isAvatar: !this.state.isAvatar });
  };

  openChangeCoverModal = () => {
    this.setState({ isModal: !this.state.isModal, isCover: !this.state.isCover });
  };

  renderBody(body) {
    this.setState({
      bodyHTML: remarkable.render(body),
    });
  }

  render() {
    const { intl, form } = this.props;
    const { bodyHTML, isAvatar, isModal, avatarImage, coverImage, isLoadingImage } = this.state;
    const { getFieldDecorator } = form;

    const socialInputs = socialProfiles.map(profile => (
      <FormItem key={profile.id}>
        {getFieldDecorator(profile.id, {
          rules: [
            {
              message: intl.formatMessage({
                id: 'profile_social_profile_incorrect',
                defaultMessage:
                  "This doesn't seem to be valid username. Only alphanumeric characters, hyphens, underscores and dots are allowed.",
              }),
              pattern: /^[0-9A-Za-z-_.]+$/,
            },
          ],
        })(
          <Input
            size="large"
            prefix={
              <i
                className={`Settings__prefix-icon iconfont icon-${profile.icon}`}
                style={{
                  color: profile.color,
                }}
              />
            }
            placeholder={profile.name}
          />,
        )}
      </FormItem>
    ));

    return (
      <div className="shifted">
        <Helmet>
          <title>
            {intl.formatMessage({ id: 'edit_profile', defaultMessage: 'Edit profile' })} -
            InvestArena
          </title>
        </Helmet>
        <div className="settings-layout container">
          <Affix className="leftContainer" stickPosition={116}>
            <div className="left">
              <LeftSidebar />
            </div>
          </Affix>
          <div className="center">
            <h1>
              <FormattedMessage id="edit_profile" defaultMessage="Edit Profile" />
            </h1>
            <Form onSubmit={this.handleSubmit}>
              <div className="Settings">
                <div className="Settings__section">
                  <h3>
                    <FormattedMessage id="profile_name" defaultMessage="Name" />
                  </h3>
                  <div className="Settings__section__inputs">
                    <FormItem>
                      {getFieldDecorator('name')(
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
                      {getFieldDecorator('about')(
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
                  </h3>
                  <div className="Settings__section__inputs">
                    <FormItem>
                      {getFieldDecorator('location')(
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
                    <FormattedMessage id="profile_website" defaultMessage="Website" />
                  </h3>
                  <div className="Settings__section__inputs">
                    <FormItem>
                      {getFieldDecorator('website')(
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
                      {getFieldDecorator('profile_image')(
                        <div className="Settings__profile-image">
                          <Avatar size="large" icon="user" src={`${this.state.profilePicture}`} />
                          <Button type="primary" onClick={this.openChangeAvatarModal}>
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
                      {getFieldDecorator('cover_image')(
                        <div className="Settings__profile-image">
                          <Avatar
                            size="large"
                            shape="square"
                            icon="file-image"
                            src={`${this.state.coverPicture}`}
                          />
                          <Button type="primary" onClick={this.openChangeCoverModal}>
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
                    <FormattedMessage
                      id="profile_social_profiles"
                      defaultMessage="Social profiles"
                    />
                  </h3>
                  <div className="Settings__section__inputs">{socialInputs}</div>
                </div>
                <div className="Settings__section">
                  <h3>
                    <FormattedMessage id="profile_signature" defaultMessage="Signature" />
                  </h3>
                  <div className="Settings__section__inputs">
                    {getFieldDecorator('signature', {
                      initialValue: '',
                    })(
                      <EditorInput
                        rows={6}
                        onChange={this.handleSignatureChange}
                        onImageUpload={this.props.onImageUpload}
                        onImageInvalid={this.props.onImageInvalid}
                        inputId={'profile-inputfile'}
                      />,
                    )}
                    {bodyHTML && (
                      <Form.Item label={<FormattedMessage id="preview" defaultMessage="Preview" />}>
                        <BodyContainer full body={bodyHTML} />
                      </Form.Item>
                    )}
                  </div>
                </div>
                <Action
                  primary
                  big
                  type="submit"
                  disabled={!form.isFieldsTouched() && !avatarImage.length && !coverImage.length}
                >
                  <FormattedMessage id="save" defaultMessage="Save" />
                </Action>
              </div>
            </Form>
          </div>
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
          onCancel={isAvatar ? this.openChangeAvatarModal : this.openChangeCoverModal}
          onOk={isAvatar ? this.openChangeAvatarModal : this.openChangeCoverModal}
          okButtonProps={{ disabled: isLoadingImage }}
          cancelButtonProps={{ disabled: isLoadingImage }}
          visible={isModal}
        >
          <ImageSetter
            isLoading={isLoadingImage}
            handleAddImage={this.handleChangeImage}
            onRemoveImage={this.handleRemoveImage}
            images={isAvatar ? avatarImage : coverImage}
            handleAddImageByLink={this.handleAddImageByLink}
          />
        </Modal>
      </div>
    );
  }
}
