import React, { useState } from 'react';
import { Form, Input, Modal } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import TokensSelect from '../SwapTokens/components/TokensSelect';
import { addTokenReport } from '../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

import './AddToken.less';

const AddToken = props => {
  const { handleCloseModal, intl, handleSuccess } = props;
  const authUserName = useSelector(getAuthenticatedUserName);
  const [currentToken, setCurrentToken] = useState(props.tokensList[0]);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [externalQuantity, setExternalQuantity] = useState(0);

  const handleSetToken = async () => {
    try {
      await addTokenReport(authUserName, {
        symbol: currentToken.symbol,
        quantity: `${currentAmount}`,
        externalQuantity: `${externalQuantity}`,
      });
      handleSuccess();
      handleCloseModal();

      return true;
    } catch {
      return false;
    }
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'swap_tokens', defaultMessage: 'Add token' })}
      visible
      onOk={handleSetToken}
      onCancel={handleCloseModal}
      okButtonProps={{ disabled: !Number(currentAmount) > 0, title: 'Add token' }}
      okText={intl.formatMessage({ id: 'add_token', defaultMessage: 'Add token' })}
    >
      <Form>
        <div className="Add-token__block">
          <h4>
            {intl.formatMessage({
              id: 'initial_number_of_tokens',
              defaultMessage: 'Initial number of tokens',
            })}
          </h4>
          <TokensSelect
            list={props.tokensList}
            setToken={token => {
              setCurrentToken(token);
            }}
            amount={currentAmount}
            handleChangeValue={amount => setCurrentAmount(amount)}
            token={currentToken}
            handleClickBalance={() => setCurrentAmount(currentToken.balance)}
            customClassSelect="Add-token__select"
          />
        </div>
        <div>
          <h4>Tokens stored externally (optional)</h4>
          <Input
            type="number"
            className="Add-token__input"
            onChange={e => setExternalQuantity(e.target.value)}
          />
        </div>
        <p>
          Tokens that are stored externally can now be included in rebalancing. This can lead to a
          situation when the amount of locally stored tokens may not be sufficient to complete the
          next rebalancing operation.
        </p>
      </Form>
    </Modal>
  );
};

AddToken.propTypes = {
  intl: PropTypes.shape().isRequired,
  tokensList: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleCloseModal: PropTypes.func,
  handleSuccess: PropTypes.func,
};

AddToken.defaultProps = {
  visible: false,
  intl: PropTypes.shape({}).isRequired,
  getSwapList: () => {},
  handleCloseModal: () => {},
  handleSuccess: () => {},
};

export default injectIntl(AddToken);
