// selector
// export const getModalsState = state => state.modals;
export const getModalIsOpenState = (state, typeModal) => state.modals.modals.includes(typeModal);
export const getModalInfoState = (state, typeModal) => state.modals.modalsInfo[typeModal];
