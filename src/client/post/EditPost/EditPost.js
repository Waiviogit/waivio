import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { kebabCase } from 'lodash';
import { getAuthenticatedUser, getDraftPosts } from '../../reducers';
import { createPost } from '../Write/editorActions';
import { WAIVIO_PARENT_PERMLINK } from '../../../common/constants/waivio';
import { createPostMetadata } from '../../helpers/postHelpers';
import Editor from '../../components/EditorExtended/EditorExtended';
import PostPreviewModal from '../PostPreviewModal/PostPreviewModal';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { Entity, toMarkdown } from '../../components/EditorExtended';

const getLinkedObjects = contentStateRaw => {
  const entities = Object.values(contentStateRaw.entityMap).filter(
    entity => entity.type === Entity.OBJECT,
  );
  return entities.map(entity => entity.data.object);
};

@withRouter
@connect(
  (state, props) => ({
    user: getAuthenticatedUser(state),
    draftPosts: getDraftPosts(state),
    draftId: new URLSearchParams(props.location.search).get('draft'),
  }),
  {
    createPost,
  },
)
class EditPost extends Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    draftPosts: PropTypes.shape().isRequired,
    draftId: PropTypes.string,
    createPost: PropTypes.func,
  };
  static defaultProps = {
    draftId: '',
    createPost: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      content: '',
      linkedObjects: [],
    };

    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.buildPost = this.buildPost.bind(this);
  }

  handleChangeContent(rawContent) {
    const nextState = { content: toMarkdown(rawContent) };
    const linkedObjects = getLinkedObjects(rawContent);
    if (this.state.linkedObjects.length !== linkedObjects.length) {
      nextState.linkedObjects = linkedObjects;
    }
    this.setState(nextState);
  }

  handleSubmit(data) {
    const postData = this.buildPost(data);
    console.log('POST_DATA', postData);
    this.props.createPost(postData);
  }

  buildPost(data) {
    const { linkedObjects } = this.state;
    const postData = {
      body: data.body,
      title: data.title,
      reward: data.reward || '0',
      beneficiary: !!data.beneficiary,
      upvote: !!data.upvote,
      lastUpdated: Date.now(),
    };

    postData.parentAuthor = '';
    postData.parentPermlink = WAIVIO_PARENT_PERMLINK;
    postData.author = this.props.user.name || '';
    postData.permlink = kebabCase(data.title);
    // if (isUpdating) postData.isUpdating = isUpdating; // use for update post

    const oldMetadata =
      this.props.draftPosts[this.props.draftId] &&
      this.props.draftPosts[this.props.draftId].jsonMetadata;
    const waivioData = {
      wobjects: linkedObjects.map(obj => ({
        objectName: obj.name,
        author_permlink: obj.id,
        percent: obj.percent || Math.floor(100 / linkedObjects.length),
      })),
    };

    postData.jsonMetadata = createPostMetadata(data.body, data.topics, oldMetadata, waivioData);

    return postData;
  }

  render() {
    const { content, linkedObjects } = this.state;
    return (
      <div className="shifted">
        <div className="post-layout container">
          <div className="center">
            <Editor onChange={this.handleChangeContent} />
            <PostPreviewModal
              content={content}
              linkedObjects={linkedObjects}
              onSubmit={this.handleSubmit}
            />
            {linkedObjects.map(wObj => (
              <ObjectCardView wObject={wObj} key={wObj.id} />
            ))}
          </div>
          <div className="rightContainer">
            <div className="right">[drafts block]</div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditPost;
