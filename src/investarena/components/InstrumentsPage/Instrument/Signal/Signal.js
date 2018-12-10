import { FormattedMessage, injectIntl } from 'react-intl';
import { Progress } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { getCorrectTime } from '../../../../helpers/signalsHelper';
import './Signal.less';

const propTypes = {
    signal: PropTypes.object.isRequired
};

const Signal = ({intl, signal}) => {
    const setColor = (strength) => {
        return strength > 4
            ? strength > 7
                ? 'success'
                : 'info'
            : 'danger';
    };
    return (
        <div className="st-signal-wrap">
            <div className="st-signal-interval">{getCorrectTime(signal.interval, intl)}</div>
            <div className={`st-signal-recommendation st-signal-color-${signal.recommendation === 'buy' ? 'success' : 'danger'}`}>
                <FormattedMessage id={`signal.${signal.recommendation}`}/>
            </div>
            <div className="st-signal-strength">
              <Progress percent={signal.strength*10} showInfo={false} status="active"/>
            </div>
        </div>
    );
};

Signal.propTypes = propTypes;

export default injectIntl(Signal);
