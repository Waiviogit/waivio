import io from 'socket.io-client';
// import { createCommentSuccess, deleteCommentSuccess, updateCommentSuccess } from '../redux/actions/commentsActions';
// import { followersPostEnabled, updatePostStatus } from '../redux/actions/postsActions';
// import { getNoticeSuccess, deleteNoticeSuccess } from '../redux/actions/noticeActions';
// import {expirePost} from '../redux/actions/postsActions';
// import { updateLikeSuccess } from '../redux/actions/likesActions';
// import { updateUsersStatus } from '../redux/actions/usersStatusActions';

export default class WebSocketClient {
    constructor ({ wsUrl = 'http://localhost:8082'} = {}) {
        this.wsUrl = wsUrl;
        this.subscriptions = [];
    }
    initialize (dispatch, headers) {
        if (!headers) {
            throw new Error('headers is not defined!');
        }
        this.dispatch = dispatch;
        this.headers = headers;
        this.websocket = this.createWebSocketConnection();
    }
    createWebSocketConnection () {
        if (this.websocket) {
            this.websocket.close();
        }
        let websocket = io.connect(this.wsUrl, {
            query: `client=${this.headers ? this.headers['client'] : ''}`
        });

        websocket.on('connect', this.onWebSocketConnect);
        websocket.on('evt', this.onWebSocketMessage);
        websocket.on('disconnect', this.onDisconnect);
        websocket.on('error', this.onWebSocketError);
        return websocket;
    }
    closeWebSocketConnection () {
        if (this.websocket) {
            this.websocket.close();
        }
    }
    onWebSocketConnect = () => {
        if (this.subscriptions.length > 0) {
            this.websocket.emit('subscribeClient', this.headers['client']);
            this.subscriptions.forEach(channel => {
                this.websocket.emit('subscribeChannel', channel);
            });
        }
    };
    onWebSocketMessage = (event) => {
        let message = '';
        try {
            message = JSON.parse(event);
        } catch (error) {
            message = '';
        }
        switch (message.type) {
        case 'comment':
            this.actionComment(message);
            break;
        case 'like':
            this.actionLike(message);
            break;
        case 'notify':
            this.actionNotify(message);
            break;
        case 'show_post':
            this.actionShowPost(message);
            break;
        case 'user_status':
            this.actionUserStatus(message);
            break;
        case 'expire_update':
            this.actionExpiredPost(message);
            break;
        }
    };
    onDisconnect = () => {
    };
    onWebSocketError = () => {
    };
    actionComment (message) {
        switch (message.action) {
        case 'create':
            this.dispatch(createCommentSuccess(message.data, message.data.commentable_id));
            break;
        case 'update':
            this.dispatch(updateCommentSuccess(message.data, message.data.commentable_id));
            break;
        case 'destroy':
            this.dispatch(deleteCommentSuccess(message.data.id, message.data.commentable_id));
            break;
        }
    }
    actionLike (message) {
        this.dispatch(updateLikeSuccess({
            likedId: message.data.liked_id,
            likedType: message.data.liked_type,
            count: message.data.count_likes,
            liked: message.data.liked
        }));
    }
    actionExpiredPost = (message) => {
        this.dispatch(expirePost({
            id: message.id,
            expired_at: message.expiredAt,
            expired_bars: message.bars,
            final_quote: message.rate.quote,
            profitability: message.profitability
        }));
    };
    actionShowPost (message) {
        this.dispatch(followersPostEnabled(message.data, message.data));
    }
    actionNotify (message) {
        switch (message.action) {
        case 'create':
            this.dispatch(getNoticeSuccess(message.data));
            if (message.data.content.type.includes('moderation')) {
                this.dispatch(updatePostStatus({
                    postId: message.data.target_id,
                    status: message.data.content.type.replace('moderation_', ''),
                    reject_reasons: message.data.content.reject_reasons
                }));
            }
            break;
        case 'destroy':
            this.dispatch(deleteNoticeSuccess(message.data.id));
            break;
        }
    }
    actionUserStatus (message) {
        this.dispatch(updateUsersStatus(message.data.user_id, message.data));
    }
    subscribePostChannel = (channel) => {
        if (this.websocket) {
            this.websocket.emit('subscribeChannel', channel);
            this.subscriptions.push(channel);
        }
    }
}
