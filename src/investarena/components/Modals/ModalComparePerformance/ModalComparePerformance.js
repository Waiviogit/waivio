import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import React from 'react';
import './ModalComparePerformance.less';
import InstrumentLongTermStatistics from '../../LeftSidebar/InstrumentLongTermStatistics/InstrumentLongTermStatistics';
import ObjectCard from '../../../../client/components/Sidebar/ObjectCard';

const propTypes = {
  intl: PropTypes.shape().isRequired,
  longTermStatistics: PropTypes.shape().isRequired,
  toggleModal: PropTypes.func.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  item: PropTypes.string.isRequired,
  itemToCompare: PropTypes.string.isRequired,
};

const ModalComparePerformance = ({
  intl,
  toggleModal,
  isModalOpen,
  item,
  itemToCompare,
  quotes,
  longTermStatistics,
}) => {
  return (
    <React.Fragment>
      {isModalOpen && (
        <Modal
          title={intl.formatMessage({
            id: 'compare_profitability',
            defaultMessage: 'Compare profitability',
          })}
          visible={!!isModalOpen}
          footer={null}
          onCancel={toggleModal}
          width={'500px'}
        >
          <div className="ModalComparePerformance">
            <div className="ModalComparePerformance-item">
              <ObjectCard wobject={item} showFollow={false} />
              <InstrumentLongTermStatistics periodsValues={longTermStatistics} />
            </div>
            <div>vs</div>
            <div className="ModalComparePerformance-item-to-compare">
              <ObjectCard wobject={item} showFollow={false} />
              <InstrumentLongTermStatistics periodsValues={longTermStatistics} />
            </div>
          </div>
        </Modal>
      )}
    </React.Fragment>
  );
};

ModalComparePerformance.propTypes = propTypes;

export default injectIntl(ModalComparePerformance);
