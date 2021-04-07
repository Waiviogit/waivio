import React from 'react';
import PropTypes from 'prop-types';
import { Select, Icon } from 'antd';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { isEmpty, size } from 'lodash';

import { getReadLanguages, getObjectAlbums, getIsAppendLoading } from '../store/reducers';
import { objectFields, sortingMenuName } from '../../common/constants/listOfFields';
import LANGUAGES from '../translations/languages';
import { getLanguageText } from '../translations';
import AppendModal from './AppendModal/AppendModal';
import IconButton from '../components/IconButton';
import SortSelector from '../components/SortSelector/SortSelector';
import OBJECT_TYPE from './const/objectTypes';
import { AppSharedContext } from '../Wrapper';
import AppendCard from './AppendCard/AppendCard';
import Loading from '../components/Icon/Loading';
import { getObjectName, isPhotosAlbumExist } from '../helpers/wObjectHelper';
import { getExposedFieldsByObjType } from './wObjectHelper';
import { getRate, getRewardFund } from '../store/appStore/appSelectors';
import { getIsAuthenticated } from '../store/authStore/authSelectors';
import { getPosts } from '../store/postsStore/postsSelectors';
import { getObject } from '../store/wObjectStore/wObjectSelectors';

import './WobjHistory.less';

@connect(state => ({
  comments: getPosts(state),
  object: getObject(state),
  readLanguages: getReadLanguages(state),
  isAuthenticated: getIsAuthenticated(state),
  albums: getObjectAlbums(state),
  rewardFund: getRewardFund(state),
  rate: getRate(state),
  appendLoading: getIsAppendLoading(state),
}))
class WobjHistory extends React.Component {
  static propTypes = {
    history: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    toggleViewEditMode: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    readLanguages: PropTypes.arrayOf(PropTypes.string),
    object: PropTypes.shape(),
    rewardFund: PropTypes.shape({
      recent_claims: PropTypes.string,
      reward_balance: PropTypes.string,
    }).isRequired,
    rate: PropTypes.number.isRequired,
    appendLoading: PropTypes.bool,
    albums: PropTypes.shape(),
    appendAlbum: PropTypes.func,
  };

  static defaultProps = {
    readLanguages: ['en-US'],
    isAuthenticated: false,
    appendLoading: false,
    comments: {},
    object: {},
    albums: [],
    appendAlbum: () => {},
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { match } = nextProps;
    const { field } = prevState;

    if (field !== match.params[1]) {
      return { field: match.params[1] };
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      field: props.match.params[1] || '',
      showModal: false,
      showModalGalleryItem: false,
      showModalGalleryAlbum: false,
      showModalCategoryItem: false,
      sort: 'recency',
      locale: 'en-US',
    };
  }

  handleFieldChange = field => {
    const { object, history } = this.props;

    history.push(`/object/${object.author_permlink}/${field ? `updates/${field}` : 'updates'}`);
    this.setState({ field });
  };

  handleLocaleChange = locale => this.setState({ locale });

  handleAddBtnClick = () => {
    const { history, match, object, toggleViewEditMode } = this.props;

    if (match.params[1] === objectFields.pageContent) {
      toggleViewEditMode(true);
      history.push(`/object/${object.author_permlink}/${OBJECT_TYPE.PAGE}`);
    } else {
      this.handleToggleModal();
    }
  };

  handleToggleModal = () => {
    const { match, albums, appendAlbum } = this.props;

    if (match.params[1] === objectFields.galleryItem && !isPhotosAlbumExist(albums)) {
      appendAlbum();
    }
    this.setState({ showModal: !this.state.showModal });
  };

  handleSortChange = sort => this.setState({ sort });

  sortedList = (wobj, voteValue, sort) => {
    switch (sort) {
      case 'vote':
        return wobj.fields.sort((before, after) => voteValue(after) - voteValue(before));

      case 'approval':
        return wobj.fields.sort((before, after) => after.approvePercent - before.approvePercent);
      default:
        return wobj.fields.sort((before, after) => after.createdAt - before.createdAt);
    }
  };

