import { Modal } from 'antd';
import { injectIntl } from 'react-intl';
import React from 'react';
import PropTypes from 'prop-types';
import TchChart from './TchChart';

const propTypes = {
    toggle: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    market: PropTypes.string.isRequired,
    quoteName: PropTypes.string.isRequired,
};
const ModalTC = ({toggle, isOpen, market, quoteName, intl}) => {
    return (
        <div className='st-open-deal-button-wrap st-margin-left-large'>
            {isOpen &&
              <Modal
                title={intl.formatMessage({ id: 'modalPost.navBar.titleChart', defaultMessage: 'Chart' })}
                visible={isOpen}
                footer={null}
                onCancel={toggle}
                width={'90%'}
              >
                <div style={{width: '100%', height: '305px', marginTop: '1px'}}>
                  <TchChart
                    quoteSecurity={quoteName}
                    market={market}
                    period={'60'}
                  />
                </div>
              </Modal>
            }
        </div>
    );
};

ModalTC.propTypes = propTypes;

export default injectIntl(ModalTC);
