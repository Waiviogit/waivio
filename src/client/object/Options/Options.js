import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { uniqBy } from 'lodash';
import { useSelector } from 'react-redux';
import { getActiveOption } from '../../../store/optionsStore/optionsSelectors';
import { isMobile } from '../../../common/helpers/apiHelpers';
import OptionItemEdit from './OptionItem/OptionItemEdit';
import { sortOptions } from '../../../common/helpers/wObjectHelper';
import OptionItemView from './OptionItem/OptionItemView';
import './Options.less';

const Options = ({ wobject, isEditMode, setHoveredOption, isSocialProduct }) => {
  const activeStoreOption = useSelector(getActiveOption);
  const optionsDiv = useRef();

  useEffect(() => {
    const objectHeaderEl = document && document.getElementById('ObjectHeaderId');

    if (activeStoreOption && isMobile() && !isSocialProduct) {
      if (typeof window !== 'undefined')
        window.scrollTo({
          top: objectHeaderEl?.offsetHeight,
          behavior: 'smooth',
        });
    }
  }, [wobject]);

  const options = Object.entries(wobject?.options);

  const optionsBack = Object.values(wobject.options).reduce((acc, arrVal) => {
    arrVal.forEach(option => {
      if (acc[option.body.value]) {
        acc[option.body.value] = [...acc[option.body.value], option.author_permlink];
      } else {
        acc[option.body.value] = [option.author_permlink];
      }
    });

    return acc;
  }, {});

  const ownOptions = Object.values(wobject.options).reduce((acc, arrVal) => {
    arrVal.forEach(val => {
      if (val.author_permlink === wobject.author_permlink) {
        if (acc[val.body.category]) {
          acc[val.body.category] = { ...acc[val.body.category], val };
        } else {
          acc[val.body.category] = val;
        }
      }
    });

    return acc;
  }, {});

  const filteredOptions = options.map(opt => [
    opt[0],
    uniqBy(opt[1], 'body.value').sort((a, b) => sortOptions(a, b)),
  ]);

  return (
    <div ref={optionsDiv}>
      {isEditMode
        ? wobject?.options &&
          Object.entries(wobject?.options).map(option => (
            <div className="Options__block" key={option[0]}>
              <OptionItemEdit option={option} wobject={wobject} />
            </div>
          ))
        : wobject?.options && (
            <div>
              {filteredOptions.map(option => (
                <div className="Options__block" key={option[0]}>
                  <OptionItemView
                    isSocialProduct={isSocialProduct}
                    ownOptions={ownOptions}
                    optionsBack={optionsBack}
                    optionsNumber={option[1].length}
                    option={option}
                    wobject={wobject}
                    setHoveredOption={setHoveredOption}
                  />
                </div>
              ))}
            </div>
          )}
    </div>
  );
};

Options.propTypes = {
  wobject: PropTypes.shape().isRequired,
  isEditMode: PropTypes.bool.isRequired,
  isSocialProduct: PropTypes.bool,
  setHoveredOption: PropTypes.func.isRequired,
};

export default Options;
