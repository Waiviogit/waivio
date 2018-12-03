import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { replace } from 'react-router-redux';
import 'url-search-params-polyfill';
import { message } from 'antd';
import { injectIntl } from 'react-intl';
import improve from '../../helpers/improve';
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
import CurrentObjectFields from './CurrentObjectFields';
import LANGUAGES from '../../translations/languages';
import config from '../../../waivioApi/routes';

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
    locale: PropTypes.string,
    newPost: PropTypes.func,
    history: PropTypes.shape(),
  };

  static defaultProps = {
    saving: false,
    draftId: null,
    locale: 'auto',
    upvoteSetting: true,
    newPost: () => {},
    replace: () => {},
    history: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      initialTopics: [],
      initialBody: '',
      initialUpvote: this.props.upvoteSetting,
      initialUpdatedDate: Date.now(),
      isUpdating: false,
      showModalDelete: false,
      wobject: {},
      currentField: 'name',
      locale: this.props.locale,
    };
  }

  componentDidMount() {
    this.props.newPost();
    this.props.getObject(this.props.match.params.name).then(wobject => {
      this.setState({ wobject, isFetching: false });
    });
  }

  onSubmit = form => {
    const data = this.getNewPostData(form);
    data.body = improve(data.body);

    fetch(`${config.objectsBot.apiPrefix}${config.objectsBot.appendObject}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(() => {
        this.props.history.push('/');
        message.success(
          `You successfully have added the '${data.field.name}' field to '${
            data.parentAuthor
          }' object`,
        );
      })
      .catch(err => {
        message.error(err.message);
        console.log('err', err);
      });
  };

  getNewPostData = form => {
    const data = {};

    data.author = this.props.user.name || '';
    data.parentAuthor = this.state.wobject.value.author_permlink.split('_')[0];
    data.parentPermlink = this.state.wobject.value.author_permlink.split('_')[1];
    data.body = form.preview;
    data.title = '';

    data.field = {
      name: this.state.currentField,
      body: form.value === 'backgroundImage' ? `<center>${form.value}</center>` : form.value,
      locale: this.state.locale,
    };

    data.permlink = `${data.author}-${Math.random()
      .toString(36)
      .substring(2)}`;
    data.lastUpdated = Date.now();

    if (this.state.isUpdating) data.isUpdating = this.state.isUpdating;

    return data;
  };

  changeCurrentField = currentField => this.setState({ currentField });

  changeCurrentLocale = locale => this.setState({ locale });

  render() {
    const { initialTopics, initialBody, initialUpvote, locale } = this.state;
    const { loading, saving } = this.props;
    const currentLocaleInList = LANGUAGES.find(element => element.id === locale);

    return (
      <div className="shifted">
        <div className="post-layout container">
          <Affix className="rightContainer" stickPosition={77}>
            <div className="right">
              <CurrentObjectFields
                wobject={this.state.wobject.value}
                currentField={this.state.currentField}
                currentLocaleInList={currentLocaleInList}
              />
            </div>
          </Affix>
          <div className="center">
            <AppendObjectPostEditor
              currentLocaleInList={currentLocaleInList}
              currentField={this.state.currentField}
              changeCurrentField={this.changeCurrentField}
              changeCurrentLocale={this.changeCurrentLocale}
              wobject={this.state.wobject.value}
              saving={saving}
              topics={initialTopics}
              body={initialBody}
              upvote={initialUpvote}
              loading={loading}
              isUpdating={this.state.isUpdating}
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
