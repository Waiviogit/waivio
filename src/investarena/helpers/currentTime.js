import Cookies from 'js-cookie';
import moment from 'moment';

class CurrentTime {
    startCountdown () {
        this.stopCountDown();
        this.currentTime = +Cookies.get('serverTime');
        this.timer = setInterval(() => {
            this.currentTime
                ? this.currentTime += 1000
                : this.currentTime = +Cookies.get('serverTime');
        }, 1000);
    }
    getTime () {
        return this.currentTime && !isNaN(this.currentTime)
            ? moment(this.currentTime).valueOf()
            : moment().valueOf();
    }
    stopCountDown () {
        if (this.timer) {
            this.currentTime = null;
            clearInterval(this.timer);
        }
    }
}

export const currentTime = new CurrentTime();
