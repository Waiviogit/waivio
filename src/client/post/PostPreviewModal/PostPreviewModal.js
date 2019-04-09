import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import BodyContainer from '../../containers/Story/BodyContainer';

class PostPreviewModal extends Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
    };
  }

  showModal = () => this.setState({ isModalOpen: true });

  hideModal = () => this.setState({ isModalOpen: false });

  render() {
    const { isModalOpen } = this.state;
    const { content } = this.props;
    return (
      <React.Fragment>
        {isModalOpen && (
          <Modal
            title="post preview"
            visible={isModalOpen}
            centered={false}
            closable
            confirmLoading={false}
            wrapClassName="post-preview-modal"
            width={800}
            footer={null}
            onCancel={this.hideModal}
            onOk={() => console.log('You are my hero!')}
          >
            <BodyContainer full body={content} />
          </Modal>
        )}
        {content && content.length > 0 ? (
          <Button
            htmlType="button"
            onClick={this.showModal}
            className="edit-post__publish-ready-btn"
          >
            <FormattedMessage id="ready_to_publish" defaultMessage="Ready to publish" />
          </Button>
        ) : null}
      </React.Fragment>
    );
  }
}

export default PostPreviewModal;
