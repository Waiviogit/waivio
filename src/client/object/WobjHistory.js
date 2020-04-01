import React from 'react';
import PropTypes from 'prop-types';
import { Select, Icon } from 'antd';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import {
  getPosts,
  getObject,
  getReadLanguages,
  getIsAuthenticated,
  getObjectAlbums,
} from '../reducers';
import {
  objectFields,
  getAllowedFieldsByObjType,
  sortingMenuName,
} from '../../common/constants/listOfFields';
import LANGUAGES from '../translations/languages';
import { getLanguageText } from '../translations';
import AppendModal from './AppendModal';
import IconButton from '../components/IconButton';
import SortSelector from '../components/SortSelector/SortSelector';
import { getFieldWithMaxWeight } from './wObjectHelper';
import OBJECT_TYPE from './const/objectTypes';
import CreateImage from './ObjectGallery/CreateImage';
import CreateAlbum from './ObjectGallery/CreateAlbum';
import CreateTag from './TagCategory/CreateTag';
import { AppSharedContext } from '../Wrapper';
import { getObjectAppends } from './wobjActions';
import AppendCard from './AppendCard';
import Loading from '../components/Icon/Loading';

import './WobjHistory.less';

@connect(
  state => ({
    comments: getPosts(state),
    object: getObject(state),
    readLanguages: getReadLanguages(state),
    isAuthenticated: getIsAuthenticated(state),
    albums: getObjectAlbums(state),
  }),
  {
    getObjectAppends,
  },
)
class WobjHistory extends React.Component {
  static propTypes = {
    history: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    toggleViewEditMode: PropTypes.func.isRequired,
    getObjectAppends: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    readLanguages: PropTypes.arrayOf(PropTypes.string),
    object: PropTypes.shape(),
  };

  static defaultProps = {
    getObjectComments: () => {},
    readLanguages: ['en-US'],
    isAuthenticated: false,
    comments: {},
    object: {},
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
    };
  }

  componentDidMount() {
    const { object } = this.props;
    if (object && object.author && object.author_permlink) {
      this.props.getObjectAppends(object.author, object.author_permlink);
    }
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
    if (this.state.field === objectFields.galleryItem) {
      this.setState(prevState => ({ showModalGalleryItem: !prevState.showModalGalleryItem }));
    } else if (this.state.field === objectFields.galleryAlbum) {
      this.setState(prevState => ({ showModalGalleryAlbum: !prevState.showModalGalleryAlbum }));
    } else if (this.state.field === objectFields.categoryItem) {
      this.setState(prevState => ({ showModalCategoryItem: !prevState.showModalCategoryItem }));
    } else {
      this.setState({ showModal: !this.state.showModal });
    }
  };

  handleSortChange = sort => this.setState({ sort });

  render() {
    const {
      field,
      showModal,
      showModalGalleryItem,
      showModalGalleryAlbum,
      showModalCategoryItem,
      sort,
    } = this.state;
    const { object, readLanguages, isAuthenticated } = this.props;
    const { params } = this.props.match;
    const sortedList = wobj => {
      if (sort !== 'recency') {
        return wobj.fields.sort(
          (before, after) => after.append_field_weight - before.append_field_weight,
        );
      }

      return wobj.fields.sort(
        (before, after) => Date.parse(after.created) - Date.parse(before.created),
      );
    };
    let content = object && object.fields && sortedList(object);
    const isFetching = content && content.length && content[0].append_field_name;
    const usedByUserLanguages = [];
    const filteredLanguages = LANGUAGES.filter(lang => {
      if (readLanguages.includes(lang.id)) {
        usedByUserLanguages.push(lang);
        return false;
      }
      return true;
    });

    if (params[1] && content && content[0].append_field_name) {
      content = content.filter(
        f =>
          sortingMenuName[params[1]] === f.append_field_name || f.append_field_name === params[1],
      );
    }

    const objName = getFieldWithMaxWeight(object, objectFields.name);
    const renderFields = () => {
      if (content && content.length) {
        if (content[0].append_field_name) {
          return content.map(post => <AppendCard post={post} />);
        }

        return <Loading />;
      }

      return (
        <div className="object-feed__row justify-center">
          <FormattedMessage
            id="empty_object_profile"
            defaultMessage="This object doesn't have any"
          />
        </div>
      );
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
            {getAllowedFieldsByObjType(this.props.object.object_type).map(f => (
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
              <CreateImage showModal={showModalGalleryItem} hideModal={this.handleToggleModal} />
              <CreateAlbum showModal={showModalGalleryAlbum} hideModal={this.handleToggleModal} />
              <CreateTag showModal={showModalCategoryItem} hideModal={this.handleToggleModal} />
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
        {isFetching && (
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
