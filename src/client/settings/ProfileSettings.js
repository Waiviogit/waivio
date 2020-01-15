import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import _ from 'lodash';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Form, Input, Avatar, Button, Modal } from 'antd';
import uuidv4 from 'uuid/v4';
import SteemConnect from '../steemConnectAPI';
import { updateProfile } from '../auth/authActions';
import { getIsReloading, getAuthenticatedUser, isGuestUser } from '../reducers';
import socialProfiles from '../helpers/socialProfiles';
import withEditor from '../components/Editor/withEditor';
import EditorInput from '../components/Editor/EditorInput';
import { remarkable } from '../components/Story/Body';
import BodyContainer from '../containers/Story/BodyContainer';
import Action from '../components/Button/Action';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import requiresLogin from '../auth/requiresLogin';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';
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
@connect(
  state => ({
    user: getAuthenticatedUser(state),
    reloading: getIsReloading(state),
    isGuest: isGuestUser(state),
  }),
  {
    updateProfile,
  },
)
@Form.create({
  mapPropsToFields,
})
@withEditor
export default class ProfileSettings extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    userName: PropTypes.string,
    onImageUpload: PropTypes.func,
    onImageInvalid: PropTypes.func,
    isGuest: PropTypes.bool,
    updateProfile: PropTypes.func,
    user: PropTypes.string,
  };

  static defaultProps = {
    onImageUpload: () => {},
    onImageInvalid: () => {},
    userName: '',
    user: '',
    isGuest: false,
    updateProfile: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      bodyHTML: '',
      profilePicture: {},
      coverPicture: {},
      isModal: false,
      isLoadingImage: false,
      currentImage: [],
      isChangedAvatar: false,
      isChangedBackground: false,
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

  handleSignatureChange(body) {
    _.throttle(this.renderBody, 200, { leading: false, trailing: true })(body);
  }

  handleChangeAvatar = e => {
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
        currentImage: [],
      });

      this.props.onImageUpload(e.target.files[0], this.disableAndInsertImage, () =>
        this.setState({
          isLoadingImage: false,
        }),
      );
    }
  };

  disableAndInsertImage = (image, imageName = 'image') => {
    const newImage = {
      src: image,
      name: imageName,
      id: uuidv4(),
    };
    this.setState({
      profilePicture: image,
      isLoadingImage: false,
      currentImage: [newImage],
      isChangedAvatar: true,
    });

    this.props.form.setFieldsValue({
      profile_image: image,
    });
  };

  handleAddImageByLink = image => {
    this.setState({ currentImage: [image] });
  };

  handleRemoveImage = imageId => {
    this.setState({
      currentImage: this.state.currentImage.filter(f => f.id !== imageId),
    });
  };

  handleSubmit(e) {
    e.preventDefault();
    // eslint-disable-next-line no-shadow
    const { form, isGuest, userName, updateProfile } = this.props;
    const { isChangedAvatar, isChangedBackground } = this.state;

    if (!form.isFieldsTouched() && !isChangedAvatar && !isChangedBackground) return;

    form.validateFields((err, values) => {
      if (!err) {
        const cleanValues = Object.keys(values)
          .filter(
            field =>
              form.isFieldTouched(field) ||
              (field === 'profile_image' && isChangedAvatar) ||
              (field === 'cover_image' && isChangedBackground),
          )
          .reduce(
            (a, b) => ({
              ...a,
              [b]: values[b] || '',
            }),
            {},
          );
        if (isGuest) {
          updateProfile(userName, cleanValues);
        } else {
          const win = window.open(SteemConnect.sign('profile-update', cleanValues), '_blank');
          win.focus();
        }
      }
    });
  }

  openModal = () => {
    this.setState({ isModal: !this.state.isModal });
  };

  renderBody(body) {
    this.setState({
      bodyHTML: remarkable.render(body),
    });
  }

  render() {
    const { intl, form } = this.props;
    const { bodyHTML, isModal, isLoadingImage, currentImage, isChangedAvatar } = this.state;
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
            {intl.formatMessage({ id: 'edit_profile', defaultMessage: 'Edit profile' })} - Waivio
          </title>
        </Helmet>
        <div className="settings-layout container">
          <Affix className="leftContainer" stickPosition={77}>
            <div className="left">
              <LeftSidebar />
            </div>
          </Affix>
          <div className="center">
            <MobileNavigation />
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
                          <Button type="primary" onClick={this.openModal}>
                            {intl.formatMessage({
                              id: 'profile_change',
                              defaultMessage: 'Change',
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
                        <Input
                          size="large"
                          placeholder={intl.formatMessage({
                            id: 'profile_cover',
                            defaultMessage: 'Cover picture',
                          })}
                        />,
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
                  disabled={!form.isFieldsTouched() && !isChangedAvatar}
                >
                  <FormattedMessage id="save" defaultMessage="Save" />
                </Action>
              </div>
            </Form>
          </div>
        </div>
        <Modal
          wrapClassName="Settings__modal"
          title="Change avatar"
          closable
          onCancel={this.openModal}
          onOk={this.openModal}
          okButtonProps={{ disabled: isLoadingImage, loading: isLoadingImage }}
          cancelButtonProps={{ disabled: isLoadingImage, loading: isLoadingImage }}
          visible={isModal}
        >
          <ImageSetter
            isLoading={isLoadingImage}
            handleAddImage={this.handleChangeAvatar}
            onRemoveImage={this.handleRemoveImage}
            images={currentImage}
            handleAddImageByLink={this.handleAddImageByLink}
          />
        </Modal>
      </div>
    );
  }
}
