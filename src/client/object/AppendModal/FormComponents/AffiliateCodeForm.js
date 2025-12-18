import React, { useCallback, useEffect, useState } from 'react';
import { Form, Icon, Progress, Select } from 'antd';
import { debounce, isEmpty } from 'lodash';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import { objectFields } from '../../../../common/constants/listOfFields';
import { getWebsites } from '../../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import PercentChanger from './PercentChanger';
import { createCodesList } from '../../../websites/WebsiteTools/AffiliateCodes/helpers';

const AffiliateCodeForm = ({ getFieldDecorator, getFieldRules, loading, intl, setFieldsValue }) => {
  const host = typeof location !== 'undefined' && location.hostname;
  const [context, setContext] = useState([host, 'PERSONAL']);
  const [items, setItem] = useState([]);
  const [percents, setPercents] = useState([]);
  const [codes, setCodes] = useState([]);
  const [weightBuffer, setWeightBuffer] = useState(100);
  const userName = useSelector(getAuthenticatedUserName);

  useEffect(() => {
    setWeightBuffer(Object.values(percents).reduce((res, curr) => res - curr, 100));
  }, [percents]);

  useEffect(() => {
    setFieldsValue({ affiliateCode: createCodesList(codes, percents, weightBuffer) });
  }, [codes, percents, weightBuffer]);

  useEffect(() => {
    getWebsites(userName).then(sites => setContext([...context, ...sites.map(s => s.host)]));
  }, [userName, host]);

  const onChangeSlider = (value, i) => {
    const newPercents = [...percents];

    newPercents.splice(i, 1, value);

    setPercents(newPercents);
  };

  const handleAddNewCode = () => {
    if (isEmpty(codes)) return;
    const i = items.length + 1;

    setItem([...items, i]);
    setPercents([...percents, 1]);
  };

  const handleChange = useCallback(
    debounce((value, i) => {
      const newCodes = [...codes];

      newCodes.splice(i, 1, value);
      setCodes(newCodes);
    }, 300),
    [codes],
  );

  return (
    <>
      <p className={'ant-form-item-label AppendForm__appendTitles'}>Context</p>
      <Form.Item>
        {getFieldDecorator(objectFields.affiliateContext, {
          initialValue: host,
          rules: getFieldRules(objectFields.affiliateContext),
        })(
          <Select defaultValue={host} showSearch disabled={loading}>
            {context?.map(site => (
              <Select.Option key={site} value={site} label={site}>
                {site}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      {getFieldDecorator(objectFields.affiliateCode, {
        initialValue: [],
        // rules: getFieldRules(objectFields.affiliateContext),
      })(
        <div>
          <p className={'ant-form-item-label AppendForm__appendTitles'}>Affiliate code 1</p>
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
        </div>,
      )}

      {items.map(i => {
        const index = i + 1;

        return (
          <React.Fragment key={index}>
            <p className={'ant-form-item-label AppendForm__appendTitles'}>Affiliate code {index}</p>
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
                percents.filter((_, indx) => i - 1 !== indx).reduce((acc, elem) => acc + elem, 0)
              }
            />
          </React.Fragment>
        );
      })}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '5px',
          cursor: isEmpty(codes) ? 'not-allowed' : 'pointer',
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
        <span>Add new codes</span>
      </span>
    </>
  );
};

AffiliateCodeForm.propTypes = {
  getFieldDecorator: PropTypes.func,
  getFieldRules: PropTypes.func,
  setFieldsValue: PropTypes.func,
  intl: PropTypes.shape(),
  loading: PropTypes.bool,
};

export default injectIntl(AffiliateCodeForm);
