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
  const load = button => ['search', 'import'].includes(button.id) && loading;
  const dis = button => ['import'].includes(button.id) && disabled;

  const handlePrev = () => {
    setPageNumber(1);
  };
  const buttonsState = [
    {
      intl: { id: 'cancel', defaultMessage: 'Cancel' },
      handler: closeImportModal,

      classList: 'WebsiteWelcomeModal__button WebsiteWelcomeModal__button--first',
    },
    {
      ...(pageNumber === 2
        ? {
            isPrimary: true,
            id: 'import',
            intl: { id: 'import', defaultMessage: 'Import' },
            handler: handleOk,
          }
        : {
            isPrimary: true,
            id: 'search',
            intl: { id: 'search', defaultMessage: 'Search' },
            handler: handleOk,
          }),
      classList: 'WebsiteWelcomeModal__button WebsiteWelcomeModal__button--second',
    },
  ];

  const zeroButton = {
    intl: { id: 'previous', defaultMessage: 'Previous' },
    handler: handlePrev,
    classList: 'WebsiteWelcomeModal__button WebsiteWelcomeModal__button--zero',
  };

  return (
    <div className={pageNumber === 2 ? 'flex justify-between' : ''}>
      {pageNumber === 2 && (
        <Button
          type={zeroButton.isPrimary ? 'primary' : 'secondary'}
          key={zeroButton.intl.id}
          className={zeroButton.classList}
          onClick={zeroButton.handler}
          disabled={dis(zeroButton) || load(zeroButton)}
          loading={load(zeroButton)}
        >
          {intl.formatMessage(zeroButton.intl)}
        </Button>
      )}
      <div>
        {buttonsState.map(button => (
          <Button
            type={button.isPrimary ? 'primary' : 'secondary'}
            key={button.intl.id}
            className={button.classList}
            onClick={button.handler}
            disabled={dis(button) || load(button)}
            loading={load(button)}
          >
            {intl.formatMessage(button.intl)}
          </Button>
        ))}
      </div>
    </div>
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
