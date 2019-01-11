import React from 'react';
import PropTypes from 'prop-types';
import { Button, Select } from 'antd';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { getPosts, getFeed, getObject } from '../reducers';
import Feed from '../feed/Feed';
import {
  getFeedFromState,
  getFeedLoadingFromState,
  getFilteredContent,
} from '../helpers/stateHelpers';
import { getObjectComments } from '../feed/feedActions';
import { supportedObjectFields } from '../../common/constants/listOfFields';
import LANGUAGES from '../translations/languages';
import { getLanguageText } from '../translations';
import './WobjHistory.less';

@connect(
  state => ({
    feed: getFeed(state),
    comments: getPosts(state),
    object: getObject(state),
  }),
  {
    getObjectComments,
  },
)
export default class WobjHistory extends React.Component {
  static propTypes = {
    history: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    feed: PropTypes.shape().isRequired,
    comments: PropTypes.shape(),
    getObjectComments: PropTypes.func,
    object: PropTypes.shape(),
  };

  static defaultProps = {
    getObjectComments: () => {},
    comments: {},
    object: {},
  };

  state = {};

  componentDidMount() {
    const { object, match } = this.props;

    if (object && object.author && object.author_permlink) {
      this.props.getObjectComments(object.author, object.author_permlink);
    }
    if (match.params.field) {
      this.handleFieldChange(match.params.field);
    }
  }

  componentDidUpdate(prevProps) {
    const { object, match } = this.props;

    if (
      prevProps.match.params.field !== match.params.field &&
      this.state.field !== match.params.field
    ) {
      this.handleFieldChange(this.props.match.params.field);
    }
    if (prevProps.object.author_permlink !== object.author_permlink) {
      this.props.getObjectComments(object.author, object.author_permlink);
    }
  }

  handleFieldChange = field => {
    const { object, history } = this.props;
    history.push(
      `/object/${object.author_permlink}/${object.default_name}/${
        field ? `history/${field}` : 'history'
      }`,
    );
    this.setState({ field });
  };

  handleLocaleChange = locale => this.setState({ locale });

  render() {
    const { field, locale } = this.state;
    const { feed, object, comments } = this.props;

    const commentIds = getFeedFromState('comments', object.author, feed);
    const content = getFilteredContent(
      Object.values(comments).filter(comment => commentIds.includes(comment.id)),
      'appendObject',
      field,
      locale,
    );
    const isFetching = getFeedLoadingFromState('comments', object.author, feed);

    return (
      <React.Fragment>
        {!isFetching && (
          <div className="wobj-history__filters">
            <Select
              allowClear
              placeholder={
                <FormattedMessage id="object_field_placeholder" defaultMessage="Object field" />
              }
              value={field}
              onChange={this.handleFieldChange}
            >
              {supportedObjectFields.map(f => (
                <Select.Option key={f}>{f}</Select.Option>
              ))}
            </Select>
            <Select
              allowClear
              placeholder={<FormattedMessage id="language" defaultMessage="Language" />}
              onChange={this.handleLocaleChange}
            >
              {LANGUAGES.map(lang => (
                <Select.Option key={lang.id} value={lang.id}>
                  {getLanguageText(lang)}
                </Select.Option>
              ))}
            </Select>
            <Button>New proposition</Button>
          </div>
        )}
        <Feed content={content} isFetching={isFetching} />
      </React.Fragment>
    );
  }
}
