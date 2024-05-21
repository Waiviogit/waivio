import React from 'react';
import { Button, Form, Modal } from 'antd';
import TableFilter from './TableFilter';
import { injectIntl } from 'react-intl';
import { handleChangeEndDate, handleChangeStartDate } from './common/helpers';

const GenerateReport = ({ intl, form }) => {
  const [filterAccounts, setFilterAccounts] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);

  return (
    <div>
      <p>
        Here, reports are generated on our end. You can initiate report generation, and we'll
        seamlessly handle the processing in the background. In the History table, you'll find links
        to view all records and export them to .CSV format. Additionally, please note that only 12
        reports can be actively generated at a time. To load another, you'll need to either pause
        some reports or stop them completely.
      </p>
      <Button onClick={() => setOpenModal(true)}>Generate report</Button>
      <Modal
        title={`Advanced report`}
        visible={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={() => setOpenModal(false)}
      >
        <TableFilter
          intl={intl}
          filterUsersList={filterAccounts}
          getFieldDecorator={form.getFieldDecorator}
          handleOnClick={() => {}}
          handleSelectUser={() => {}}
          isLoadingTableTransactions={false}
          deleteUser={() => {}}
          currency={'usd'}
          form={form}
          startDate={handleChangeStartDate}
          endDate={handleChangeEndDate}
        />{' '}
      </Modal>
    </div>
  );
};

export default Form.create()(injectIntl(GenerateReport));
