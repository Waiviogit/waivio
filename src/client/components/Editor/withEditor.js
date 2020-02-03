import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { message } from 'antd';
import filesize from 'filesize';
import { injectIntl } from 'react-intl';
import { getAuthenticatedUser, getSuitableLanguage } from '../../reducers';
import { MAXIMUM_UPLOAD_SIZE } from '../../helpers/image';
import { getClientWObj } from '../../adapters';
import * as api from '../../../waivioApi/ApiClient';
import { followObject, voteObject } from '../../object/wobjActions';
import { createPermlink } from '../../vendor/steemitHelpers';
import { generateRandomString } from '../../helpers/wObjectHelper';
import { WAIVIO_PARENT_PERMLINK } from '../../../common/constants/waivio';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function withEditor(WrappedComponent) {
  @connect(
    state => ({
      user: getAuthenticatedUser(state),
      locale: getSuitableLanguage(state),
    }),
    {
      voteObject,
      followObject,
    },
  )
  @injectIntl
  class EditorBase extends React.Component {
    static displayName = `withEditor(${getDisplayName(WrappedComponent)})`;

    static propTypes = {
      intl: PropTypes.shape().isRequired,
      user: PropTypes.shape().isRequired,
      locale: PropTypes.string,
      voteObject: PropTypes.func.isRequired,
      followObject: PropTypes.func.isRequired,
    };

    static defaultProps = {
      locale: 'en-US',
      voteObject: () => {},
      followObject: () => {},
    };

    getObjectsByAuthorPermlinks = objectIds => {
      const { locale } = this.props.locale;
      return api
        .getObjectsByIds({ authorPermlinks: objectIds, locale })
        .then(res => res.map(obj => getClientWObj(obj, locale)));
    };

    handleImageUpload = (blob, callback, errorCallback) => {
      const {
        intl: { formatMessage },
      } = this.props;
      message.info(
        formatMessage({ id: 'notify_uploading_image', defaultMessage: 'Uploading image' }),
      );
      const formData = new FormData();
      formData.append('file', blob);

      return fetch(`https://www.waivio.com/api/image`, {
        method: 'POST',
        body: formData,
      })
        .then(res => res.json())
        .then(res => callback(res.image, blob.name))
        .catch(err => {
          console.log('err', err);
          errorCallback();
          message.error(
            formatMessage({
              id: 'notify_uploading_iamge_error',
              defaultMessage: "Couldn't upload image",
            }),
          );
        });
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

    handleCreateObject = async (obj, callback, errorCallback) => {
      const { formatMessage } = this.props.intl;

      const permlink = await createPermlink(
        obj.id,
        this.props.user.name,
        '',
        WAIVIO_PARENT_PERMLINK,
      );

      const requestBody = {
        author: this.props.user.name,
        title: `${obj.name} - InvestArena topic`,
        body: `InvestArena topic "${obj.name}" has been created`,
        permlink: `${generateRandomString(3).toLowerCase()}-${permlink}`,
        objectName: obj.name,
        locale: obj.locale || this.props.locale === 'auto' ? 'en-US' : this.props.locale,
        type: obj.type,
        isExtendingOpen: obj.isExtendingOpen,
        isPostingOpen: obj.isPostingOpen,
        parentAuthor: obj.parentAuthor,
        parentPermlink: obj.parentPermlink,
      };

      try {
        const response = await api.postCreateWaivioObject(requestBody);
        await this.props.voteObject(response.author, response.permlink, obj.votePower);

        if (obj.follow) {
          await this.props.followObject(requestBody.permlink);
        }

        await message.success(
          formatMessage({
            id: 'create_object_success',
            defaultMessage: 'Object has been created',
          }),
        );

        callback(response);
      } catch (e) {
        await message.error(
          formatMessage({
            id: 'create_object_error',
            defaultMessage: 'Something went wrong. Object is not created',
          }),
        );

        errorCallback();
      }
    };

    render() {
      return (
        <WrappedComponent
          onImageUpload={this.handleImageUpload}
          onImageInvalid={this.handleImageInvalid}
          onCreateObject={this.handleCreateObject}
          getLinkedObjects={this.getObjectsByAuthorPermlinks}
          {...this.props}
        />
      );
    }
  }

  return EditorBase;
}
