import { getConnectionState, getIsChatEnabledState } from 'redux/selectors/userSelectors';
// import { getConversations } from 'chat/actions/entities/conversationsActions';
// import { getNotifications } from 'redux/actions/entities/noticeActions';
import { keepAlive } from '../redux/actions/authenticate/authenticate';

const wakeUp = (dispatch, getState) => {
    const timeout = 5000;
    let lastTime = Date.now();

    const wakeUp = function () {
        const currentTime = Date.now();
        if (currentTime > (lastTime + timeout + 2000)) {
            if (getConnectionState(getState())) {
                dispatch(keepAlive());
                // if (getIsChatEnabledState(getState())) {
                //     dispatch(getConversations());
                // }
                // dispatch(getNotifications());
            }
        }
        lastTime = currentTime;
    };
    setInterval(wakeUp, timeout);
};

export default wakeUp;
