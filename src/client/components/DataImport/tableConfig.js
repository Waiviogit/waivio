import React from 'react';

export const configProductTable = [
  {
    id: 'active',
    intl: {
      id: 'active',
      defaultMessage: 'Active',
    },
    type: 'checkbox',
    getChecked: item => ['active', 'waitingRecover', 'pending'].includes(item.status),
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
      body: item => (
        <ol>
          {item.objectsLinks.map(link => (
            <li key={link}>
              <a rel="noopener noreferrer" target="_blank" href={`/object/${link}`}>
                {link}
              </a>
            </li>
          ))}
        </ol>
      ),
    },
  },
  {
    id: 'delete',
    intl: {
      id: 'actions',
      defaultMessage: 'Actions',
    },
    type: 'delete',
    name: 'stop',
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
      body: item => (
        <ol>
          {item.objectsLinks.map(link => (
            <li key={link}>
              <a rel="noopener noreferrer" target="_blank" href={`/object/${link}`}>
                {link}
              </a>
            </li>
          ))}
        </ol>
      ),
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

export const configAthorityBotHistoryTable = [
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
    id: 'lists',
    intl: {
      id: 'base_list',
      defaultMessage: 'Base list',
    },
    type: 'openModal',
    modal: {
      body: item => (
        <ol>
          {item.lists.map(link => (
            <li key={link}>
              <a rel="noopener noreferrer" target="_blank" href={`/object/${link}/list`}>
                {link}
              </a>
            </li>
          ))}
        </ol>
      ),
    },
  },
  {
    id: 'objectsCount',
    intl: {
      id: 'number_of_objects',
      defaultMessage: 'Number of objects',
    },
  },
  {
    id: 'objectsClaimed',
    intl: {
      id: 'claimed_objects',
      defaultMessage: 'Claimed objects',
    },
  },
];

export const configAthorityBotProductTable = [
  {
    id: 'active',
    intl: {
      id: 'active',
      defaultMessage: 'Active',
    },
    type: 'checkbox',
    getChecked: item => ['active', 'waitingRecover', 'pending'].includes(item.status),
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
    id: 'objectsCount',
    intl: {
      id: 'number_object',
      defaultMessage: 'Number of objects',
    },
  },
  {
    id: 'objectsClaimed',
    intl: {
      id: 'claimed_objects',
      defaultMessage: 'Claimed objects',
    },
    type: 'openModal',
    modal: {
      body: item => (
        <ol>
          {item.lists.map(link => (
            <li key={link}>
              <a rel="noopener noreferrer" target="_blank" href={`/object/${link}/list`}>
                {link}
              </a>
            </li>
          ))}
        </ol>
      ),
    },
  },

  {
    id: 'delete',
    intl: {
      id: 'actions',
      defaultMessage: 'Actions',
    },
    type: 'delete',
    name: 'stop',
  },
];

