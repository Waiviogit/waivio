import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, Icon, Progress, Select } from 'antd';
import { debounce } from 'lodash';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import { objectFields } from '../../../../common/constants/listOfFields';
import { getWebsites } from '../../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import PercentChanger from './PercentChanger';

const AffiliateCodeForm = ({ getFieldDecorator, getFieldRules, loading, intl, setFieldsValue }) => {
  const host = location.hostname;
  const [context, setContext] = useState([host, 'PERSONAL']);
  const [items, setItem] = useState([]);
  const [percents, setPercents] = useState([]);
  const [codes, setCodes] = useState([]);
  const [weightBuffer, setWeightBuffer] = useState(100);
  const userName = useSelector(getAuthenticatedUserName);
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

  useEffect(() => {
    getWebsites(userName).then(sites => setContext([...context, ...sites.map(s => s.host)]));
  }, [userName, host]);

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
                100 - percents.filter((_, indx) => i !== indx).reduce((acc, elem) => acc + elem, 0)
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
