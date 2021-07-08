import { Modal } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { muteAuthorComment } from '../../store/commentsStore/commentsActions';
import { muteUserBlog } from '../../store/usersStore/usersActions';
import { muteAuthorPost } from '../../store/postsStore/postActions';

const MuteModal = props => {
  const handleMuteUser = () => {
    switch (props.type) {
      case 'comment':
        return props.muteAuthorComment(props.item);
      case 'post':
        return props.muteAuthorPost(props.item);
      default:
        return props.muteUserBlog(props.item);
    }
  };

  return (
    props.visible && (
      <Modal
        visible={props.visible}
        zIndex={2000}
        title={`${props.intl.formatMessage({
          id: 'mute',
          defaultMessage: 'Mute',
        })} ${props.username}`}
        onCancel={() => props.setVisibleMuteModal(false)}
        onOk={() => {
          handleMuteUser(props.item);
          props.setVisibleMuteModal(false);
        }}
      >
        {props.intl.formatMessage({
          id: 'mute_modal',
          defaultMessage:
            'If you mute the user, you will no longer see their posts and comments. You can unmute users via their profiles.',
        })}
      </Modal>
    )
  );
};

MuteModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  setVisibleMuteModal: PropTypes.func.isRequired,
  muteAuthorComment: PropTypes.func.isRequired,
  muteUserBlog: PropTypes.func.isRequired,
  muteAuthorPost: PropTypes.func.isRequired,
  // from parent
  item: PropTypes.shape({
    muted: PropTypes.bool,
  }),
  type: PropTypes.string,
  username: PropTypes.string.isRequired,
};

MuteModal.defaultProps = {
  username: '',
  item: {
    muted: false,
  },
  type: '',
};

export default connect(null, {
  muteAuthorComment,
  muteUserBlog,
  muteAuthorPost,
})(injectIntl(MuteModal));
