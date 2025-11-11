import React, { useEffect, useMemo, useRef, useState } from 'react';
import { debounce, isEmpty } from 'lodash';
import { injectIntl } from 'react-intl';
import { Button, Input, Select, Tag, message, Modal } from 'antd';
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

export const addSpacesToCamelCase = str => {
  if (!str) return str;

  // If string already has spaces, return as-is
  if (str.includes(' ')) {
    return str;
  }

  // Insert a space before each uppercase letter (except the first one)
  return str.replace(/([a-z])([A-Z])/g, '$1 $2');
};

export const removeSpacesFromCamelCase = str => {
  if (!str) return str;

  if (!str.includes(' ')) {
    return str;
  }

  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
};

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
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [expandedAnswers, setExpandedAnswers] = useState(new Set());

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

    try {
      const [topicsResponse, faqResponse] = await Promise.all([
        getAssistantFaqTopics(authUserName),
        (async () => {
          const skip = (currentPage - 1) * pageSize;
          const topic =
            selectedTopic && selectedTopic !== 'All topics'
              ? removeSpacesFromCamelCase(selectedTopic)
              : null;

          return getAssistantFaq(authUserName, topic, skip, pageSize);
        })(),
      ]);

      if (topicsResponse && topicsResponse.topics) {
        setTopics(topicsResponse.topics.map(addSpacesToCamelCase));
      }

      if (faqResponse && faqResponse.result) {
        setFaqs(faqResponse.result);
        setHasMore(faqResponse.hasMore || false);

        if (faqResponse.total !== undefined && faqResponse.total !== null) {
          setTotal(faqResponse.total);
        } else if (faqResponse.result.length > 0) {
          const totalResponse = await getAssistantFaq(authUserName, null, 0, 100);

          if (totalResponse && totalResponse.result) {
            setTotal(totalResponse.result.length);
          }
        } else {
          setTotal(0);
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

  useEffect(() => {
    loadFaqs();
  }, [isAuth, authUserName, currentPage, pageSize, selectedTopic]);

  const handleDeleteClick = record => {
    setFaqToDelete(record);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!faqToDelete) return;

    const id = faqToDelete._id || faqToDelete.id;

    try {
      await deleteAssistantFaq(authUserName, id);
      message.success('FAQ deleted successfully');
      setDeleteModalVisible(false);
      setFaqToDelete(null);

      if (currentPage > 1) {
        setCurrentPage(1);
      } else {
        loadFaqs();
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      message.error('Failed to delete FAQ');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setFaqToDelete(null);
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
  };

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
                if (containerRef.current) {
                  const scrollTop = containerRef.current.scrollTop;

                  requestAnimationFrame(() => {
                    if (containerRef.current) {
                      containerRef.current.scrollTop = scrollTop;
                    }
                  });
                }
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
      {/* eslint-disable-next-line no-nested-ternary */}
      {loading ? (
        <Loading />
      ) : isEmpty(displayFaqs) ? (
        <EmptyCampaing
          emptyMessage={intl.formatMessage({
            id: 'no_results',
            defaultMessage: 'No FAQs found',
          })}
        />
      ) : (
        <>
          <div className="FAQTab__table">
            <div className="FAQTab__table-header">
              <div className="FAQTab__table-header-cell FAQTab__table-cell--question">Question</div>
              <div className="FAQTab__table-header-cell FAQTab__table-cell--topic">Topic</div>
              <div className="FAQTab__table-header-cell FAQTab__table-cell--actions">Actions</div>
            </div>
            <div className="FAQTab__table-body">
              {displayFaqs.map(record => (
                <div key={record._id || record.id} className="FAQTab__table-row">
                  <div className="FAQTab__table-cell FAQTab__table-cell--question">
                    <div className="FAQTab__question-text">{record.question}</div>
                    <div className="FAQTab__answer-text">
                      {record.answer && record.answer.length > 250 ? (
                        <>
                          {expandedAnswers.has(record._id || record.id) ? (
                            <>
                              {record.answer}
                              <Button
                                type="link"
                                onClick={() => {
                                  const newExpanded = new Set(expandedAnswers);

                                  newExpanded.delete(record._id || record.id);
                                  setExpandedAnswers(newExpanded);
                                }}
                                className="FAQTab__show-more-button"
                              >
                                Show less
                              </Button>
                            </>
                          ) : (
                            <>
                              {record.answer.substring(0, 250)}...
                              <Button
                                type="link"
                                onClick={() => {
                                  const newExpanded = new Set(expandedAnswers);

                                  newExpanded.add(record._id || record.id);
                                  setExpandedAnswers(newExpanded);
                                }}
                                className="FAQTab__show-more-button"
                              >
                                Show more
                              </Button>
                            </>
                          )}
                        </>
                      ) : (
                        record.answer
                      )}
                    </div>
                  </div>
                  <div className="FAQTab__table-cell FAQTab__table-cell--topic">
                    <Tag
                      className="FAQTab__topic-tag FAQTab__topic-tag--clickable"
                      onClick={() => {
                        const topicWithSpaces = addSpacesToCamelCase(record.topic || 'general');

                        setSelectedTopic(topicWithSpaces);
                        setCurrentPage(1);
                      }}
                    >
                      {addSpacesToCamelCase(record.topic || 'general')}
                    </Tag>
                  </div>
                  <div className="FAQTab__table-cell FAQTab__table-cell--actions">
                    <div className="FAQTab__actions">
                      <Button
                        type="link"
                        onClick={() => handleEdit(record)}
                        className="FAQTab__edit-button"
                      >
                        Edit
                      </Button>
                      <Button
                        type="link"
                        danger
                        className="FAQTab__delete-button"
                        onClick={() => handleDeleteClick(record)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {totalFiltered > 0 && (
            <div className="FAQTab__pagination">
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
                <span className="FAQTab__pagination-page">Page {currentPage}</span>
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
        topics={topics}
      />
      <Modal
        visible={deleteModalVisible}
        onCancel={handleDeleteCancel}
        onOk={handleDeleteConfirm}
        okText="OK"
        cancelText="Cancel"
        className="FAQTab__delete-modal"
        title={'Delete FAQ'}
      >
        <p>Are you sure you want to delete this FAQ?</p>
      </Modal>
    </div>
  );
};

FAQTab.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(FAQTab);
