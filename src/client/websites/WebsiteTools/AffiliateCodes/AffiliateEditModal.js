import React, { useEffect, useState } from 'react';
import { Button, Modal, Progress } from 'antd';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import PercentChanger from '../../../object/AppendModal/FormComponents/PercentChanger';
import { objectFields } from '../../../../common/constants/listOfFields';

const AffiliateEditModal = ({
  visibleEditModal,
  affiliateCode,
  setFieldsValue,
  editCode,
  validateFieldsAndScroll,
  getFieldDecorator,
  onClose,
  affName,
  loading,
}) => {
  const [weightBuffer, setWeightBuffer] = useState(100);
  const [percents, setPercents] = useState([]);
  const [codes, setCodes] = useState([]);

  const createCodesList = () => {
    if (codes.length === 1) return codes;

    return codes.reduce((acc, curr, i) => {
      const code = curr.split('::');

      return i ? [...acc, `${curr}::${percents[i]}`] : [`${code}::${weightBuffer}`];
    }, []);
  };

  const deleteAffiliateCode = i => {
    const newCodes = [...codes];
    const newPercent = [...percents];

    newCodes.splice(i, 1);
    newPercent.splice(i, 1);

    setCodes(newCodes);
    setPercents(newPercent);
  };

  useEffect(() => {
    const g = affiliateCode.reduce(
      (acc, curr) => {
        const code = curr.split('::');

        return {
          c: [...acc.c, code[0]],
          p: [...acc.p, code[1]],
        };
      },
      {
        c: [],
        p: [],
      },
    );

    setPercents(g.p);
    setCodes(g.c);
  }, []);

  useEffect(() => {
    setWeightBuffer(Object.values(percents).reduce((res, curr, i) => (i ? res - curr : res), 100));
  }, [percents]);

  useEffect(() => {
    setFieldsValue(createCodesList());
  }, [percents, weightBuffer]);

  const onChangeSlider = (value, i) => {
    const newPercents = [...percents];

    newPercents.splice(i, 1, value);

    setPercents(newPercents);
  };

  const handleSubmit = event => {
    if (event) event.preventDefault();
    validateFieldsAndScroll((err, values) => {
      editCode(values);
    });
  };

  return (
    <Modal
      title={`Affiliate program ${affName}`}
      visible={visibleEditModal}
      onCancel={() => onClose(false)}
      footer={null}
    >
      {isEmpty(codes) ? (
        <div
          style={{
            textAlign: 'center',
            padding: '15px 0',
            fontWeight: '500',
            fontSize: '19px',
          }}
        >
          All affiliate codes will be removed.
        </div>
      ) : (
        codes.map((code, i) => {
          const o = code.split('::');

          return (
            <div
              key={o[0]}
              style={{
                marginBottom: '30px',
              }}
            >
              {getFieldDecorator(objectFields.affiliateCode, {
                initialValue: [],
              })}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontWeight: 500 }}>{o[0]}</span>
                <Button onClick={() => deleteAffiliateCode(i)} type={'primary'}>
                  delete
                </Button>
              </div>
              {i ? (
                <PercentChanger
                  defaultPercent={percents[i]}
                  onAfterChange={value => onChangeSlider(value, i)}
                  max={
                    99 -
                    percents
                      .filter((_, indx) => i !== indx)
                      .reduce((acc, elem, indx) => (indx ? acc + elem : acc), 0)
                  }
                />
              ) : (
                <div>
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
                </div>
              )}
            </div>
          );
        })
      )}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button loading={loading} type={'primary'} onClick={handleSubmit}>
          {loading ? 'Saving' : 'Save'}
        </Button>
      </div>
    </Modal>
  );
};

AffiliateEditModal.propTypes = {
  visibleEditModal: PropTypes.func,
  affiliateCode: PropTypes.arrayOf(PropTypes.string),
  setFieldsValue: PropTypes.func,
  editCode: PropTypes.func,
  validateFieldsAndScroll: PropTypes.func,
  onClose: PropTypes.func,
  getFieldDecorator: PropTypes.func,
  affName: PropTypes.string,
  loading: PropTypes.bool,
};

export default AffiliateEditModal;
