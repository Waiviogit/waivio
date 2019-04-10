import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button, Modal } from 'antd';
import BodyContainer from '../../containers/Story/BodyContainer';
import TagsSelector from '../../components/TagsSelector/TagsSelector';

@injectIntl
class PostPreviewModal extends Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    content: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      topics: [],
    };
  }

  showModal = () => this.setState({ isModalOpen: true });

  hideModal = () => this.setState({ isModalOpen: false });

  handleTopicsChange = topics => this.setState({ topics });

  render() {
    const { isModalOpen } = this.state;
    const { intl, content } = this.props;
    return (
      <React.Fragment>
        {isModalOpen && (
          <Modal
            title={intl.formatMessage({ id: 'preview', defaultMessage: 'Preview' })}
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
            <TagsSelector
              label={intl.formatMessage({
                id: 'topics',
                defaultMessage: 'Topics',
              })}
              placeholder={intl.formatMessage({
                id: 'topics_placeholder',
                defaultMessage: 'Add story topics here',
              })}
              onChange={this.handleTopicsChange}
            />
          </Modal>
        )}
        {content && content.length > 0 ? (
          <Button
            htmlType="button"
            onClick={this.showModal}
            className="edit-post__publish-ready-btn"
          >
            {intl.formatMessage({ id: 'ready_to_publish', defaultMessage: 'Ready to publish' })}
          </Button>
        ) : null}
      </React.Fragment>
    );
  }
}

export default PostPreviewModal;
