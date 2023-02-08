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

  const filteredOptions = options.map(opt => [
    opt[0],
    uniqBy(uniqBy(opt[1], 'author_permlink'), 'body.value').sort((a, b) => sortOptions(a, b)),
  ]);

  return (
    <div ref={optionsDiv}>
      {isEditMode
        ? wobject?.options &&
          Object.entries(wobject?.options).map(option => (
            <OptionItemEdit key={option[0]} option={option} wobject={wobject} />
          ))
        : wobject?.options && (
            <div>
              {filteredOptions.map(option => (
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
