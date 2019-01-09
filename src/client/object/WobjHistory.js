import React from 'react';
import PropTypes from 'prop-types';
import { Button, Select } from 'antd';
import { connect } from 'react-redux';
import { getCommentsList, getFeed, getObject } from '../reducers';
import Feed from '../feed/Feed';
import PostModal from '../post/PostModalContainer';
import { getFeedFromState, getFeedLoadingFromState } from '../helpers/stateHelpers';
import { getObjectComments } from '../feed/feedActions';
import { supportedObjectFields } from '../../common/constants/listOfFields';
import LANGUAGES from '../translations/languages';
import { getLanguageText } from '../translations';
import './WobjHistory.less';

@connect(
  state => ({
    feed: getFeed(state),
    commentsList: getCommentsList(state),
    object: getObject(state),
  }),
  {
    getObjectComments,
  },
)
export default class WobjHistory extends React.Component {
  static propTypes = {
    feed: PropTypes.shape().isRequired,
    getObjectComments: PropTypes.func,
    object: PropTypes.shape(),
  };

  static defaultProps = {
    getObjectComments: () => {},
    object: {},
  };

  state = {
    field: null,
    locale: null,
  };

  componentDidMount() {
    this.props.getObjectComments(this.props.object.author, this.props.object.author_permlink);
  }

  handleFieldChange = field => this.setState({ field });

  handleLocaleChange = locale => this.setState({ locale });

  render() {
    const { feed, object } = this.props;

    const content = getFeedFromState('comments', object.author, feed).sort((a, b) => b - a);
    const isFetching = getFeedLoadingFromState('comments', object.author, feed);

    return (
      <React.Fragment>
        <div className="wobj-history__filters">
          <Select onChange={this.handleFieldChange}>
            {supportedObjectFields.map(f => (
              <Select.Option key={f}>{f}</Select.Option>
            ))}
          </Select>
          <Select onChange={this.handleLocaleChange}>
            {LANGUAGES.map(lang => (
              <Select.Option key={lang.id} value={lang.id}>
                {getLanguageText(lang)}
              </Select.Option>
            ))}
          </Select>
          <Button>New proposition</Button>
        </div>
        <Feed content={content} isFetching={isFetching} />
        <PostModal />
      </React.Fragment>
    );
  }
}
