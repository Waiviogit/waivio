import React, { useEffect, useMemo, useRef, useState } from 'react';
import { isEmpty, debounce } from 'lodash';
import { injectIntl } from 'react-intl';
import { Button, Select, Tag, message, Modal, Input } from 'antd';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import {
  getAssistantFaq,
  getAssistantFaqTopics,
  deleteAssistantFaq,
  updateAssistantFaq,
  searchAssistantFaq,
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
  if (str.includes(' ')) return str;

  return str.replace(/([a-z])([A-Z])/g, '$1 $2');
};

export const removeSpacesFromCamelCase = str => {
  if (!str) return str;
  if (!str.includes(' ')) return str;

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
  const [searchInput, setSearchInput] = useState('');
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
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updateButtonDisabled, setUpdateButtonDisabled] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const authUserName = useSelector(getAuthenticatedUserName);
  const isAuth = useSelector(getIsAuthenticated);
  const containerRef = useRef(null);
  const prevPageRef = useRef(currentPage);
  const prevPageSizeRef = useRef(pageSize);
  const prevTopicRef = useRef(selectedTopic);

  const MIN_SEARCH_LENGTH = 3;

  const debouncedSetSearch = useMemo(
    () =>
      debounce(value => {
        const trimmedValue = value ? value.trim() : '';

        if (trimmedValue.length === 0 || trimmedValue.length >= MIN_SEARCH_LENGTH) {
          setSearch(trimmedValue.length >= MIN_SEARCH_LENGTH ? trimmedValue : null);
          setCurrentPage(1);
        }
      }, 500),
    [],
  );

  const handleSearch = value => {
    setSearchInput(value);
    debouncedSetSearch(value);
  };

  const loadFaqsOnly = async () => {
    if (!isAuth || !authUserName) return;
    setLoading(true);

    try {
      let faqResponse;
      const topic =
        selectedTopic && selectedTopic !== 'All topics'
          ? removeSpacesFromCamelCase(selectedTopic)
          : null;
      const skip = (currentPage - 1) * pageSize;

      if (search && search.trim()) {
        faqResponse = await searchAssistantFaq(authUserName, search.trim(), topic, skip, pageSize);
      } else {
        faqResponse = await getAssistantFaq(authUserName, topic, skip, pageSize);
      }

      if (faqResponse && faqResponse.result) {
        setFaqs(faqResponse.result);
        setHasMore(faqResponse.hasMore || false);
        setTotal(faqResponse.total ?? faqResponse.result.length);
        setHasLoadedOnce(true);
      } else {
        setFaqs([]);
        setHasMore(false);
        setTotal(0);
        setHasLoadedOnce(true);
      }
    } catch (error) {
      console.error('Error loading FAQs:', error);
      setFaqs([]);
      setHasMore(false);
      setTotal(0);
      setHasLoadedOnce(true);
    } finally {
      setLoading(false);
    }
  };

  const loadFaqs = async () => {
    if (!isAuth || !authUserName) return;
    setLoading(true);

    try {
      let faqResponse;
      const topic =
        selectedTopic && selectedTopic !== 'All topics'
          ? removeSpacesFromCamelCase(selectedTopic)
          : null;
      const skip = (currentPage - 1) * pageSize;

      if (search && search.trim()) {
        faqResponse = await searchAssistantFaq(authUserName, search.trim(), topic, skip, pageSize);
      } else {
        faqResponse = await getAssistantFaq(authUserName, topic, skip, pageSize);
      }

      if (!search || !search.trim()) {
        const topicsResponse = await getAssistantFaqTopics(authUserName);

        if (topicsResponse?.topics) {
          setTopics(topicsResponse.topics.map(addSpacesToCamelCase));
        }
      }

      if (faqResponse && faqResponse.result) {
        setFaqs(faqResponse.result);
        setHasMore(faqResponse.hasMore || false);

        if (faqResponse.total != null) {
          setTotal(faqResponse.total);
        } else if (faqResponse.result.length > 0) {
          if (search?.trim()) {
            setTotal(faqResponse.result.length);
          } else {
            const totalResponse = await getAssistantFaq(authUserName, null, 0, 100);

            setTotal(totalResponse?.result?.length ?? 0);
          }
        } else setTotal(0);

        setHasLoadedOnce(true);
      } else {
        setFaqs([]);
        setTotal(0);
        setHasMore(false);
        setHasLoadedOnce(true);
      }
    } catch (error) {
      console.error('Error loading FAQs:', error);
      setFaqs([]);
      setTotal(0);
      setHasMore(false);
      setHasLoadedOnce(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const onlyPageChanged =
      prevPageRef.current !== currentPage &&
      prevPageSizeRef.current === pageSize &&
      prevTopicRef.current === selectedTopic &&
      !search;

    const onlyTopicChanged =
      prevTopicRef.current !== selectedTopic &&
      prevPageRef.current === currentPage &&
      prevPageSizeRef.current === pageSize &&
      !search;

    if (onlyPageChanged || onlyTopicChanged) {
      loadFaqsOnly();
    } else {
      loadFaqs();
    }

    prevPageRef.current = currentPage;
    prevPageSizeRef.current = pageSize;
    prevTopicRef.current = selectedTopic;
  }, [authUserName, currentPage, pageSize, selectedTopic, search]);

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

      if (currentPage > 1) setCurrentPage(1);
      else loadFaqs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      message.error('Failed to delete FAQ');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setFaqToDelete(null);
  };

  const handleUpdateClick = () => setUpdateModalVisible(true);

  const handleUpdateConfirm = () => {
    setUpdateModalVisible(false);
    setModalVisible(false);
    setUpdateButtonDisabled(true);

    setTimeout(() => setUpdateButtonDisabled(false), 30000);

    updateAssistantFaq(authUserName)
      .then(() => message.success('AI Assistant updated successfully'))
      .catch(error => {
        console.error('Error updating AI Assistant:', error);
        message.error('Failed to update AI Assistant');
      });
  };

  const handleUpdateCancel = () => setUpdateModalVisible(false);

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
    if (!search?.trim()) return faqs;
    const s = search.toLowerCase();

    return faqs.filter(
      f => f.question?.toLowerCase().includes(s) || f.answer?.toLowerCase().includes(s),
    );
  }, [faqs, search]);

  const allTopicsOption = 'All topics';
  const filteredTopics = topics?.length > 0 ? [allTopicsOption, ...topics] : [allTopicsOption];

  const isSearchActive = !!search?.trim();

  const totalFiltered = isSearchActive ? filteredFaqs.length : total;

  const totalPages = () => {
    if (total > 0) {
      return Math.ceil(total / pageSize) || 1;
    }

    if (hasMore) {
      return currentPage + 1;
    }

    return currentPage;
  };

  const displayFaqs = faqs;

  useEffect(() => {
    if (total > 0 && displayFaqs.length === 0 && currentPage > 1) {
      const maxPage = Math.ceil(total / pageSize) || 1;

      if (currentPage > maxPage) setCurrentPage(1);
    }
  }, [total, displayFaqs.length, currentPage, pageSize]);

  const canGoNext =
    hasMore ||
    (isSearchActive && currentPage < totalPages) ||
    (total > 0 && currentPage < totalPages);

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
        <div className="FAQTab__button-group">
          <Button type={'primary'} onClick={handleAdd} className="FAQTab__add-button">
            + Add Q&A
          </Button>
          <Button
            onClick={handleUpdateClick}
            className="FAQTab__update-button"
            disabled={updateButtonDisabled}
          >
            Update AI Assistant
          </Button>
        </div>

        <div className="FAQTab__filters">
          <div className="FAQTab__filter-group">
            {/* eslint-disable-next-line jsx-a11y/label-has-for */}
            <label className="FAQTab__filter-label">Search</label>
            <Input
              placeholder="Search question or answer..."
              allowClear
              value={searchInput}
              onChange={e => handleSearch(e.target.value)}
              onClear={() => {
                setSearchInput('');
                handleSearch('');
              }}
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
              {filteredTopics.map(topic => (
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
                    if (containerRef.current) containerRef.current.scrollTop = scrollTop;
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

      <>
        {loading && !hasLoadedOnce && <Loading />}
        {!loading && hasLoadedOnce && isEmpty(displayFaqs) ? (
          <EmptyCampaing
            emptyMessage={intl.formatMessage({
              id: 'no_results',
              defaultMessage: 'No FAQs found',
            })}
          />
        ) : null}

        <div
          style={{
            position: 'relative',
            opacity: loading ? 0 : 1,
            pointerEvents: loading ? 'none' : 'auto',
            transition: 'opacity 0.15s linear',
          }}
        >
          {loading && hasLoadedOnce && (
            <div className="FAQTab__loading-overlay">
              <Loading />
            </div>
          )}

          {!loading && hasLoadedOnce && !isEmpty(displayFaqs) && (
            <div className="FAQTab__table">
              <div className="FAQTab__table-header">
                <div className="FAQTab__table-header-cell FAQTab__table-cell--question">
                  Question
                </div>
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
                                <span
                                  onClick={() => {
                                    const newExpanded = new Set(expandedAnswers);

                                    newExpanded.delete(record._id || record.id);
                                    setExpandedAnswers(newExpanded);
                                  }}
                                  className="FAQTab__show-more-button"
                                >
                                  Show less
                                </span>
                              </>
                            ) : (
                              <>
                                {record.answer.substring(0, 250)}...
                                <span
                                  onClick={() => {
                                    const newExpanded = new Set(expandedAnswers);

                                    newExpanded.add(record._id || record.id);
                                    setExpandedAnswers(newExpanded);
                                  }}
                                  className="FAQTab__show-more-button"
                                >
                                  Show more
                                </span>
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
          )}

          {!loading && hasLoadedOnce && totalFiltered > 0 && (
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
                    if (currentPage > 1) setCurrentPage(1);
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
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
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
                    if (canGoNext) setCurrentPage(currentPage + 1);
                  }}
                >
                  Next &gt;
                </a>
              </div>
            </div>
          )}
        </div>
      </>

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
        <p className={'tc'}>Are you sure you want to delete this FAQ?</p>
      </Modal>

      <Modal
        visible={updateModalVisible}
        onCancel={handleUpdateCancel}
        onOk={handleUpdateConfirm}
        okText="Update"
        cancelText="Cancel"
        className="FAQTab__update-modal"
        title={'Update AI Assistant'}
      >
        <p className={'tc'}>
          <p>Are you sure you want to update the AI Assistant?</p>
          <p>The updated information will be applied.</p>
        </p>
      </Modal>
    </div>
  );
};

FAQTab.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(FAQTab);
