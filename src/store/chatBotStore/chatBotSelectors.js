import { createSelector } from 'reselect';

export const chatBotState = state => state.chatBot;

export const getChatBotMessages = createSelector([chatBotState], state => state.messages);
