import { FormattedMessage, injectIntl } from 'react-intl';
import { Popover, Progress } from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { formatSignalsData, getCorrectTime } from '../../../../helpers/signalsHelper';
import './Signals.less';

const propTypes = {
    intl: PropTypes.shape().isRequired,
    signals: PropTypes.arrayOf(PropTypes.shape()),
};

const Signals = ({intl, signals}) => (
      (signals && signals.length > 0)
        ? (
          <Popover
            placement="bottom"
            className="st-signal-popover"
            content={_.map(formatSignalsData(signals), (signal) =>
              <div className="st-signal-wrap" key={`signal:${signal.id}`}>
                <div className="st-signal-interval">{getCorrectTime(signal.interval, intl)}</div>
                <div className={`st-signal-recommendation st-signal-color-${signal.recommendation === 'buy' ? 'success' : 'danger'}`}>
                  <FormattedMessage id={`signal.${signal.recommendation}`} defaultMessage={signal.recommendation === 'buy' ? 'Buy' : 'Sell'}/>
                </div>
                <div className="st-signal-strength">
                  <Progress percent={signal.strength*10} showInfo={false} status="active"/>
                </div>
              </div>)}
          >
            <div className="st-signals-button">
              {signals.length}
            </div>
          </Popover>
        )
        : null
    );

Signals.propTypes = propTypes;
Signals.defaultProps = {
  signals: [],
};

export default injectIntl(Signals);
