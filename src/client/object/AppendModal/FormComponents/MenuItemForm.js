import React, { useState } from 'react';
import { Form, Input, Select } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { menuItemFields, objectFields } from '../../../../common/constants/listOfFields';
import ImageSetter from '../../../components/ImageSetter/ImageSetter';
import SearchObjectsAutocomplete from '../../../components/EditorObject/SearchObjectsAutocomplete';
import ObjectCardView from '../../../objectCard/ObjectCardView';
import CreateObject from '../../../post/CreateObjectModal/CreateObject';

const MenuItemForm = ({
  getFieldDecorator,
  loading,
  intl,
  getImages,
  onLoadingImage,
  handleMenuItemButtonStyleChange,
  handleSelectObject,
  selectedObject,
  onObjectCardDelete,
  onCreateObject,
  menuItemButtonType,
  parentObject,
}) => {
  const link = 'link';
  const [linkType, setLinkType] = useState(link);
  const buttonStyleOptionsValues = ['standard', 'highlight', 'icon', 'image'];
  const buttonTypeOptionsValues = ['link', 'website'];
  const imageButtonType = ['icon', 'image'].includes(menuItemButtonType);

  const buttonStyleOptions = buttonStyleOptionsValues.map(op => (
    <Select.Option key={op} value={op}>
      {intl.formatMessage({ id: `option_${op}`, defaultValue: op })}
    </Select.Option>
  ));
  const buttonTypeOptions = buttonTypeOptionsValues.map(op => (
    <Select.Option key={op} value={op}>
      {intl.formatMessage({ id: `option_${op}`, defaultValue: op })}
    </Select.Option>
  ));
  const handleButtonTypeChange = type => {
    setLinkType(type);
  };

  return (
    <React.Fragment>
      <Form.Item>
        <Form.Item>
          {getFieldDecorator(
            menuItemFields.menuItemTitle,
            {},
          )(
            <Input
              className="AppendForm__input"
              disabled={loading}
              placeholder={intl.formatMessage({
                id: 'title',
                defaultMessage: 'Title',
              })}
            />,
          )}
        </Form.Item>
        <Form.Item>
          <div className="AppendForm__appendTitles">
            <FormattedMessage id="style_of_the_button" defaultMessage="Style of the button" />
          </div>
          <Select
            defaultValue={intl.formatMessage({
              id: 'option_standard',
              defaultMessage: 'Standard',
            })}
            onChange={handleMenuItemButtonStyleChange}
          >
            {buttonStyleOptions}
          </Select>
        </Form.Item>
        {imageButtonType && (
          <div className="image-wrapper">
            <Form.Item>
              {getFieldDecorator(
                objectFields.menuItem,
                {},
              )(
                <ImageSetter
                  onImageLoaded={getImages}
                  onLoadingImage={onLoadingImage}
                  labeledImage={'image_for_the_button'}
                  isMultiple={false}
                />,
              )}
            </Form.Item>
          </div>
        )}
        <Form.Item>
          <div className="AppendForm__appendTitles">
            <FormattedMessage id="link_type" defaultMessage="Link type" />
          </div>
          <Select
            defaultValue={intl.formatMessage({
              id: 'option_link',
              defaultMessage: 'Object',
            })}
            onChange={handleButtonTypeChange}
          >
            {buttonTypeOptions}
          </Select>
        </Form.Item>
        {linkType === link ? (
          <Form.Item>
            <div className="AppendForm__appendTitles">
              <FormattedMessage id="link_to_an_object" defaultMessage="Link to an object" />
            </div>
            {getFieldDecorator(
              menuItemFields.linkToObject,
              {},
            )(
              <SearchObjectsAutocomplete
                useExtendedSearch
                autoFocus
                placeholder={intl.formatMessage({
                  id: 'objects_auto_complete_placeholder',
                  defaultMessage: 'Find objects',
                })}
                handleSelect={handleSelectObject}
              />,
            )}
            {selectedObject && (
              <ObjectCardView closeButton onDelete={onObjectCardDelete} wObject={selectedObject} />
            )}
            <br />
            <div className="add-create-btns">
              <CreateObject
                withOpenModalBtn={!selectedObject}
                openModalBtnText={intl.formatMessage({
                  id: 'create_new_object',
                  defaultMessage: 'Create new object',
                })}
                currentField={menuItemFields.linkToObject}
                onCreateObject={onCreateObject}
                parentObject={parentObject}
              />
            </div>{' '}
          </Form.Item>
        ) : (
          <Form.Item>
            <div className="AppendForm__appendTitles">
              <FormattedMessage id="link_to_a_website" defaultMessage="Link to a website" />
            </div>
            {getFieldDecorator(menuItemFields.linkToWeb, {
              // rules: getFieldRules(menuItemFields.linkToWeb),
            })(
              <Input
                disabled={loading}
                placeholder={intl.formatMessage({
                  id: 'link_to_a_website',
                  defaultMessage: 'Link to a website',
                })}
              />,
            )}
          </Form.Item>
        )}
      </Form.Item>
    </React.Fragment>
  );
};

MenuItemForm.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  getImages: PropTypes.func.isRequired,
  onLoadingImage: PropTypes.func.isRequired,
  handleMenuItemButtonStyleChange: PropTypes.func.isRequired,
  handleSelectObject: PropTypes.func.isRequired,
  onObjectCardDelete: PropTypes.func.isRequired,
  onCreateObject: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  menuItemButtonType: PropTypes.string.isRequired,
  intl: PropTypes.shape().isRequired,
  parentObject: PropTypes.shape().isRequired,
  selectedObject: PropTypes.shape().isRequired,
};
export default injectIntl(MenuItemForm);
