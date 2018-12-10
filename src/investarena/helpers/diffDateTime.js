export function calculateTime (timeValue) {
    let calculateTime = Math.floor(timeValue / 1000);
    const seconds = calculateTime % 60;
    calculateTime = Math.floor(calculateTime /= 60);
    const minutes = calculateTime % 60;
    calculateTime = Math.floor(calculateTime /= 60);
    const hours = calculateTime % 24;
    calculateTime = Math.floor(calculateTime /= 24);
    return {
        seconds: seconds,
        minutes: minutes,
        hours: hours,
        days: calculateTime
    };
}
