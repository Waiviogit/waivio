import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Options.less';

const Options = ({ wobject, isEditMode }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const onOptionButtonClick = (e, el) => {
    if (e.target.value && el.body.parentObjectPermlink === wobject.author_permlink) {
      setSelectedOption(e.target.value);
    }
  };
  // console.log(Object.values(wobject?.options).reduce((acc, value)=> {
  //   if (acc.some(obj => obj.body === value.body)) {
  //     return acc
  //   }
  //
  //   return [...acc, value]
  // }), [] )

  return (
    <>
      {isEditMode
        ? wobject?.options &&
          Object.entries(wobject?.options).map(option => (
            <div className="mb1" key={option[0]}>
              {' '}
              <div>{option[0]}:</div>
              {option[1]?.map(el => (
                <div key={el.author_permlink}>
                  {el.body.position}.{el.body.value}{' '}
                </div>
              ))}
            </div>
          ))
        : wobject?.options && (
            <div>
              {Object.entries(wobject?.options).map(option => (
                <div className="mb1" key={option[0]}>
                  {' '}
                  <div>{option[0]}:</div>
                  <>
                    {option[1]?.map(el => (
                      <>
                        <button
                          value={el.body.value}
                          onClick={e => onOptionButtonClick(e, el)}
                          className={
                            el.body.parentObjectPermlink === wobject.author_permlink
                              ? `Options__my-option-button${
                                  selectedOption === el.body.value ? '-selected' : ''
                                }`
                              : `Options__option-button`
                          }
                        >
                          {el.body.value}
                        </button>{' '}
                      </>
                    ))}
                  </>
                </div>
              ))}
              <div>
                {Object.entries(wobject?.options).map(o => (
                  <div className="mb1" key={o[0]}>
                    {' '}
                    {o[1]?.map(elem => (
                      <>
                        <img className="Options__pictures" src={elem.body.image} alt="option" />
                      </>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
    </>
  );
};

Options.propTypes = {
  wobject: PropTypes.shape().isRequired,
  isEditMode: PropTypes.bool.isRequired,
};

export default Options;
