import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { upperFirst } from 'lodash';

import { estimateAmount, finalConfirmation } from '../../waivioApi/ApiClient';
import { CRYPTO_FOR_VALIDATE_WALLET } from '../../common/constants/waivio';

const ConfirmationModal = ({ location }) => {
  const [count, calculateAmount] = useState(0);
  const [isVisible, setVisible] = useState(true);

  const parseSearchParams = location.search
    .split('&')
    .map(search => search.replace('=', '": "').replace('?', '"'))
    .join('", "');
  const searchParams = JSON.parse(`{${parseSearchParams}"}`);

  const confirmTransaction = () => {
    finalConfirmation(searchParams.token, searchParams.memo);
    setVisible(false);
  };

  useEffect(() => {
    estimateAmount(searchParams.reqAmount, 'hive', searchParams.outputCoinType).then(res =>
      calculateAmount(res.outputAmount),
    );
  }, []);

  const currentModal = () => {
    switch (searchParams.id) {
      case 'finalConfirmTransaction':
        return (
          <Modal
            visible={isVisible}
            title="Final confirmation"
            onOk={confirmTransaction}
            onCancel={() => setVisible(false)}
          >
            <div>
              <b>Send</b>: {searchParams.reqAmount} HIVE
            </div>
            <div>
              <b>Receive</b>: {count}{' '}
              {upperFirst(CRYPTO_FOR_VALIDATE_WALLET[searchParams.outputCoinType])}
            </div>
            <div>
              <b>Deposit to</b>: {searchParams.depositAcc}
            </div>
            <div>
              <b>Memo</b>: {searchParams.memo}
            </div>
            <div>
              <b>Initiate the transfer on the Hive blockchain.</b>
            </div>
          </Modal>
        );

      case 'confirmEmailSuccess':
        return Modal.success({
          title: '',
          content: '',
        });

      case 'confirmEmailSecretFailed':
        return Modal.error({
          title: '',
          content: '',
        });

      case 'confirmEmailTimeFailed':
        return Modal.error({
          title: '',
          content: '',
        });

      default:
        return null;
    }
  };

  return currentModal();
};

export default ConfirmationModal;
