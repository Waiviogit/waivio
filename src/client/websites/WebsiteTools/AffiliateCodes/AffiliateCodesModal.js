import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { debounce, isEmpty } from 'lodash';
import { Button, Form, Icon, Modal, Progress } from 'antd';
import { objectFields } from '../../../../common/constants/listOfFields';
import PercentChanger from '../../../object/AppendModal/FormComponents/PercentChanger';
import { createCodesList } from './helpers';

const AffiliateCodesModal = ({
  intl,
  selectedObj,
  openAppendModal,
  context,
  loading,
  form,
  setOpenAppendModal,
  onSubmit,
}) => {
  const { setFieldsValue, validateFieldsAndScroll, getFieldDecorator } = form;
  const [items, setItem] = useState([]);
  const [percents, setPercents] = useState([]);
  const [codes, setCodes] = useState([]);
  const [weightBuffer, setWeightBuffer] = useState(100);

  const resetState = () => {
    setPercents([]);
    setCodes([]);
    setItem([]);
    setWeightBuffer(100);
    setOpenAppendModal(false);
  };

  const hideModal = () => {
    resetState();
    setFieldsValue({ affiliateCode: [] });
  };

  useEffect(() => {
    setWeightBuffer(Object.values(percents).reduce((res, curr) => res - curr, 100));
  }, [percents]);

  useEffect(() => {
    setFieldsValue({ affiliateCode: createCodesList(codes, percents, weightBuffer) });
  }, [codes, percents, weightBuffer]);

  const onChangeSlider = (value, i) => {
    const newPercents = [...percents];

    newPercents.splice(i, 1, value);

    setPercents(newPercents);
  };

  const handleChange = useCallback(
    debounce((value, i) => {
      const newCodes = [...codes];

      newCodes.splice(i, 1, value);

      setCodes(newCodes);
    }, 300),
    [codes],
  );

  const handleSubmit = event => {
    if (event) event.preventDefault();
    validateFieldsAndScroll((err, values) => {
      onSubmit(values);
      resetState();
    });
  };

  const handleAddNewCode = () => {
    if (isEmpty(codes)) return;
    const i = items.length + 1;

    setItem([...items, i]);
    setPercents([...percents, 1]);
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
          <p className={'ant-modal-title'}>
            {intl.formatMessage({
              id: 'affiliate_code_field_name',
              defaultMessage: 'Affiliate code',
            })}
            :
          </p>
          <Form.Item>
            {getFieldDecorator(objectFields.affiliateCode, {
              initialValue: [],
            })(
              <div>
                <input
                  disabled={loading}
                  placeholder={`${intl.formatMessage({
                    id: 'my_affiliate_code',
                    defaultMessage: 'My affiliate code',
                  })} #1`}
                  className="ant-input"
                  onInput={e => {
                    handleChange(e.currentTarget.value, 0);
                  }}
                />
              </div>,
            )}
            <span
              style={{
                display: 'inline-block',
                marginTop: '10px',
              }}
            >
              Frequency of use: {weightBuffer}%.
            </span>
            <Progress
              status="active"
              showInfo={false}
              percent={weightBuffer}
              strokeWidth={5}
              trailColor="red"
              strokeColor={'orange'}
            />
          </Form.Item>
          {items.map(i => {
            const index = i + 1;

            return (
              <React.Fragment key={index}>
                <p className={'ant-modal-title'}>Affiliate code {index}</p>
                <input
                  disabled={loading}
                  className="ant-input"
                  placeholder={`${intl.formatMessage({
                    id: 'my_affiliate_code',
                    defaultMessage: 'My affiliate code',
                  })} #${index}`}
                  onInput={e => {
                    handleChange(e.currentTarget.value, i);
                  }}
                />
                <PercentChanger
                  onAfterChange={value => onChangeSlider(value, i - 1)}
                  max={
                    99 -
                    percents
                      .filter((_, indx) => i - 1 !== indx)
                      .reduce((acc, elem) => acc + elem, 0)
                  }
                />
              </React.Fragment>
            );
          })}
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: isEmpty(codes) ? 'not-allowed' : 'pointer',
              marginTop: '15px',
            }}
            onClick={handleAddNewCode}
          >
            <Icon
              style={{
                color: '#f87007',
                display: 'inline-block',
                marginRight: '5px',
              }}
              type="plus-circle"
              className="proposition-line__icon"
            />{' '}
            Add new codes
          </span>
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
            disabled={isEmpty(codes) || !codes[0] || loading}
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
  openAppendModal: PropTypes.bool,
  setOpenAppendModal: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  context: PropTypes.string,
};

export default AffiliateCodesModal;
