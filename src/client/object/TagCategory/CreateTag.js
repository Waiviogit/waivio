import React from 'react';
import _, { map } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { bindActionCreators } from 'redux';
import { Button, Form, Select, Modal, message } from 'antd';
import { getObjectTagCategory, getObject } from '../../reducers';
import { objectFields } from '../../../common/constants/listOfFields';
import { appendObject } from '../appendActions';
import { getField, generatePermlink } from '../../helpers/wObjectHelper';
import './CreateTag.less';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { fieldsRules } from '../const/appendFormConstants';
import { getClientWObj } from '../../adapters';

@connect(
  state => ({
    currentUsername: getObject(state),
    wObject: getObject(state),
    categories: getObjectTagCategory(state),
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
    categoryItemList: [],
    loading: false,
    selectedObjects: [],
  };

  getFieldRules = fieldName => {
    const { intl } = this.props;
    const rules = fieldsRules[fieldName] || [];
    return rules.map(rule => {
      if (_.has(rule, 'message')) {
        return {
          ...rule,
          message: intl.formatMessage(
            _.get(rule, 'message.intlId'),
            _.get(rule, 'message.intlMeta'),
          ),
        };
      }
      if (_.has(rule, 'validator')) {
        return { validator: this.validateFieldValue };
      }
      return rule;
    });
  };

  validateFieldValue = (rule, value, callback) => {
    const { intl, wObject, form } = this.props;
    const currentField = form.getFieldValue('currentField');
    const currentLocale = form.getFieldValue('currentLocale');

    const filtered = wObject.fields.filter(
      f => f.locale === currentLocale && f.name === currentField,
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

  getWobjectField = categoryItems => {
    const currentLocale = this.props.form.getFieldValue('currentLocale');
    return {
      name: 'categoryItem',
      body: [...categoryItems],
      locale: currentLocale,
      category_id: this.props.selectedCategory.id,
    };
  };

  getWobjectBody = () => {
    const { currentUsername, selectedCategory } = this.props;
    let categoryItemList = `\n`;

    this.state.categoryItemList.forEach(tag => {
      if (!_.isEmpty(tag)) {
        categoryItemList += `\n ${tag.name}:`;
      }
    });

    return `@${currentUsername} added to category ${selectedCategory.name} fallowing category items:\n ${categoryItemList}`;
  };

  handlePreviewCancel = () => this.setState({ previewVisible: false });

  handleSubmit = e => {
    e.preventDefault();

    const { selectedCategory, hideModal, intl } = this.props;
    const { categoryItemList } = this.state;

    this.props.form.validateFields(err => {
      if (!err) {
        this.setState({ loading: true });

        this.appendTags(categoryItemList)
          .then(() => {
            hideModal();
            this.setState({ categoryItemList: [], uploadingList: [], loading: false });
            message.success(
              intl.formatMessage(
                {
                  id: 'added_image_to_album',
                  defaultMessage: `@{user} added a new tag to category {category}`,
                },
                {
                  category: selectedCategory,
                },
              ),
            );
          })
          .catch(() => {
            message.error(
              intl.formatMessage({
                id: 'couldnt_upload_image',
                defaultMessage: "Couldn't add item to the category.",
              }),
            );
            this.setState({ loading: false });
          });
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
    data.wobjectName = getField(wObject, objectFields.name);
    return data;
  };

  appendTags = async categoryItems => {
    const data = this.getWobjectData();

    /* eslint-disable no-restricted-syntax */
    const postData = {
      ...data,
      permlink: `${data.author}-${generatePermlink()}`,
      field: this.getWobjectField(categoryItems),
      body: this.getWobjectBody(),
    };

    /* eslint-disable no-await-in-loop */
    const response = await this.props.appendObject(postData);
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (response.value.transactionId) {
      const filteredTagsList = this.state.fileList.filter(
        (item, index) => item.id !== categoryItems[index].id,
      );
      this.setState({ categoryItemList: filteredTagsList });
    }
  };

  handleModalCancel = () => {
    this.props.hideModal();
    this.setState({ categoryItemList: [] });
  };

  handleSelectObject = obj => {
    const currentField = this.props.form.getFieldValue('currentField');
    if (obj && obj.id) {
      this.props.form.setFieldsValue({
        [currentField]: [...this.state.categoryItemList, obj],
      });
      this.setState({ categoryItemList: [...this.state.categoryItemList, obj] });
    }
  };

  render() {
    const { showModal, form, intl, selectedCategory, categories } = this.props;
    const { categoryItemList, loading } = this.state;
    const currentsTags = selectedCategory.categoryItems.map(tag =>
      getClientWObj(getObject(tag.name)),
    );
    return (
      <Modal
        title={intl.formatMessage({
          id: 'add_new_image',
          defaultMessage: 'Add new tag',
        })}
        footer={null}
        visible={showModal}
        onCancel={this.handleModalCancel}
        width={767}
        destroyOnClose
      >
        <Form className="CreateTag" layout="vertical">
          <Form.Item>
            {form.getFieldDecorator('tagCategory', {
              initialValue: selectedCategory ? selectedCategory.id : 'Choose a category',
              rules: this.getFieldRules(objectFields.tagCategory),
            })(
              <Select disabled={loading}>
                {map(categories, category => (
                  <Select.Option key={`${category.id}`} value={category.name}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>

          <Form.Item>
            {form.getFieldDecorator(objectFields.categoryItem, {
              rules: this.getFieldRules(objectFields.categoryItem),
            })(
              <SearchObjectsAutocomplete
                handleSelect={this.handleSelectObject}
                objectType="hashtag"
              />,
            )}
            {!_.isEmpty(currentsTags) &&
              currentsTags.map(tag => <ObjectCardView wObject={tag} small />)}
            {!_.isEmpty(categoryItemList) &&
              categoryItemList.map(obj => <ObjectCardView wObject={obj} small />)}
          </Form.Item>
          <Form.Item className="CreateTag__submit">
            <Button type="primary" disabled={loading} onClick={this.handleSubmit}>
              {intl.formatMessage({
                id: 'categoryItems_append_send',
                defaultMessage: 'Submit categoryItems',
              })}
            </Button>
          </Form.Item>
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
  categories: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  currentUsername: PropTypes.shape(),
  wObject: PropTypes.shape(),
  appendObject: PropTypes.func,
  selectedCategory: PropTypes.string.isRequired,
};

CreateTag.defaultProps = {
  currentUsername: {},
  wObject: {},
  appendObject: () => {},
  addImageToAlbumStore: () => {},
};

export default injectIntl(Form.create()(CreateTag));
