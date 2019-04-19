import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Modal } from 'antd';
import BodyContainer from '../../containers/Story/BodyContainer';
import TagsSelector from '../../components/TagsSelector/TagsSelector';
import PolicyConfirmation from '../../components/PolicyConfirmation/PolicyConfirmation';
import AdvanceSettings from './AdvanceSettings';
import { splitPostContent } from '../../helpers/postHelpers';
import { handleWeightChange, setInitialPercent } from '../../helpers/wObjInfluenceHelper';
import { rewardsValues } from '../../../common/constants/rewards';
import { getUpvoteSetting } from '../../reducers';
import './PostPreviewModal.less';

const isTopicValid = topic => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(topic);

@injectIntl
@connect(state => ({
  upvoteSetting: getUpvoteSetting(state),
}))
class PostPreviewModal extends Component {
  static propTypes = {
    intl: PropTypes.shape(),
    upvoteSetting: PropTypes.bool,
    content: PropTypes.string.isRequired,
    linkedObjects: PropTypes.arrayOf(PropTypes.shape()),
    onSubmit: PropTypes.func.isRequired,
  };
  static defaultProps = {
    intl: {},
    upvoteSetting: false,
    linkedObjects: [],
  };

  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      title: '',
      body: '',
      topics: [],
      linkedObjects: setInitialPercent(props.linkedObjects),
      weightBuffer: 0,
      settings: {
        reward: rewardsValues.half,
        beneficiary: false,
        upvote: props.upvoteSetting,
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
    const linkedObjects = setInitialPercent(this.props.linkedObjects);
    this.setState({
      isModalOpen: true,
      title: postTitle,
      body: postBody,
      weightBuffer: 0,
      linkedObjects,
    });
  };

  hideModal = () => this.setState({ isModalOpen: false });

  handleTopicsChange = topics => this.setState({ topics });

  handleConfirmedChange = isConfirmed => this.setState({ isConfirmed });

  handleSettingsChange = updatedValue =>
    this.setState(prevState => ({
      settings: { ...prevState.settings, ...updatedValue },
    }));

  handlePercentChange = (objId, percent) => {
    const { linkedObjects, weightBuffer } = this.state;
    this.setState(handleWeightChange(linkedObjects, objId, percent, weightBuffer));
  };

  handleSubmit = () => {
    const { body, title, topics, linkedObjects, settings } = this.state;
    const postData = {
      body,
      title,
      topics,
      reward: 0,
      beneficiary: false,
      upvote: false,
      linkedObjects,
      ...settings,
    };
    this.props.onSubmit(postData);
  };

  render() {
    const {
      isModalOpen,
      isConfirmed,
      body,
      title,
      topics,
      settings,
      linkedObjects,
      weightBuffer,
    } = this.state;
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
            <h1 className="StoryFull__title preview">{title}</h1>
            <BodyContainer full body={body} />
            <TagsSelector
              className="post-preview-topics"
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
              className="post-preview-legal-notice"
              isChecked={isConfirmed}
              checkboxLabel="Legal notice"
              policyText="Lorem ipsum dolor sit amet, enim in ut adipiscing turpis, mi interdum faucibus eleifend montes, augue viverra commodo vel placerat. Neque vitae amet consequat, proin sociis in sem, nunc fusce a facilisi per, sed sit et eget. A morbi velit proin, elit ac integer in justo, enim quis arcu arcu, magna dapibus est etiam. Nisl dapibus ut leo semper, pellentesque nec sem nec nulla, convallis dictum odio porttitor."
              onChange={this.handleConfirmedChange}
            />
            <AdvanceSettings
              linkedObjects={linkedObjects}
              weightBuffer={weightBuffer}
              settings={settings}
              onSettingsChange={this.handleSettingsChange}
              onPercentChange={this.handlePercentChange}
            />
            <div className="edit-post-controls">
              <Button
                htmlType="submit"
                onClick={this.handleSubmit}
                size="large"
                disabled={!isConfirmed}
                className="edit-post__submit-btn"
              >
                {intl.formatMessage({ id: 'publish', defaultMessage: 'Publish' })}
              </Button>
            </div>
          </Modal>
        )}
        {content && content.length > 0 ? (
          <div className="edit-post-controls">
            <Button
              htmlType="button"
              onClick={this.showModal}
              size="large"
              className="edit-post-controls__publish-ready-btn"
            >
              {intl.formatMessage({ id: 'ready_to_publish', defaultMessage: 'Ready to publish' })}
            </Button>
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

export default PostPreviewModal;
