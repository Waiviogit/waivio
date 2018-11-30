import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import './LoadingSpinner.less';

const propTypes = {
    size: PropTypes.string,
    header: PropTypes.string
};

const LoadingSpinner = ({ size, header }) => {
    return (
        <div className="st-loading-wrap">
            {header
                ? (
                    <div className="st-loading-with-header">
                        <div className="st-loading-header">
                            <FormattedMessage id={header}/>
                        </div>
                        <div className="st-loading-content">
                            <div className={`st-loading-${size}`}/>
                        </div>
                    </div>
                )
                : (
                    <div className="st-loading-without-header">
                        <div className={`st-loading-${size}`}/>
                    </div>
                )
            }
        </div>
    );
};

LoadingSpinner.defaultProps = {
    size: 'large'
};

LoadingSpinner.propTypes = propTypes;

export default LoadingSpinner;
