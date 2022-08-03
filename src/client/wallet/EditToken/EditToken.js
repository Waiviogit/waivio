import React, { useState } from 'react';
import { Button, Form, Modal } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import TokensSelect from '../SwapTokens/components/TokensSelect';
import { deleteTokenProfit, editTokenProfit } from '../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

import './EditToken.less';

const EditToken = props => {
  const { handleCloseModal, intl, handleSuccess } = props;
  const authUserName = useSelector(getAuthenticatedUserName);
  const [currentToken, setCurrentToken] = useState(props.tokensList[0]);
  const [currentAmount, setCurrentAmount] = useState(props.tokensList[0].quantity || 0);

  const handleEditToken = async () => {
    await editTokenProfit(authUserName, {
      symbol: currentToken.symbol,
      quantity: currentAmount,
    });
    handleSuccess();
    handleCloseModal();
  };

  const handleDeleteToken = async () => {
    try {
      await deleteTokenProfit(authUserName, { symbol: currentToken.symbol });
      handleSuccess();
      handleCloseModal();

      return true;
    } catch {
      return false;
    }
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'edit_token', defaultMessage: 'Edit token' })}
      visible
      onOk={handleEditToken}
      onCancel={handleCloseModal}
      footer={
        <div className="edit-token__delete-block">
          To delete the token, click the delete button:
          <Button className="edit-token__delete-button" onClick={handleDeleteToken}>
            Delete token
          </Button>
        </div>
      }
    >
      <Form>
        <h4>
          {intl.formatMessage({
            id: 'initial_number_of_tokens',
            defaultMessage: 'Initial number of tokens',
          })}
        </h4>
        <TokensSelect
          disabledSelect
          list={props.tokensList}
          setToken={token => {
            setCurrentToken(token);
          }}
          amount={currentAmount}
          handleChangeValue={amount => {
            setCurrentAmount(amount);
          }}
          token={currentToken}
          handleClickBalance={() => setCurrentAmount(currentToken.balance)}
          customClassSelect="edit-token__select"
        />
        <div className="edit-token__buttons-submit">
          <Button onClick={handleCloseModal} className="ant-btn">
            Cancel
          </Button>
          <Button
            onClick={handleEditToken}
            className="edit-token__save-button ant-btn ant-btn-primary"
          >
            Save changes
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

EditToken.propTypes = {
  intl: PropTypes.shape().isRequired,
  tokensList: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  handleCloseModal: PropTypes.func,
  handleSuccess: PropTypes.func,
};

EditToken.defaultProps = {
  visible: false,
  intl: PropTypes.shape({}).isRequired,
  getSwapList: () => {},
  handleCloseModal: () => {},
  handleSuccess: () => {},
};

export default injectIntl(EditToken);
