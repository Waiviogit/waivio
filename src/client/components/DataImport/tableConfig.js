import React from 'react';

export const configProductTable = [
  {
    id: 'active',
    intl: {
      id: 'active',
      defaultMessage: 'Active',
    },
    type: 'checkbox',
    getChecked: item => ['active', 'waitingRecover'].includes(item.status),
  },
  {
    id: 'createdAt',
    intl: {
      id: 'start_date',
      defaultMessage: 'Start date',
    },
    type: 'date',
  },
  {
    id: 'objectType',
    intl: {
      id: 'object_type',
      defaultMessage: 'Object type',
    },
  },
  {
    id: 'authority',
    intl: {
      id: 'claimed_athority',
      defaultMessage: 'Claimed athority',
    },
  },
  {
    id: 'objectsCount',
    intl: {
      id: 'number_object',
      defaultMessage: 'Number of objects',
    },
  },
  {
    id: 'fieldsCount',
    intl: {
      id: 'number_updates',
      defaultMessage: 'Number of updates',
    },
  },
  {
    id: 'fieldsCreatedCount',
    intl: {
      id: 'posted_updates',
      defaultMessage: 'Posted updates',
    },
  },
  {
    id: 'objectsPosted',
    intl: {
      id: 'posted_objects',
      defaultMessage: 'Posted objects',
    },
    type: 'openModal',
    modal: {
      body: item =>
        item.objectsLinks.map(link => (
          <div key={link}>
            <a rel="noopener noreferrer" target="_blank" href={`/object/${link}`}>
              {link}
            </a>
          </div>
        )),
    },
  },
  {
    id: 'delete',
    intl: {
      id: 'actions',
      defaultMessage: 'Actions',
    },
    type: 'delete',
  },
];
export const configHistoryTable = [
  {
    id: 'createdAt',
    intl: {
      id: 'start_date',
      defaultMessage: 'Start date',
    },
    type: 'date',
  },
  {
    id: 'finishedAt',
    intl: {
      id: 'finish_date',
      defaultMessage: 'Finish date',
    },
    type: 'date',
  },
  {
    id: 'objectType',
    intl: {
      id: 'object_type',
      defaultMessage: 'Object type',
    },
  },
  {
    id: 'authority',
    intl: {
      id: 'claimed_athority',
      defaultMessage: 'Claimed authority',
    },
  },
  {
    id: 'objectsCount',
    intl: {
      id: 'submitted_object',
      defaultMessage: 'Submitted objects',
    },
    type: 'openModal',
    modal: {
      body: item =>
        item.objectsLinks.map(link => (
          <div key={link}>
            <a rel="noopener noreferrer" target="_blank" href={`/object/${link}`}>
              {link}
            </a>
          </div>
        )),
    },
  },
  {
    id: 'fieldsCount',
    intl: {
      id: 'submitted_updates',
      defaultMessage: 'Submitted updates',
    },
  },
  {
    id: 'fieldsCreatedCount',
    intl: {
      id: 'posted_updates',
      defaultMessage: 'Posted updates',
    },
  },
];
