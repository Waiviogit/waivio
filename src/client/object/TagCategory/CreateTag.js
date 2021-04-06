import React from 'react';
import { map, isEmpty, get, has, filter } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { bindActionCreators } from 'redux';
import { Form, Select, Modal, message } from 'antd';
import LANGUAGES from '../../translations/languages';
import {
  getObjectTagCategory,
  getObject,
  getAuthenticatedUserName,
  getFollowingObjectsList,
  getSuitableLanguage,
  getVotePercent,
} from '../../store/reducers';
import { getObjectsByIds } from '../../../waivioApi/ApiClient';
import { objectFields } from '../../../common/constants/listOfFields';
import { appendObject } from '../appendActions';
import { generatePermlink, getObjectName } from '../../helpers/wObjectHelper';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { fieldsRules } from '../const/appendFormConstants';
import AppendFormFooter from '../AppendModal/AppendFormFooter';
import { getLanguageText } from '../../translations';
import { getVoteValue } from '../../helpers/user';
import { getRate, getRewardFund } from '../../store/appStore/appSelectors';

import './CreateTag.less';

@connect(
  state => ({
    currentUsername: getAuthenticatedUserName(state),
    wObject: getObject(state),
    categories: getObjectTagCategory(state),
    followingList: getFollowingObjectsList(state),
    locale: getSuitableLanguage(state),
    usedLocale: getSuitableLanguage(state),
    defaultVotePercent: getVotePercent(state),
    rewardFund: getRewardFund(state),
    rate: getRate(state),
  }),
  dispatch =>
    bindActionCreators(
      {
        appendObject: wObject => appendObject(wObject),
      },
      dispatch,
    ),
)
class CreateTag extends React.Component {
  state = {
    categoryItem: null,
    loading: false,
    selectedCategory: [],
    currentTags: [],
    votePercent: this.props.defaultVotePercent / 100,
    voteWorth: 0,
  };

