import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { debounce, get, isEmpty } from 'lodash';
import { Button, Form, Icon, Input, message, Modal, Progress } from 'antd';
import { objectFields } from '../../../../common/constants/listOfFields';
import { getNewPostData } from './affiliateCodesHelper';
import { getObjectName } from '../../../../common/helpers/wObjectHelper';
import { isGuestUser } from '../../../../store/authStore/authSelectors';
import PercentChanger from '../../../object/AppendModal/FormComponents/PercentChanger';

const guestUpVotingPower = 10000;

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
  voteAppend,
  affiliateObjects,
}) => {
  const { setFieldsValue, getFieldValue, validateFieldsAndScroll } = form;
  const isGuest = useSelector(isGuestUser);
  const userUpVotePower = 100;
  const hideModal = () => {
    setFieldsValue({ [objectFields.affiliateCode]: [] });
    setOpenAppendModal(false);
  };
  const [items, setItem] = useState([]);
  const [percents, setPercents] = useState([]);
  const [codes, setCodes] = useState([]);
  const [weightBuffer, setWeightBuffer] = useState(100);
  const totalUsedPercents = useMemo(() => percents.reduce((acc, num) => acc + num, 0), [percents]);
  const createCodesList = () => {
    if (codes.length === 1) return codes;

    return codes.reduce(
      (acc, curr, i) =>
        i ? [...acc, `${curr}::${percents[i - 1]}`] : [`${curr}::${weightBuffer}`],
      [],
    );
  };

  useEffect(() => {
    setWeightBuffer(Object.values(percents).reduce((res, curr) => res - curr, 100));
  }, [percents]);

  useEffect(() => {
    setFieldsValue({ affiliateCode: createCodesList() });
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

  const addAffilicateCode = (dup, data, formValues) => {
    if (dup) {
      return voteAppend(
        dup.author,
        selectedObj.author_permlink,
        dup.permlink,
        isGuest ? guestUpVotingPower : userUpVotePower,
        user.name,
        appendContext === 'PERSONAL' ? undefined : context,
      );
    }

    return appendWobject(data, {
      votePercent: isGuest ? guestUpVotingPower : data.votePower,
      follow: formValues.follow,
      isLike: data.isLike,
      isObjectPage: false,
      isUpdatesPage: false,
      host: appendContext === 'PERSONAL' ? undefined : context,
    });
  };

  const onSubmit = formValues => {
    const currObj = affiliateObjects?.find(obj => obj.name === selectedObj.name);
    // eslint-disable-next-line array-callback-return,consistent-return
    const duplicate = currObj?.affiliateCodeFields?.find(update => {
      if (update.name === 'affiliateCode') {
        const affCode = JSON.parse(update?.body)[1];

        return affCode === formValues.affiliateCode;
      }
    });

    const postData = getNewPostData(
      formValues,
      langReadable,
      user,
      selectedObj,
      appendContext,
      isGuest ? guestUpVotingPower : userUpVotePower,
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const data of postData) {
      const field = getFieldValue('currentField');

      setLoading(true);
      addAffilicateCode(duplicate, data, formValues)
        .then(r => {
          setOpenAppendModal(false);
          setLoading(false);
          setFieldsValue({ [objectFields.affiliateCode]: [] });

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
          <p className={'ant-modal-title'}>
            {intl.formatMessage({
              id: 'affiliate_code_field_name',
              defaultMessage: 'Affiliate code',
            })}
            :
          </p>
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
                <p className={'ant-form-item-label AppendForm__appendTitles'}>
                  Affiliate code {index}
                </p>
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
                    100 -
                    percents.filter((_, indx) => i !== indx).reduce((acc, elem) => acc + elem, 0)
                  }
                />
              </React.Fragment>
            );
          })}
          <span
            onClick={() => {
              if (totalUsedPercents === 100) return;
              const i = items.length + 1;

              setItem([...items, i]);
              setPercents([...percents, 1]);
            }}
          >
            <Icon type="plus-circle" className="proposition-line__icon" /> Add new codes
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
  affiliateObjects: PropTypes.arrayOf(),
  openAppendModal: PropTypes.bool,
  setOpenAppendModal: PropTypes.func,
  setLoading: PropTypes.func,
  getFieldValue: PropTypes.func,
  getFieldDecorator: PropTypes.func,
  voteAppend: PropTypes.func,
  appendWobject: PropTypes.func,
  loading: PropTypes.bool,
  context: PropTypes.string,
  appendContext: PropTypes.string,
  langReadable: PropTypes.string,
};

export default AffiliateCodesModal;
