import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import { getActiveOption } from '../../../store/optionsStore/optionsSelectors';
import { isMobile } from '../../../common/helpers/apiHelpers';
import OptionItemEdit from './OptionItem/OptionItemEdit';
import { sortOptions } from '../../../common/helpers/wObjectHelper';
import OptionItemView from './OptionItem/OptionItemView';
import './Options.less';

const Options = ({ wobject, isEditMode, setHoveredOption }) => {
  const activeStoreOption = useSelector(getActiveOption);
  const optionsDiv = useRef();

  useEffect(() => {
    const objectHeaderEl = document.getElementById('ObjectHeaderId');

    if (activeStoreOption && isMobile()) {
      window.scrollTo({
        top: objectHeaderEl?.offsetHeight,
        behavior: 'smooth',
      });
    }
  }, [wobject]);

  const options = Object.entries(wobject?.options);

  const filteredOptions = options.reduce((accumulator, currentValue) => {
    // eslint-disable-next-line no-param-reassign
    accumulator[currentValue[0]] = currentValue[1].reduce((a, v) => {
      if (!isEmpty(a) && a.some(o => o.body.value === v.body.value)) {
        return a;
      }
      const duplicatedOptionsArray = currentValue[1]?.filter(
        i => i?.body?.value === v?.body?.value,
      );
      const r =
        duplicatedOptionsArray.length > 1
          ? duplicatedOptionsArray.filter(d => d.author_permlink === wobject.author_permlink)
          : duplicatedOptionsArray;

      return [...a, r[0] || duplicatedOptionsArray[0]].sort((o, b) => sortOptions(o, b));
    }, []);

    return accumulator;
  }, {});

  return (
    <div ref={optionsDiv}>
      {isEditMode
        ? wobject?.options &&
          Object.entries(wobject?.options).map(option => (
            <OptionItemEdit key={option[0]} option={option} wobject={wobject} />
          ))
        : wobject?.options && (
            <div>
              {Object.entries(filteredOptions).map(option => (
                <div key={option[0]}>
                  <OptionItemView
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
  setHoveredOption: PropTypes.func.isRequired,
};

export default Options;
