import React from 'react';
import { Form, Icon, Input, Rate } from 'antd';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { objectFields, ratingFields } from '../../../../../common/constants/listOfFields';

const ItemRatings = (getFieldDecorator, getFieldRules, isSomeValue, loading, intl) => (
  <React.Fragment>
    <Form.Item>
      {getFieldDecorator(objectFields.rating, {
        rules: getFieldRules(objectFields.rating),
      })(
        <Input
          className={classNames('AppendForm__input', {
            'validation-error': !isSomeValue,
          })}
          disabled={loading}
          placeholder={intl.formatMessage({
            id: 'category_rating_placeholder',
            defaultMessage: 'Category',
          })}
        />,
      )}
    </Form.Item>
    <div className="ant-form-item-label label AppendForm__appendTitles">
      <FormattedMessage id="your_vote_placeholder" defaultMessage="Your vote(optional)" />
    </div>
    <Form.Item>
      {getFieldDecorator(ratingFields.rate)(
        <Rate
          className={classNames('AppendForm__input', {
            'validation-error': !isSomeValue,
          })}
          character={<Icon type="star" style={{ fontSize: '26px' }} theme="filled" />}
          disabled={loading}
          allowClear={false}
        />,
      )}
    </Form.Item>
  </React.Fragment>
);
export default ItemRatings;
