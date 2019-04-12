import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button, Modal } from 'antd';
import BodyContainer from '../../containers/Story/BodyContainer';
import TagsSelector from '../../components/TagsSelector/TagsSelector';
import PolicyConfirmation from '../../components/PolicyConfirmation/PolicyConfirmation';
import AdvanceSettings from './AdvanceSettings';
import { splitPostContent } from '../../helpers/postHelpers';

const isTopicValid = topic => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(topic);

@injectIntl
class PostPreviewModal extends Component {
  static propTypes = {
    intl: PropTypes.shape(),
    content: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };
  static defaultProps = {
    intl: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      topics: [],
      settings: {
        reward: '0',
        beneficiary: false,
        upvote: false,
      },
      isConfirmed: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.isModalOpen || this.state.isModalOpen || !this.props.content || !nextProps.content
    );
  }

  showModal = () => {
    const { postTitle, postBody } = splitPostContent(this.props.content);
    this.setState({
      isModalOpen: true,
      body: postBody,
      title: postTitle,
    });
  };

  hideModal = () => this.setState({ isModalOpen: false });

  handleTopicsChange = topics => this.setState({ topics });

  handleConfirmedChange = isConfirmed => this.setState({ isConfirmed });

  handleSettingsChange = updatedValue =>
    this.setState(prevState => ({
      settings: { ...prevState.settings, ...updatedValue },
    }));

  handleSubmit = () => {
    const { body, title, topics, settings } = this.state;
    const postData = {
      body,
      title,
      topics,
      reward: 0,
      beneficiary: false,
      upvote: false,
      wobjects: [],
      ...settings,
    };
    this.props.onSubmit(postData);
  };

  render() {
    const { isModalOpen, body, title, topics } = this.state;
    const { intl, content } = this.props;
    return (
      <React.Fragment>
        {isModalOpen && (
          <Modal
            title={intl.formatMessage({ id: 'preview', defaultMessage: 'Preview' })}
            style={{ top: 20 }}
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
            <h1>{title}</h1>
            <BodyContainer full body={body} />
            <TagsSelector
              label={intl.formatMessage({
                id: 'topics',
                defaultMessage: 'Topics',
              })}
              placeholder={intl.formatMessage({
                id: 'topics_placeholder',
                defaultMessage: 'Add story topics here',
              })}
              tags={topics}
              validator={isTopicValid}
              onChange={this.handleTopicsChange}
            />
            <PolicyConfirmation
              checkboxLabel="Legal notice"
              policyText="Lorem ipsum dolor sit amet, enim in ut adipiscing turpis, mi interdum faucibus eleifend montes, augue viverra commodo vel placerat. Neque vitae amet consequat, proin sociis in sem, nunc fusce a facilisi per, sed sit et eget. A morbi velit proin, elit ac integer in justo, enim quis arcu arcu, magna dapibus est etiam. Nisl dapibus ut leo semper, pellentesque nec sem nec nulla, convallis dictum odio porttitor."
              onChange={this.handleConfirmedChange}
            />
            <AdvanceSettings onChange={this.handleSettingsChange} />
            <Button htmlType="submit" onClick={this.handleSubmit} className="edit-post__submit-btn">
              {intl.formatMessage({ id: 'publish', defaultMessage: 'Publish' })}
            </Button>
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
