import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button } from 'antd';

import '../WebsiteWelcomeModal/WebsiteWelcomeModal.less';

const ModalFooter = ({
  pageNumber,
  closeImportModal,
  handleOk,
  setPageNumber,
  intl,
  loading,
  disabled,
}) => {
  const load = button => ['submit', 'import'].includes(button.id) && loading;
  const dis = button => ['import'].includes(button.id) && disabled;

  const handlePrev = () => {
    setPageNumber(1);
  };
  const buttonsState = [
    {
      ...(pageNumber === 1
        ? {
            intl: { id: 'cancel', defaultMessage: 'Cancel' },
            handler: closeImportModal,
          }
        : {
            intl: { id: 'previous', defaultMessage: 'Previous' },
            handler: handlePrev,
          }),
      classList: 'WebsiteWelcomeModal__button WebsiteWelcomeModal__button--first',
    },
    {
      ...(pageNumber === 2
        ? {
            id: 'import',
            intl: { id: 'import', defaultMessage: 'Import' },
            handler: handleOk,
          }
        : { id: 'submit', intl: { id: 'submit', defaultMessage: 'Submit' }, handler: handleOk }),
      classList: 'WebsiteWelcomeModal__button WebsiteWelcomeModal__button--second',
    },
  ];

  return (
    <React.Fragment>
      {buttonsState.map(button => (
        <Button
          key={button.intl.id}
          className={button.classList}
          onClick={button.handler}
          disabled={dis(button) || load(button)}
          loading={load(button)}
        >
          {intl.formatMessage(button.intl)}
        </Button>
      ))}
    </React.Fragment>
  );
};

ModalFooter.propTypes = {
  intl: PropTypes.shape().isRequired,
  pageNumber: PropTypes.number.isRequired,
  closeImportModal: PropTypes.func.isRequired,
  handleOk: PropTypes.number.isRequired,
  setPageNumber: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default injectIntl(ModalFooter);
