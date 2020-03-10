export const TOGGLE_MODAL = 'TOGGLE_MODAL';

export function toggleModal(type, modalInfo) {
  if (type === 'broker') {
    // todo: enable modal for broker in the future
    return { type: 'fake_action' };
  }
  return { type: TOGGLE_MODAL, payload: { type, modalInfo } };
}
