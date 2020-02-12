import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { attempt, get, isEmpty, isError, throttle } from 'lodash';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Avatar, Button, Form, Input, Modal } from 'antd';
import moment from 'moment';
import sc from 'steemconnect';
import { updateProfile } from '../auth/authActions';
import { getAuthenticatedUser, getIsReloading, isGuestUser } from '../reducers';
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
import { getGuestAvatarUrl } from '../../waivioApi/ApiClient';
import { getAvatarURL } from '../components/Avatar';
import './Settings.less';

const FormItem = Form.Item;

function mapPropsToFields(props) {
  let metadata = attempt(JSON.parse, props.user.json_metadata);
  if (isError(metadata)) metadata = {};
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

    let metadata = attempt(JSON.parse, props.user.json_metadata);
    if (isError(metadata)) metadata = {};
    this.state = {
      bodyHTML: '',
      profileData: get(metadata, ['profile'], {}),
      profilePicture: getAvatarURL(props.userName),
      coverPicture: get(metadata, ['profile', 'cover_image'], ''),
      isModal: false,
      isLoadingImage: false,
      avatarImage: [],
      coverImage: [],
      isCover: false,
      isAvatar: false,
      lastAccountUpdate: moment(props.user.updatedAt).unix(),
    };

    this.handleSignatureChange = this.handleSignatureChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderBody = this.renderBody.bind(this);
  }

  handleSignatureChange(body) {
    throttle(this.renderBody, 200, { leading: false, trailing: true })(body);
  }

  setSettingsFields = () => {
    // eslint-disable-next-line no-shadow
    const { form, isGuest, user, userName, updateProfile } = this.props;
    const { avatarImage, coverImage, profileData } = this.state;
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
        if (isGuest) {
          updateProfile(userName, cleanValues);
        } else {
          const win = window.open(
            sc.sendOperation(
              [
                'account_update',
                {
                  account: userName,
                  memo_key: user.memo_key,
                  json_metadata: JSON.stringify({ profile: { ...profileData, ...cleanValues } }),
                },
              ],
              { callback: window.location.href },
            ),
            '_blank',
          );
          win.focus();
        }
      }
    });
  };

  handleSubmit(e) {
    e.preventDefault();
    // eslint-disable-next-line no-shadow
    const { isGuest, userName, intl } = this.props;
    const { avatarImage } = this.state;

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

  onOpenChangeAvatarModal = () => {
    this.setState({ isModal: !this.state.isModal, isAvatar: !this.state.isAvatar });
  };

  onOpenChangeCoverModal = () => {
    this.setState({ isModal: !this.state.isModal, isCover: !this.state.isCover });
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
    const { intl, form } = this.props;
    const {
      bodyHTML,
      isModal,
      isLoadingImage,
      avatarImage,
      coverImage,
      isAvatar,
      lastAccountUpdate,
      profilePicture,
    } = this.state;
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
                      {getFieldDecorator('cover_image')(
                        <div className="Settings__profile-image">
                          <Avatar
                            size="large"
                            shape="square"
                            icon="picture"
                            src={`${this.state.coverPicture}`}
                          />
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
          onCancel={isAvatar ? this.onOpenChangeAvatarModal : this.onOpenChangeCoverModal}
          onOk={isAvatar ? this.onOkAvatarModal : this.onOkCoverModal}
          okButtonProps={{ disabled: isLoadingImage }}
          cancelButtonProps={{ disabled: isLoadingImage }}
          visible={isModal}
        >
          {isModal && (
            <ImageSetter
              onImageLoaded={isAvatar ? this.getAvatar : this.getCover}
              onLoadingImage={this.onLoadingImage}
              isRequired
            />
          )}
        </Modal>
      </div>
    );
  }
}
