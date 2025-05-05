import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Button, Form, Modal } from 'antd';
import { injectIntl } from 'react-intl';
import moment from 'moment';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import TableFilter from './TableFilter';
import { handleChangeEndDate, handleChangeStartDate } from './common/helpers';
import { getCurrentCurrency } from '../../../store/appStore/appSelectors';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { guestUserRegex } from '../../../common/helpers/regexHelpers';
import {
  configActiveReportsTableHeader,
  configHistoryReportsTableHeader,
} from './common/tableConfig';
import DynamicTbl from '../../components/Tools/DynamicTable/DynamicTable';
import {
  generateReports,
  getHistoryReports,
  getInProgressReports,
  getReportUpdate,
  getUsersTransactionDate,
  pauseInProgressReports,
  resumeInProgressReports,
  stopInProgressReports,
} from '../../../store/advancedReports/advancedActions';
import {
  getActiveGenerate,
  getHistoryGenerateReports,
} from '../../../store/advancedReports/advancedSelectors';
import Loading from '../../components/Icon/Loading';
import ExportCsv from './ExportCSV';

import './GenerateReport.less';

const GenerateReport = ({ intl, form }) => {
  const params = useParams();
  const [openModal, setOpenModal] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [disabledButtons, setDisabledButtons] = React.useState(false);
  const [filterAccounts, setFilterAccounts] = React.useState([params.name]);
  const activeGenerate = useSelector(getActiveGenerate);
  const historyReports = useSelector(getHistoryGenerateReports);
  const currentCurrency = useSelector(getCurrentCurrency);
  const authUser = useSelector(getAuthenticatedUserName);
  const dispatch = useDispatch();

  const updatePageDate = () =>
    Promise.allSettled([dispatch(getInProgressReports()), dispatch(getHistoryReports())]);

  useEffect(() => {
    dispatch(getUsersTransactionDate(authUser));
    updatePageDate().then(() => {
      setLoading(false);
    });

    dispatch(getReportUpdate(updatePageDate));
  }, []);

  const handleSelectUserFilterAccounts = user => {
    setFilterAccounts([...filterAccounts, user.account]);
  };

  const deleteUserFromFilterAccounts = user => {
    const accounts = filterAccounts.filter(filterAccount => filterAccount !== user);

    setFilterAccounts(accounts);
    form.setFieldsValue({ filterAccounts: accounts });
  };

  const handleSubmit = () => {
    form.validateFieldsAndScroll((err, values) => {
      const { from, end, currency, mergeRewards } = values;

      if (isEmpty(err)) {
        if (!isEmpty(filterAccounts)) {
          const body = {
            accounts: filterAccounts.map(acc => {
              const guest = guestUserRegex.test(acc);

              return {
                name: acc,
                // guest,
                ...(guest ? { skip: 0 } : { lastId: '-1' }),
              };
            }),
            filterAccounts,
            startDate:
              handleChangeStartDate(from) ||
              moment()
                .subtract(10, 'year')
                .unix(),
            endDate: handleChangeEndDate(end) || moment().unix(),
            currency,
            mergeRewards,
            symbol: 'WAIV',
            user: authUser,
          };

          dispatch(generateReports(body)).then(() => {
            setOpenModal(false);
            setFilterAccounts([params.name]);
          });
        }
      }
    });
  };

  const handleClickStopGeneration = item => {
    if (item.status === 'IN_PROGRESS') {
      Modal.confirm({
        title: 'Stop report generation',
        content:
          'Once stopped, the report generation cannot be resumed. To temporarily suspend/resume the report generation, please consider using the Active checkbox.',
        okText: 'Stop',
        onOk: () => {
          dispatch(stopInProgressReports(item.reportId));
        },
      });
    }
    if (item.status === 'ERRORED') {
      Modal.confirm({
        title: 'Resume report generation',
        content:
          "An error occurred while generating the report, stopping the process. To continue report generation where it was left off, please click 'Resume'.",
        okText: 'Resume',
        onOk: () => {
          dispatch(resumeInProgressReports(item.reportId));
        },
      });
    }
  };

  const handleClickPauseGeneration = (e, item) => {
    if (item.status === 'IN_PROGRESS') {
      dispatch(pauseInProgressReports(item.reportId));
    } else {
      dispatch(resumeInProgressReports(item.reportId));
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="GenerateReport">
      <p className={'GenerateReport__info'}>
        Here, reports are generated on our end. You can initiate report generation, and we&apos;ll
        seamlessly handle the processing in the background. In the History table, you&apos;ll find
        links to view all records and export them to .CSV format. Additionally, please note that
        only 12 reports can be actively generated at a time. To load another, you&apos;ll need to
        either pause some reports or stop them completely.
      </p>
      <Button
        disabled={activeGenerate.length === 12}
        type={'primary'}
        onClick={() => setOpenModal(true)}
      >
        Generate report
      </Button>
      <DynamicTbl
        onChange={handleClickPauseGeneration}
        deleteItem={handleClickStopGeneration}
        header={configActiveReportsTableHeader}
        bodyConfig={activeGenerate}
      />
      <h2>History</h2>
      <DynamicTbl
        header={configHistoryReportsTableHeader}
        bodyConfig={historyReports}
        disabledLink={disabledButtons}
        buttons={{
          csv: item =>
            item.status === 'STOPPED' ? (
              '-'
            ) : (
              <ExportCsv
                item={item}
                disabled={disabledButtons}
                toggleDisabled={value => setDisabledButtons(value)}
              />
            ),
        }}
      />
      {openModal && (
        <Modal
          title={`Advanced report`}
          visible={openModal}
          onCancel={() => {
            setOpenModal(false);
            setFilterAccounts([params.name]);
          }}
          onOk={handleSubmit}
          okText={'Submit'}
        >
          <TableFilter
            inModal
            intl={intl}
            filterUsersList={filterAccounts}
            getFieldDecorator={form.getFieldDecorator}
            handleSelectUser={handleSelectUserFilterAccounts}
            isLoadingTableTransactions={false}
            deleteUser={deleteUserFromFilterAccounts}
            currency={currentCurrency.type}
            form={form}
            startDate={handleChangeStartDate()}
            endDate={handleChangeEndDate()}
          />{' '}
        </Modal>
      )}
    </div>
  );
};

GenerateReport.propTypes = {
  intl: PropTypes.shape().isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFieldsAndScroll: PropTypes.func,
    setFieldsValue: PropTypes.func,
  }),
};

export default Form.create()(injectIntl(GenerateReport));