export const configDepartmentsBotProductTable = [
  {
    id: 'active',
    intl: {
      id: 'active',
      defaultMessage: 'Active',
    },
    type: 'checkbox',
    getChecked: item => ['active', 'waitingRecover', 'pending'].includes(item.status),
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
    id: 'objectsCount',
    intl: {
      id: 'number_object',
      defaultMessage: 'Number of objects',
    },
  },
  {
    id: 'objectsClaimed',
    intl: {
      id: 'updated_object',
      defaultMessage: 'Updated objects',
    },
    type: 'openModal',
    modal: {
      body: item => (
        <ol>
          {item.lists.map(link => (
            <li key={link}>
              <a rel="noopener noreferrer" target="_blank" href={`/object/${link}/list`}>
                {link}
              </a>
            </li>
          ))}
        </ol>
      ),
    },
  },

  {
    id: 'delete',
    intl: {
      id: 'actions',
      defaultMessage: 'Actions',
    },
    type: 'delete',
    name: 'stop',
  },
];
export const configDescriptionsBotProductTable = [
  {
    id: 'active',
    intl: {
      id: 'active',
      defaultMessage: 'Active',
    },
    type: 'checkbox',
    getChecked: item => ['active', 'waitingRecover', 'pending'].includes(item.status),
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
    id: 'objectsCount',
    intl: {
      id: 'number_object',
      defaultMessage: 'Number of objects',
    },
  },
  {
    id: 'objectsUpdated',
    intl: {
      id: 'updated_object',
      defaultMessage: 'Updated objects',
    },
    type: 'openModal',
    modal: {
      body: item => (
        <ol>
          <li key={item.baseList}>
            <a rel="noopener noreferrer" target="_blank" href={`/object/${item.baseList}/list`}>
              {item.baseList}
            </a>
          </li>
        </ol>
      ),
    },
  },

  {
    id: 'delete',
    intl: {
      id: 'actions',
      defaultMessage: 'Actions',
    },
    type: 'delete',
    name: 'stop',
  },
];
export const configDepartmentsBotHistoryTable = [
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
    id: 'lists',
    intl: {
      id: 'base_list',
      defaultMessage: 'Base list',
    },
    type: 'openModal',
    modal: {
      body: item => (
        <ol>
          {item.lists.map(link => (
            <li key={link}>
              <a rel="noopener noreferrer" target="_blank" href={`/object/${link}/list`}>
                {link}
              </a>
            </li>
          ))}
        </ol>
      ),
    },
  },
  {
    id: 'objectsCount',
    intl: {
      id: 'number_of_objects',
      defaultMessage: 'Number of objects',
    },
  },
  {
    id: 'objectsClaimed',
    intl: {
      id: 'updated_objects',
      defaultMessage: 'Updated objects',
    },
  },
];
export const configDescriptionsBotHistoryTable = [
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
    id: 'lists',
    intl: {
      id: 'base_list',
      defaultMessage: 'Base list',
    },
    type: 'openModal',
    modal: {
      body: item => (
        <ol>
          {item.lists.map(link => (
            <li key={link}>
              <a rel="noopener noreferrer" target="_blank" href={`/object/${link}/list`}>
                {link}
              </a>
            </li>
          ))}
        </ol>
      ),
    },
  },
  {
    id: 'objectsCount',
    intl: {
      id: 'number_of_objects',
      defaultMessage: 'Number of objects',
    },
  },
  {
    id: 'objectsUpdated',
    intl: {
      id: 'updated_objects',
      defaultMessage: 'Updated objects',
    },
  },
];

export const configDuplicateListsTable = [
  {
    id: 'active',
    intl: {
      id: 'active',
      defaultMessage: 'Active',
    },
    type: 'checkbox',
    getChecked: item => ['active', 'waitingRecover', 'pending'].includes(item.status),
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
    id: 'objectsCount',
    intl: {
      id: 'number_object',
      defaultMessage: 'Number of objects',
    },
  },
  {
    id: 'objectsListCount',
    intl: {
      id: 'number_of_list',
      defaultMessage: 'Number of lists',
    },
  },
  {
    id: 'objectsCreated',
    intl: {
      id: 'posted_lists',
      defaultMessage: 'Posted lists',
    },
    type: 'openModal',
    modal: {
      body: item => (
        <ol>
          {item.lists.map(link => (
            <li key={link}>
              <a rel="noopener noreferrer" target="_blank" href={`/object/${link}/list`}>
                {link}
              </a>
            </li>
          ))}
        </ol>
      ),
    },
  },
  {
    id: 'fieldsVoted',
    intl: {
      id: 'voted_updates',
      defaultMessage: 'Voted updates',
    },
  },
  {
    id: 'delete',
    intl: {
      id: 'actions',
      defaultMessage: 'Actions',
    },
    type: 'delete',
    name: 'stop',
  },
];

export const configDuplicateListsHistoryTable = [
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
    id: 'baseObject',
    intl: {
      id: 'base_object',
      defaultMessage: 'Base object',
    },
    type: 'openModal',
    modal: {
      body: item => (
        <ol>
          {item.lists.map(link => (
            <li key={link}>
              <a rel="noopener noreferrer" target="_blank" href={`/object/${link}/list`}>
                {link}
              </a>
            </li>
          ))}
        </ol>
      ),
    },
  },
  {
    id: 'objectsCount',
    intl: {
      id: 'number_of_objects',
      defaultMessage: 'Number of objects',
    },
  },
  {
    id: 'objectsListCount',
    intl: {
      id: 'number_of_list',
      defaultMessage: 'Number of lists',
    },
  },
  {
    id: 'objectsCreated',
    intl: {
      id: 'posted_lists',
      defaultMessage: 'Posted lists',
    },
  },
  {
    id: 'fieldsVoted',
    intl: {
      id: 'voted_updates',
      defaultMessage: 'Voted updates',
    },
  },
];
