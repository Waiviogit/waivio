import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get, isEmpty } from 'lodash';
import { Button, Form, Input, message, Modal } from 'antd';
import { objectFields } from '../../../../common/constants/listOfFields';
import { getNewPostData } from './affiliateCodesHelper';
import { getObjectName } from '../../../../common/helpers/wObjectHelper';

const AffiliateCodesModal = ({
  intl,
  selectedObj,
  openAppendModal,
  getFieldDecorator,
  context,
  appendContext,
  loading,
  langReadable,
  user,
  form,
  setLoading,
  setOpenAppendModal,
  appendWobject,
}) => {
  const { setFieldsValue, getFieldValue, validateFieldsAndScroll } = form;
  const userUpVotePower = 100;
  const hideModal = () => {
    setFieldsValue({ [objectFields.affiliateCode]: '' });
    setOpenAppendModal(false);
  };
  const onSubmit = formValues => {
    const postData = getNewPostData(
      formValues,
      langReadable,
      user,
      selectedObj,
      appendContext,
      userUpVotePower,
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const data of postData) {
      const field = getFieldValue('currentField');

      setLoading(true);
      appendWobject(data, {
        votePercent: data.votePower,
        follow: formValues.follow,
        isLike: data.isLike,
        isObjectPage: false,
        isUpdatesPage: false,
        host: appendContext === 'PERSONAL' ? undefined : context,
      })
        .then(r => {
          setOpenAppendModal(false);
          setLoading(false);
          setFieldsValue({ [objectFields.affiliateCode]: '' });

          const mssg = get(r, ['value', 'message']);

          if (mssg) {
            message.error(mssg);
          } else {
            message.success(
              intl.formatMessage(
                {
                  id: `added_field_to_wobject_${field}`,
                  defaultMessage: `You successfully have added the {field} field to {wobject} object`,
                },
                {
                  field: getFieldValue('currentField'),
                  wobject: getObjectName(selectedObj),
                },
              ),
            );
          }
        })
        .catch(() => {
          message.error(
            intl.formatMessage({
              id: 'couldnt_append',
              defaultMessage: "Couldn't add the field to object.",
            }),
          );

          setLoading(false);
          setOpenAppendModal(false);
        });
    }
  };
  const handleSubmit = event => {
    if (event) event.preventDefault();
    validateFieldsAndScroll((err, values) => {
      onSubmit(values);
    });
  };

  return (
    <Modal
      title={`Affiliate program: ${selectedObj.name}`}
      footer={null}
      visible={openAppendModal}
      onCancel={hideModal}
      maskClosable={false}
      width={600}
    >
      <Form className="AppendForm" layout="vertical" onSubmit={handleSubmit}>
        <>
          <p className={'ant-modal-title'}>Affiliate code:</p>
          <Form.Item>
            {getFieldDecorator(objectFields.affiliateCode, {
              rules: [
                {
                  required: true,
                  message: 'Please input your username!',
                },
                {
                  max: 200,
                  message: "Value can't be longer than 200 characters.",
                },
              ],
            })(
              <Input
                autoFocus
                placeholder={intl.formatMessage({
                  id: 'my_affiliate_code',
                  defaultMessage: 'My affiliate code',
                })}
              />,
            )}
          </Form.Item>
          <div className={'mt3'}>
            <p>{`CONTEXT: ${context}`}</p>
          </div>
        </>
        <Form.Item className="AppendForm__bottom__submit">
          <Button className="AppendForm__cancel mr2" type="secondary" onClick={hideModal}>
            <FormattedMessage id={'cancel'} defaultMessage={'Cancel'} />
          </Button>
          <Button
            className="AppendForm__submit"
            type="primary"
            loading={loading}
            disabled={isEmpty(getFieldValue(objectFields.affiliateCode)) || loading}
            onClick={handleSubmit}
          >
            <FormattedMessage
              id={loading ? 'post_send_progress' : 'append_send'}
              defaultMessage={loading ? 'Submitting' : 'Suggest'}
            />
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

AffiliateCodesModal.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  selectedObj: PropTypes.shape(),
  form: PropTypes.shape(),
  user: PropTypes.shape(),
  openAppendModal: PropTypes.bool,
  setOpenAppendModal: PropTypes.func,
  setLoading: PropTypes.func,
  getFieldValue: PropTypes.func,
  getFieldDecorator: PropTypes.func,
  appendWobject: PropTypes.func,
  loading: PropTypes.bool,
  context: PropTypes.string,
  appendContext: PropTypes.string,
  langReadable: PropTypes.string,
};

export default AffiliateCodesModal;
