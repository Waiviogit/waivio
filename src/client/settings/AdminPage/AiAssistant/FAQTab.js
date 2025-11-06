import React, { useEffect, useMemo, useRef, useState } from 'react';
import { debounce, isEmpty } from 'lodash';
import { injectIntl } from 'react-intl';
import { Button, Input, Select, Table, Tag, message, Popconfirm } from 'antd';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getAssistantFaq,
  getAssistantFaqTopics,
  deleteAssistantFaq,
} from '../../../../waivioApi/ApiClient';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../../../../store/authStore/authSelectors';
import Loading from '../../../components/Icon/Loading';
import EmptyCampaing from '../../../statics/EmptyCampaign';
import FAQModal from './FAQModal';
import './FAQTab.less';

const { Option } = Select;

const PAGE_SIZES = [5, 10, 20, 50];

const FAQTab = ({ intl }) => {
  const [faqs, setFaqs] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('All topics');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);

  const authUserName = useSelector(getAuthenticatedUserName);
  const isAuth = useSelector(getIsAuthenticated);
  const containerRef = useRef(null);

  const debouncedSetSearch = useMemo(
    () =>
      debounce(value => {
        setSearch(value);
        setCurrentPage(1);
      }, 500),
    [],
  );

  const handleSearch = value => {
    debouncedSetSearch(value);
  };

  const loadFaqs = async () => {
    if (!isAuth || !authUserName) return;

    setLoading(true);
    getAssistantFaqTopics(authUserName).then(r => setTopics(r.topics));
    try {
      const skip = (currentPage - 1) * pageSize;
      const topic = selectedTopic && selectedTopic !== 'All topics' ? selectedTopic : null;

      const response = await getAssistantFaq(authUserName, topic, skip, pageSize);

      if (response && response.result) {
        setFaqs(response.result);
        setHasMore(response.hasMore || false);

        if (total === 0 && response.total !== undefined && response.total !== null) {
          setTotal(response.total);
        }
      } else {
        setFaqs([]);
        setTotal(0);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading FAQs:', error);
      message.error('Failed to load FAQs');
      setFaqs([]);
      setTotal(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const loadTotalCount = async () => {
    if (!isAuth || !authUserName) return;

    try {
      const totalResponse = await getAssistantFaq(authUserName, null, 0, 100);

      if (totalResponse && totalResponse.result) {
        setTotal(totalResponse.result.length);
      }
    } catch (error) {
      console.warn('Could not fetch total count:', error);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, [isAuth, authUserName, currentPage, pageSize, selectedTopic]);

  useEffect(() => {
    loadTotalCount();
  }, [isAuth, authUserName, selectedTopic]);

  const handleDelete = async id => {
    try {
      await deleteAssistantFaq(authUserName, id);
      message.success('FAQ deleted successfully');

      if (currentPage > 1) {
        setCurrentPage(1);
      }
      loadFaqs();
      loadTotalCount();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      message.error('Failed to delete FAQ');
    }
  };

  const handleEdit = faq => {
    setEditingFaq(faq);
    setModalVisible(true);
  };

  const handleAdd = () => {
    setEditingFaq(null);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingFaq(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    loadFaqs();
    loadTotalCount();
  };

  const columns = [
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
      render: (text, record) => (
        <div>
          <div className="FAQTab__question-text">{text}</div>
          <div className="FAQTab__answer-text">{record.answer}</div>
        </div>
      ),
    },
    {
      title: 'Topic',
      dataIndex: 'topic',
      key: 'topic',
      width: 120,
      render: topic => <Tag className="FAQTab__topic-tag">{topic || 'general'}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <div className="FAQTab__actions">
          <Button type="link" onClick={() => handleEdit(record)} className="FAQTab__edit-button">
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this FAQ?"
            onConfirm={() => handleDelete(record._id || record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger className="FAQTab__delete-button">
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const filteredFaqs = useMemo(() => {
    if (!search || !search.trim()) {
      return faqs;
    }

    const searchLower = search.toLowerCase();

    return faqs.filter(
      faq =>
        faq.question?.toLowerCase().includes(searchLower) ||
        faq.answer?.toLowerCase().includes(searchLower),
    );
  }, [faqs, search]);

  const allTopicsOption = 'All topics';
  const filteredTopics =
    topics && topics.length > 0 ? [allTopicsOption, ...topics] : [allTopicsOption];

  const isSearchActive = search && search.trim();

  const totalFiltered = useMemo(() => {
    if (isSearchActive) {
      return filteredFaqs.length;
    }

    return total;
  }, [isSearchActive, filteredFaqs.length, total]);

  const totalPages = useMemo(() => {
    if (isSearchActive) {
      return Math.ceil(totalFiltered / pageSize) || 1;
    }

    if (totalFiltered > 0) {
      return Math.ceil(totalFiltered / pageSize) || 1;
    }

    if (hasMore) {
      return currentPage + 1;
    }

    return currentPage;
  }, [isSearchActive, totalFiltered, pageSize, hasMore, currentPage]);

  const displayFaqs = useMemo(() => {
    if (isSearchActive) {
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;

      return filteredFaqs.slice(start, end);
    }

    return faqs;
  }, [isSearchActive, filteredFaqs, faqs, currentPage, pageSize]);

  useEffect(() => {
    if (totalFiltered > 0 && displayFaqs.length === 0 && currentPage > 1) {
      const maxValidPage = Math.ceil(totalFiltered / pageSize) || 1;

      if (currentPage > maxValidPage) {
        setCurrentPage(1);
      }
    }
  }, [totalFiltered, displayFaqs.length, currentPage, pageSize]);

  const startItem = useMemo(() => {
    if (totalFiltered === 0 || displayFaqs.length === 0) return 0;

    const calculatedStart = (currentPage - 1) * pageSize + 1;

    return Math.max(1, Math.min(calculatedStart, totalFiltered));
  }, [totalFiltered, displayFaqs.length, currentPage, pageSize]);

  const endItem = useMemo(() => {
    if (totalFiltered === 0 || displayFaqs.length === 0) return 0;

    const calculatedStart = (currentPage - 1) * pageSize + 1;
    const calculatedEnd = calculatedStart + displayFaqs.length - 1;

    const validEnd = Math.min(calculatedEnd, totalFiltered);
    const finalEnd = Math.max(startItem, validEnd);

    return Math.max(startItem, finalEnd);
  }, [totalFiltered, displayFaqs.length, currentPage, pageSize, startItem]);

  const lastPage = useMemo(() => totalPages, [totalPages]);

  const canGoNext = isSearchActive ? currentPage < totalPages : hasMore || currentPage < totalPages;
  const canGoLast = currentPage < totalPages;

  return (
    <div ref={containerRef} className="AdminPage min-width FAQTab">
      <div className="FAQTab__header">
        <h2>FAQ</h2>
        <p className="FAQTab__description">
          The AI Assistant tab lets to the admin to see and add a custom FAQ to teach the AI
          assistant.
        </p>
      </div>

      <div className="FAQTab__controls">
        <Button type={'primary'} onClick={handleAdd} className="FAQTab__add-button">
          + Add Q&A
        </Button>

        <div className="FAQTab__filters">
          <div className="FAQTab__filter-group">
            {/* eslint-disable-next-line jsx-a11y/label-has-for */}
            <label className="FAQTab__filter-label">Search</label>
            <Input
              placeholder="Search question or answer..."
              allowClear
              onChange={e => handleSearch(e.target.value)}
              className="FAQTab__search-input"
            />
          </div>

          <div className="FAQTab__filter-group">
            {/* eslint-disable-next-line jsx-a11y/label-has-for */}
            <label className="FAQTab__filter-label">Topic</label>
            <Select
              value={selectedTopic}
              onChange={value => {
                setSelectedTopic(value);
                setCurrentPage(1);
              }}
              className="FAQTab__select FAQTab__topic-select"
              getPopupContainer={() => containerRef.current || document.body}
              dropdownMatchSelectWidth={false}
            >
              {filteredTopics?.map(topic => (
                <Option key={topic} value={topic}>
                  {topic}
                </Option>
              ))}
            </Select>
          </div>

          <div className="FAQTab__filter-group">
            {/* eslint-disable-next-line jsx-a11y/label-has-for */}
            <label className="FAQTab__filter-label">Page size</label>
            <Select
              value={pageSize}
              onChange={value => {
                setPageSize(value);
                setCurrentPage(1);
              }}
              className="FAQTab__select FAQTab__page-size-select"
              getPopupContainer={() => containerRef.current || document.body}
              dropdownMatchSelectWidth={false}
            >
              {PAGE_SIZES.map(size => (
                <Option key={size} value={size}>
                  {size}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
      {loading && <Loading />}
      {!loading && isEmpty(displayFaqs) ? (
        <EmptyCampaing
          emptyMessage={intl.formatMessage({
            id: 'no_results',
            defaultMessage: 'No FAQs found',
          })}
        />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={displayFaqs}
            rowKey={record => record._id || record.id}
            pagination={false}
            className="FAQTab__table"
            bordered={false}
          />
          {totalFiltered > 0 && (
            <div className="FAQTab__pagination">
              <span className="FAQTab__pagination-info">
                Showing {startItem}-{endItem} of {totalFiltered}
              </span>
              <div className="FAQTab__pagination-controls">
                <a
                  className={`FAQTab__pagination-link ${
                    currentPage === 1
                      ? 'FAQTab__pagination-link--disabled'
                      : 'FAQTab__pagination-link--active'
                  }`}
                  onClick={e => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      setCurrentPage(1);
                    }
                  }}
                >
                  &lt;&lt; First
                </a>
                <a
                  className={`FAQTab__pagination-link ${
                    currentPage === 1
                      ? 'FAQTab__pagination-link--disabled'
                      : 'FAQTab__pagination-link--active'
                  }`}
                  onClick={e => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                >
                  &lt; Prev
                </a>
                <span className="FAQTab__pagination-page">
                  Page {currentPage}/{totalPages}
                </span>
                <a
                  className={`FAQTab__pagination-link ${
                    !canGoNext
                      ? 'FAQTab__pagination-link--disabled'
                      : 'FAQTab__pagination-link--active'
                  }`}
                  onClick={e => {
                    e.preventDefault();
                    if (canGoNext) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                >
                  Next &gt;
                </a>
                <a
                  className={`FAQTab__pagination-link ${
                    !canGoLast
                      ? 'FAQTab__pagination-link--disabled'
                      : 'FAQTab__pagination-link--active'
                  }`}
                  onClick={e => {
                    e.preventDefault();
                    if (canGoLast) {
                      // Jump to the calculated last page
                      setCurrentPage(lastPage);
                    }
                  }}
                >
                  Last &gt;&gt;
                </a>
              </div>
            </div>
          )}
        </>
      )}

      <FAQModal
        visible={modalVisible}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        editingFaq={editingFaq}
        authUserName={authUserName}
      />
    </div>
  );
};

FAQTab.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(FAQTab);
