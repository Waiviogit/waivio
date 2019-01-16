import React from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { getPosts, getFeed, getObject, getReadLanguages } from '../reducers';
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
import AppendButton from './AppendButton';
import AppendModal from './AppendModal';
import SortSelector from '../components/SortSelector/SortSelector';

@connect(
  state => ({
    feed: getFeed(state),
    comments: getPosts(state),
    object: getObject(state),
    readLanguages: getReadLanguages(state),
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
    readLanguages: PropTypes.arrayOf(PropTypes.string),
    object: PropTypes.shape(),
  };

  static defaultProps = {
    getObjectComments: () => {},
    readLanguages: ['en-US'],
    comments: {},
    object: {},
  };

  state = {
    showModal: false,
    sort: 'recency',
  };

  componentDidMount() {
    const { object, match } = this.props;

    if (object && object.author && object.author_permlink) {
      this.props.getObjectComments(object.author, object.author_permlink);
      if (match.params.field) {
        this.handleFieldChange(match.params.field);
      }
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
      if (match.params.field) {
        this.handleFieldChange(match.params.field);
      }
    }
  }

  handleFieldChange = field => {
    const { object, history } = this.props;
    history.push(
      `/object/${object.author_permlink}/${object.default_name}/${
        field ? `updates/${field}` : 'updates'
      }`,
    );
    this.setState({ field });
  };

  handleLocaleChange = locale => this.setState({ locale });

  handleToggleModal = () =>
    this.setState(prevState => ({
      showModal: !prevState.showModal,
    }));

  handleSortChange = sort => this.setState({ sort });

  render() {
    const { field, locale, showModal, sort } = this.state;
    const { feed, object, comments, readLanguages } = this.props;

    const commentIds = getFeedFromState('comments', object.author, feed);
    const content = getFilteredContent(
      Object.values(comments).filter(comment => commentIds.includes(comment.id)),
      'appendObject',
      field,
      locale,
      sort,
    );
    const isFetching = getFeedLoadingFromState('comments', object.author, feed);
    const usedByUserLanguages = [];
    const filteredLanguages = LANGUAGES.filter(lang => {
      if (readLanguages.includes(lang.id)) {
        usedByUserLanguages.push(lang);
        return false;
      }
      return true;
    });
    return (
      <React.Fragment>
        {!isFetching && (
          <React.Fragment>
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
                  <Select.Option key={f}>
                    <FormattedMessage id={`object_field_${f}`} defaultMessage={f} />
                  </Select.Option>
                ))}
              </Select>
              <Select
                allowClear
                placeholder={<FormattedMessage id="language" defaultMessage="All languages" />}
                onChange={this.handleLocaleChange}
              >
                {usedByUserLanguages.length > 0 &&
                  usedByUserLanguages.map(lang => (
                    <Select.Option key={lang.id} value={lang.id}>
                      {getLanguageText(lang)}
                    </Select.Option>
                  ))}
                {filteredLanguages.map(lang => (
                  <Select.Option key={lang.id} value={lang.id}>
                    {getLanguageText(lang)}
                  </Select.Option>
                ))}
              </Select>
              <AppendButton toggleModal={this.handleToggleModal} />
              <AppendModal
                showModal={showModal}
                hideModal={this.handleToggleModal}
                locale={this.state.locale}
                field={this.state.field}
              />
            </div>
            <div className="wobj-history__sort">
              <SortSelector sort={sort} onChange={this.handleSortChange}>
                <SortSelector.Item key="rank">
                  <FormattedMessage id="rank" defaultMessage="Rank">
                    {msg => msg.toUpperCase()}
                  </FormattedMessage>
                </SortSelector.Item>
                <SortSelector.Item key="recency">
                  <FormattedMessage id="recency" defaultMessage="Recency">
                    {msg => msg.toUpperCase()}
                  </FormattedMessage>
                </SortSelector.Item>
              </SortSelector>
            </div>
          </React.Fragment>
        )}
        <Feed content={content} isFetching={isFetching} />
      </React.Fragment>
    );
  }
}
