import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Options.less';

const Options = ({ wobject, isEditMode, setHoveredOption, history }) => {
  const [selectedOption, setSelectedOption] = useState({});

  const onMouseOver = (e, el) => {
    setHoveredOption(el);
  };
  const onMouseOut = () => {
    setHoveredOption(selectedOption);
  };
  const onOptionButtonClick = (e, el) => {
    setSelectedOption(el);
    setHoveredOption(el);
    if (el.body.parentObjectPermlink !== wobject.author_permlink) {
      history.push(`/object/${el.author_permlink}`);
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
                {option[0]}: {selectedOption?.body?.value}
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
                    {option[0]}: {selectedOption?.body?.value}
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
                                    el.body?.image === selectedOption.body?.image ? '-selected' : ''
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
                                    selectedOption.body?.value === el.body?.value ? '-selected' : ''
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
  history: PropTypes.func.isRequired,
};

export default Options;
