import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { uniqBy } from 'lodash';
import { useSelector } from 'react-redux';
import { getActiveOption } from '../../../store/optionsStore/optionsSelectors';
import { isMobile } from '../../../common/helpers/apiHelpers';
import OptionItemEdit from './OptionItem/OptionItemEdit';
import { sortOptions, sortOwnOptions } from '../../../common/helpers/wObjectHelper';
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
    uniqBy(
      opt[1].sort((a, b) => sortOwnOptions(a, b, wobject.author_permlink)),
      'body.value',
    ).sort((a, b) => sortOptions(a, b)),
    uniqBy(uniqBy(opt[1], 'author_permlink'), 'body.value').sort((a, b) => sortOptions(a, b))
      .length,
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
                    ownOptions={ownOptions}
                    optionsBack={optionsBack}
                    optionsNumber={option[2]}
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
