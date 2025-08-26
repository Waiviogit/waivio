import React from 'react';
import PropTypes from 'prop-types';
import { sortOptions } from '../../../../common/helpers/wObjectHelper';

const OptionItemEdit = ({ option, wobject }) => (
  <div>
    {' '}
    {option[1].some(el => el.author_permlink === wobject.author_permlink) && (
      <div className="Options__option-category">{option[0]}: </div>
    )}
    {option[1]
      ?.sort((a, b) => sortOptions(a, b))
      .map(
        el =>
          el.author_permlink === wobject.author_permlink && (
            <div key={el._id}>
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
);

OptionItemEdit.propTypes = {
  wobject: PropTypes.shape().isRequired,
  option: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default OptionItemEdit;
