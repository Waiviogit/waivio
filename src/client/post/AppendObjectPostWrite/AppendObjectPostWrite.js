import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { replace } from 'react-router-redux';
import _ from 'lodash';
import 'url-search-params-polyfill';
import { injectIntl } from 'react-intl';
import improve from '../../helpers/improve';
import { rewardsValues } from '../../../common/constants/rewards';
import { getObject } from '../../object/wobjectsActions';

import {
  getAuthenticatedUser,
  getIsEditorLoading,
  getIsEditorSaving,
  getUpvoteSetting,
  getRewardSetting,
  getLocale,
} from '../../reducers';

import { createPost, newPost } from './editorActions';
import AppendObjectPostEditor from '../../components/Editor/AppendObjectPostEditor';
import Affix from '../../components/Utils/Affix';

@injectIntl
@withRouter
@connect(
  state => ({
    user: getAuthenticatedUser(state),
    loading: getIsEditorLoading(state),
    saving: getIsEditorSaving(state),
    upvoteSetting: getUpvoteSetting(state),
    rewardSetting: getRewardSetting(state),
    locale: getLocale(state),
  }),
  {
    createPost,
    newPost,
    replace,
    getObject,
  },
)
class AppendObjectPostWrite extends React.Component {
  static propTypes = {
    user: PropTypes.shape().isRequired,
    loading: PropTypes.bool.isRequired,
    getObject: PropTypes.func.isRequired,
    saving: PropTypes.bool,
    upvoteSetting: PropTypes.bool,
    match: PropTypes.shape().isRequired,
    rewardSetting: PropTypes.string,
    locale: PropTypes.string,
    newPost: PropTypes.func,
    createPost: PropTypes.func,
  };

  static defaultProps = {
    saving: false,
    draftId: null,
    locale: 'auto',
    upvoteSetting: true,
    rewardSetting: rewardsValues.half,
    newPost: () => {},
    createPost: () => {},
    saveDraft: () => {},
    notify: () => {},
    replace: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      initialTitle: '',
      initialTopics: [],
      initialBody: '',
      initialReward: this.props.rewardSetting,
      initialUpvote: this.props.upvoteSetting,
      initialUpdatedDate: Date.now(),
      isUpdating: false,
      showModalDelete: false,
      wobject: {},
    };
  }

  componentDidMount() {
    this.props.newPost();
    this.props.getObject(this.props.match.params.name).then(wobject => {
      this.setState({ wobject, isFetching: false });
    });
  }

  componentDidUpdate(prevProps) {
    if (_.get(this.props, 'location.search') !== _.get(prevProps, 'location.search')) {
      this.saveDraft.cancel();
    }
  }

  onSubmit = form => {
    const data = this.getNewPostData(form);
    data.body = improve(data.body);
    this.props.createPost(data);
  };

  getNewPostData = form => {
    const data = {
      body: form.body,
      title: form.title,
      reward: form.reward,
      upvote: form.upvote,
      lastUpdated: Date.now(),
    };

    data.parentAuthor = '';
    data.author = this.props.user.name || '';

    if (data.title && !this.permlink) {
      data.permlink = _.kebabCase(data.title);
    } else {
      data.permlink = this.permlink;
    }

    if (this.state.isUpdating) data.isUpdating = this.state.isUpdating;

    data.parentPermlink = form.topics.length ? form.topics[0] : 'general';

    if (this.originalBody) {
      data.originalBody = this.originalBody;
    }

    return data;
  };

  handleCancelDeleteDraft = () => this.setState({ showModalDelete: false });

  render() {
    const { initialTitle, initialTopics, initialBody, initialReward, initialUpvote } = this.state;
    const { loading, saving, locale } = this.props;

    return (
      <div className="shifted">
        <div className="post-layout container">
          <Affix className="rightContainer" stickPosition={77}>
            <div className="right">There will be info</div>
          </Affix>
          <div className="center">
            <AppendObjectPostEditor
              locale={locale}
              wobject={this.state.wobject}
              ref={this.setForm}
              saving={saving}
              title={initialTitle}
              topics={initialTopics}
              body={initialBody}
              reward={initialReward}
              upvote={initialUpvote}
              loading={loading}
              isUpdating={this.state.isUpdating}
              onUpdate={this.saveDraft}
              onSubmit={this.onSubmit}
              onDelete={this.onDelete}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default AppendObjectPostWrite;