  render() {
    const { field, showModal, sort } = this.state;
    const { object, readLanguages, isAuthenticated, rewardFund, rate, appendLoading } = this.props;
    const { params } = this.props.match;
    const isFullParams =
      rewardFund && rewardFund.recent_claims && rewardFund.reward_balance && rate;
    const voteValue = post =>
      isFullParams
        ? (post.weight / rewardFund.recent_claims) *
          rewardFund.reward_balance.replace(' HIVE', '') *
          rate *
          1000000
        : 0;

    let content = object && object.fields && this.sortedList(object, voteValue, sort);
    const isFetched = !isEmpty(content) && content[0].name;
    const usedByUserLanguages = [];
    const filteredLanguages = LANGUAGES.filter(lang => {
      if (readLanguages.includes(lang.id)) {
        usedByUserLanguages.push(lang);

        return false;
      }

      return true;
    });

    if (params[1] && isFetched) {
      if (sortingMenuName[params[1]]) {
        content = content.filter(f => f.name === objectFields.listItem && f.type === params[1]);
      } else {
        content = content.filter(f => {
          const type = params[1] === objectFields.form ? 'form' : params[1];

          return f.name === type;
        });
      }
    }

    const objName = getObjectName(object);

    const renderFields = () => {
      if (!appendLoading) {
        return size(content) ? (
          content.map(post => <AppendCard key={post.permlink} post={post} />)
        ) : (
          <div className="object-feed__row justify-center">
            <FormattedMessage
              id="empty_object_profile"
              defaultMessage="Be the first to write a review"
            />
          </div>
        );
      }

      return <Loading />;
    };

    return (
      <React.Fragment>
        <div className="wobj-history__filters">
          <Select
            placeholder={
              <FormattedMessage id="object_field_placeholder" defaultMessage="Object field" />
            }
            value={field}
            onChange={this.handleFieldChange}
          >
            {getExposedFieldsByObjType(this.props.object).map(f => (
              <Select.Option key={f}>
                <FormattedMessage id={`object_field_${f}`} defaultMessage={f} />
              </Select.Option>
            ))}
          </Select>
          <Select
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
          {isAuthenticated && (
            <React.Fragment>
              <IconButton
                icon={<Icon type="plus-circle" />}
                onClick={this.handleAddBtnClick}
                caption={<FormattedMessage id="add_new_proposition" defaultMessage="Add" />}
              />
              {showModal && (
                <AppendModal
                  showModal={showModal}
                  hideModal={this.handleToggleModal}
                  chosenLocale={this.state.locale}
                  field={this.state.field}
                  objName={objName}
                />
              )}
            </React.Fragment>
          )}
        </div>
        {isFetched && (
          <div className="wobj-history__sort">
            <SortSelector sort={sort} onChange={this.handleSortChange}>
              <SortSelector.Item key="recency">
                <FormattedMessage id="recency" defaultMessage="Recency">
                  {msg => msg.toUpperCase()}
                </FormattedMessage>
              </SortSelector.Item>
              <SortSelector.Item key="vote">
                <FormattedMessage id="vote_count_tag" defaultMessage="Vote count">
                  {msg => msg.toUpperCase()}
                </FormattedMessage>
              </SortSelector.Item>
              <SortSelector.Item key="approval">
                <FormattedMessage id="approval" defaultMessage="Approval">
                  {msg => msg.toUpperCase()}
                </FormattedMessage>
              </SortSelector.Item>
            </SortSelector>
          </div>
        )}
        {renderFields()}
      </React.Fragment>
    );
  }
}

export default props => (
  <AppSharedContext.Consumer>
    {context => <WobjHistory {...props} {...context} />}
  </AppSharedContext.Consumer>
);