  async componentDidMount() {
    if (
      !isEmpty(
        this.props.categories && this.props.categories[0] && this.props.categories[0].categoryItems,
      )
    ) {
      let currentTags = await getObjectsByIds({
        authorPermlinks: this.props.categories[0].categoryItems.map(tag => tag.name),
      });

      currentTags = currentTags.wobjects.map(tag => tag);
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ currentTags });
    }
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ selectedCategory: get(this.props.categories, ['0'], []) });
  }

  getFieldRules = fieldName => {
    const { intl } = this.props;
    const rules = fieldsRules[fieldName] || [];

    return rules.map(rule => {
      if (has(rule, 'message')) {
        return {
          ...rule,
          message: intl.formatMessage(get(rule, 'message.intlId'), get(rule, 'message.intlMeta')),
        };
      }
      if (has(rule, 'validator')) {
        return { validator: this.validateFieldValue };
      }

      return rule;
    });
  };

  calculateVoteWorth = value => {
    const { currentUsername, rewardFund, rate } = this.props;
    const voteWorth = getVoteValue(
      currentUsername,
      rewardFund.recent_claims,
      rewardFund.reward_balance,
      rate,
      value * 100,
    );

    this.setState({ votePercent: value, voteWorth });
  };

  validateFieldValue = (rule, value, callback) => {
    const { intl, wObject, form } = this.props;
    const currentLocale = form.getFieldValue('currentLocale');

    const filtered = wObject.fields.filter(
      f => f.locale === currentLocale && f.name === 'categoryItem',
    );

    if (filtered.map(f => f.body.toLowerCase()).includes(value)) {
      callback(
        intl.formatMessage({
          id: 'append_object_validation_msg',
          defaultMessage: 'The field with this value already exists',
        }),
      );
    }
    callback();
  };

  getWobjectField = categoryItem => ({
    name: 'categoryItem',
    body: categoryItem.author_permlink,
    locale: this.props.form.getFieldValue('currentLocale'),
    id: this.state.selectedCategory.id,
  });

  getWobjectBody = () => {
    const { currentUsername } = this.props;
    const currentLocale = this.props.form.getFieldValue('currentLocale');
    const langReadable = filter(LANGUAGES, { id: currentLocale })[0].name;
    const { categoryItem, selectedCategory } = this.state;

    return `@${currentUsername} added #tag ${categoryItem.author_permlink} (${langReadable}) into ${selectedCategory.body} category`;
  };

  handleSubmit = e => {
    e.preventDefault();

    const { hideModal, intl, currentUsername } = this.props;
    const { categoryItem, selectedCategory } = this.state;
    const currentLocale = this.props.form.getFieldValue('currentLocale');
    const langReadable = filter(LANGUAGES, { id: currentLocale })[0].name;

    this.props.form.validateFields(err => {
      if (!err) {
        this.setState({ loading: true });
        this.appendTag(categoryItem)
          .then(() => {
            hideModal();
            this.setState({ categoryItem: null, loading: false });
            message.success(
              intl.formatMessage(
                {
                  id: 'added_tags_to_category',
                  defaultMessage: `@{user} added a new #tag ({language}) to {category} category`,
                },
                {
                  user: currentUsername,
                  language: langReadable,
                  category: selectedCategory.body,
                },
              ),
            );
          })
          .catch(error => {
            console.error(error.message);
            message.error(
              intl.formatMessage({
                id: 'couldnt_upload_image',
                defaultMessage: "Couldn't add item to the category.",
              }),
            );
            this.setState({ loading: false });
          });
      } else {
        console.error(err);
      }
    });
  };

  getWobjectData = () => {
    const { currentUsername, wObject } = this.props;
    const data = {};

    data.author = currentUsername;
    data.parentAuthor = wObject.author;
    data.parentPermlink = wObject.author_permlink;
    data.title = '';
    data.lastUpdated = Date.now();
    data.wobjectName = getObjectName(wObject);
    data.votePower = this.state.votePercent !== null ? this.state.votePercent * 100 : null;

    return data;
  };

  appendTag = async categoryItem => {
    const data = this.getWobjectData();

    /* eslint-disable no-restricted-syntax */
    const postData = {
      ...data,
      permlink: `${data.author}-${generatePermlink()}`,
      field: {
        ...this.getWobjectField(categoryItem),
        tagCategory: this.state.selectedCategory.body,
      },
      body: this.getWobjectBody(),
    };

    await this.props.appendObject(postData, { votePower: postData.votePower });
  };

  handleModalCancel = () => {
    this.props.hideModal();
    this.setState({ categoryItem: null });
  };

  handleSelectObject = obj => {
    if (obj) {
      this.props.form.setFieldsValue({
        categoryItem: obj,
      });
      this.setState({ categoryItem: obj });
    }
  };

  handleSelectCategory = async value => {
    const category = this.props.categories.find(item => item.body === value);

    if (!isEmpty(category.categoryItems)) {
      let currentTags = await getObjectsByIds({
        authorPermlinks: category.categoryItems.map(tag => tag.name),
      });

      currentTags = currentTags.wobjects.map(tag => tag);
      this.setState({ selectedCategory: category, currentTags });
    } else {
      this.setState({ selectedCategory: category, currentTags: [] });
    }
  };

  render() {
    const { showModal, form, intl, categories, usedLocale } = this.props;
    const { categoryItem, loading, selectedCategory, currentTags } = this.state;
    const languageOptions = [];

    LANGUAGES.forEach(lang => {
      languageOptions.push(
        <Select.Option key={lang.id} value={lang.id}>
          {getLanguageText(lang)}
        </Select.Option>,
      );
    });

    return (
      <Modal
        title={intl.formatMessage({
          id: 'add_new_tag',
          defaultMessage: 'Add new #tag',
        })}
        footer={null}
        visible={showModal}
        onCancel={this.handleModalCancel}
        width={767}
        destroyOnClose
      >
        <Form className="CreateTag" layout="vertical">
          <div className="ant-form-item-label label AppendForm__appendTitles">
            <FormattedMessage id="suggest4" defaultMessage="I suggest to add field" />
          </div>
          <Form.Item>
            {form.getFieldDecorator('tagCategory', {
              initialValue: selectedCategory ? selectedCategory.body : 'Select a category',
              rules: this.getFieldRules(objectFields.tagCategory),
            })(
              <Select disabled={loading} onChange={this.handleSelectCategory}>
                {map(categories, category => (
                  <Select.Option key={`${category.id}`} value={category.body}>
                    {category.body}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>

          <div className="ant-form-item-label AppendForm__appendTitles">
            <FormattedMessage id="suggest2" defaultMessage="With language" />
          </div>

          <Form.Item>
            {form.getFieldDecorator('currentLocale', {
              initialValue: usedLocale,
            })(
              <Select disabled={loading} style={{ width: '100%' }}>
                {languageOptions}
              </Select>,
            )}
          </Form.Item>

          <div className="ant-form-item-label label AppendForm__appendTitles">
            <FormattedMessage id="suggest5" defaultMessage="I suggest to add field" />
          </div>

          <Form.Item>
            {form.getFieldDecorator(objectFields.categoryItem, {
              rules: this.getFieldRules(objectFields.categoryItem),
            })(
              <SearchObjectsAutocomplete
                handleSelect={this.handleSelectObject}
                objectType="hashtag"
              />,
            )}
            {categoryItem && <ObjectCardView wObject={categoryItem} />}

            {!isEmpty(currentTags) && (
              <React.Fragment>
                <div className="ant-form-item-label label AppendForm__appendTitles pt3">
                  <FormattedMessage id="already_added" defaultMessage="Already added #tags" />
                </div>
                {currentTags.map(tag => (
                  <ObjectCardView wObject={tag} key={tag.name} />
                ))}
              </React.Fragment>
            )}
          </Form.Item>
          <AppendFormFooter
            loading={loading}
            calcVote={this.calculateVoteWorth}
            form={form}
            handleSubmit={this.handleSubmit}
            votePercent={this.state.votePercent}
            voteWorth={this.state.voteWorth}
          />
        </Form>
      </Modal>
    );
  }
}

CreateTag.propTypes = {
  showModal: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
  categories: PropTypes.arrayOf(PropTypes.shape()),
  currentUsername: PropTypes.shape(),
  wObject: PropTypes.shape(),
  appendObject: PropTypes.func,
  usedLocale: PropTypes.string,
  defaultVotePercent: PropTypes.number,
  rewardFund: PropTypes.shape(),
  rate: PropTypes.number,
};

CreateTag.defaultProps = {
  currentUsername: {},
  wObject: {},
  appendObject: () => {},
  addImageToAlbumStore: () => {},
  categories: [],
  followingList: [],
  usedLocale: 'en-US',
  rewardFund: {},
  rate: 0,
  defaultVotePercent: 100,
};

export default injectIntl(Form.create()(CreateTag));
