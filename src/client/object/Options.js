import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Options.less';

const Options = ({ wobject, isEditMode, setHoveredOption, setActiveOption, history }) => {
  const [selectedOption, setSelectedOption] = useState({});

  const firstEl = Object.entries(wobject?.options).reduce((a, v) => {
    if (a[v[0]]) {
      return a;
    }
    // eslint-disable-next-line no-param-reassign
    a[v[0]] = v[1][0];

    return a;
  }, {});

  useEffect(() => {
    setSelectedOption(firstEl);
    setActiveOption(firstEl);
  }, []);
  const onMouseOver = (e, el) => {
    setHoveredOption(el);
  };
  const onMouseOut = () => {
    setHoveredOption(selectedOption);
  };
  const onOptionButtonClick = (e, el) => {
    setSelectedOption({ ...selectedOption, [el.body.category]: el });
    setActiveOption(el);
    setHoveredOption(el);
    if (el.body.parentObjectPermlink !== wobject.author_permlink) {
      history.push(`/object/${el.author_permlink}`);
      setSelectedOption(el);
      setActiveOption(el);
    }
  };

  return (
    <>
      {isEditMode
        ? wobject?.options &&
          Object.entries(wobject?.options).map(option => (
            <div className="mb1" key={option[0]}>
              {' '}
              <div>
                {option[0]}: {selectedOption?.[option[0]]?.body?.value}
              </div>
              {option[1]?.map(
                el =>
                  el.author_permlink === wobject.author_permlink && (
                    <div key={el.author_permlink}>
                      {el.body.position}.{el.body.value}{' '}
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
              {Object.entries(wobject?.options).map(option => (
                <div className="mb1" key={option[0]}>
                  {' '}
                  <div>
                    {option[0]}: {selectedOption?.[option[0]]?.body?.value}
                  </div>
                  <>
                    {option[1]?.map(el => (
                      <span key={el.permlink}>
                        {el.body.image ? (
                          <img
                            onMouseOver={e => onMouseOver(e, el)}
                            onMouseOut={onMouseOut}
                            onClick={e => onOptionButtonClick(e, el)}
                            className={
                              el.body.parentObjectPermlink === wobject.author_permlink
                                ? `Options__my-pictures${
                                    el.body?.image === selectedOption[el.body.category]?.body?.image
                                      ? '-selected'
                                      : ''
                                  }`
                                : 'Options__pictures'
                            }
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
                            className={
                              el.body.parentObjectPermlink === wobject.author_permlink
                                ? `Options__my-option-button${
                                    selectedOption[el.body.category]?.body?.value === el.body?.value
                                      ? '-selected'
                                      : ''
                                  }`
                                : `Options__option-button`
                            }
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
    </>
  );
};

Options.propTypes = {
  wobject: PropTypes.shape().isRequired,
  isEditMode: PropTypes.bool.isRequired,
  setHoveredOption: PropTypes.func.isRequired,
  setActiveOption: PropTypes.func.isRequired,
  history: PropTypes.func.isRequired,
};

export default Options;
