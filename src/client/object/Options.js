import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import {
  setStoreActiveCategory,
  setStoreActiveOption,
} from '../../store/optionsStore/optionsActions';
import { getActiveOption } from '../../store/optionsStore/optionsSelectors';
import { isMobile } from '../../common/helpers/apiHelpers';
import './Options.less';

const Options = ({ wobject, isEditMode, setHoveredOption, history }) => {
  const [hovered, setHovered] = useState({});
  const dispatch = useDispatch();
  const activeStoreOption = useSelector(getActiveOption);
  const optionsDiv = useRef();

  useEffect(() => {
    const reffff = document.getElementById('ObjectHeaderId');

    activeStoreOption &&
      isMobile() &&
      window.scrollTo({
        top: reffff?.offsetHeight,
        behavior: 'smooth',
      });
  }, [wobject]);
  const getOptionsPicturesClassName = el =>
    classNames({
      Options__pictures: el.body.parentObjectPermlink !== wobject.author_permlink,
      'Options__my-pictures': el.body.parentObjectPermlink === wobject.author_permlink,
      'Options__my-pictures-selected':
        el.body?.image === activeStoreOption[el.body.category]?.body?.image,
    });

  const getOptionsClassName = el =>
    classNames({
      'Options__option-button': el.body.parentObjectPermlink !== wobject.author_permlink,
      'Options__my-option-button': el.body.parentObjectPermlink === wobject.author_permlink,
      'Options__my-option-button-selected':
        activeStoreOption[el.body.category]?.body?.value === el.body?.value,
    });

  const onMouseOver = (e, el) => {
    setHoveredOption(el);
    setHovered({ ...hovered, [el.body.category]: el });
  };
  const onMouseOut = () => {
    setHoveredOption(activeStoreOption);
    setHovered(activeStoreOption);
  };
  const onOptionButtonClick = (e, el) => {
    dispatch(setStoreActiveCategory(el.body.category));
    setHoveredOption(el);
    dispatch(setStoreActiveOption({ ...activeStoreOption, [el.body.category]: el }));
    if (el.body.parentObjectPermlink !== wobject.author_permlink) {
      history.push(`/object/${el.author_permlink}${isMobile() ? '/about' : ''}`);
      dispatch(setStoreActiveCategory(el.body.category));
      dispatch(setStoreActiveOption({ ...activeStoreOption, [el.body.category]: el }));
    }
  };
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
          ? duplicatedOptionsArray.filter(
              d => d.body.parentObjectPermlink === wobject.author_permlink,
            )
          : duplicatedOptionsArray;

      return [...a, r[0] || duplicatedOptionsArray[0]].sort(
        // eslint-disable-next-line array-callback-return,consistent-return
        (b, c) => {
          if (b.body.position && c.body.position) {
            return b.body.position - c.body.position;
          }

          if (!b.body.position) {
            return 1;
          }

          if (!c.body.position) {
            return -1;
          }
        },
      );
    }, []);

    return accumulator;
  }, {});

  return (
    <div ref={optionsDiv}>
      {isEditMode
        ? wobject?.options &&
          Object.entries(wobject?.options).map(option => (
            <div className="mb1" key={option[0]}>
              {' '}
              {option[1].some(el => el.author_permlink === wobject.author_permlink) && (
                <div>{option[0]}: </div>
              )}
              {option[1]
                ?.sort((a, b) => a?.body?.position - b?.body?.position)
                .map(
                  el =>
                    el.author_permlink === wobject.author_permlink && (
                      <div key={el.author_permlink}>
                        {el.body.position}
                        {el.body.position ? '.' : ''} {el.body.value}{' '}
                        {el.body.image && (
                          <div>
                            <img
                              className="Options__my-pictures"
                              src={el.body.image}
                              alt="option"
                              key={el.permlink}
                            />
                          </div>
                        )}
                      </div>
                    ),
                )}
            </div>
          ))
        : wobject?.options && (
            <div>
              {Object.entries(filteredOptions).map(option => (
                <div className="mb1" key={option[0]}>
                  {' '}
                  <div>
                    {option[0]}:{' '}
                    <span className="fw8">
                      {hovered?.[option[0]]?.body?.value ||
                        activeStoreOption?.[option[0]]?.body?.value}
                    </span>
                  </div>
                  <>
                    {option[1]?.map(el => (
                      <span key={el.permlink}>
                        {el.body.image ? (
                          <img
                            onMouseOver={e => onMouseOver(e, el)}
                            onMouseOut={onMouseOut}
                            onClick={e => onOptionButtonClick(e, el)}
                            className={getOptionsPicturesClassName(el)}
                            src={el.body.image}
                            alt="option"
                            key={el.permlink}
                          />
                        ) : (
                          <button
                            key={el.permlink}
                            onMouseOver={e => onMouseOver(e, el)}
                            onMouseOut={onMouseOut}
                            value={el.body.value}
                            onClick={e => onOptionButtonClick(e, el)}
                            className={getOptionsClassName(el)}
                          >
                            {el.body.value}
                          </button>
                        )}{' '}
                      </span>
                    ))}
                  </>
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
  history: PropTypes.func.isRequired,
};

export default Options;
