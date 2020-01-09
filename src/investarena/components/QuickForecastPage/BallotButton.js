import React from 'react';
import PropTypes from 'prop-types';

import BallotTimer from './BallotTimer';

import './BallotButton.less';

const BallotButton = props => (
    <div className="ballotButton__container">
      <div className="ballotButton__button-container">
        <button disabled={props.disabled} onClick={() => props.onClickCB('yes', props.permlink)} className='ballotButton ballotButton__positive'>
          {props.positiveText}
        </button>
        <button disabled={props.disabled} onClick={() => props.onClickCB('no',props.permlink)} className='ballotButton ballotButton__negative'>
          {props.negativeText}
        </button>

      </div>
      <div className="ballotButton__timer">
        <BallotTimer/>
      </div>
    </div>
  );

BallotButton.propTypes = {
  onClickCB: PropTypes.func,
  positiveText: PropTypes.string,
  negativeText: PropTypes.string,
  permlink: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
};

BallotButton.defaultProps = {
  onClickCB: () => {
  },
  positiveText: 'Yes',
  negativeText: 'No',
  permlink: '',
};

export default BallotButton;
