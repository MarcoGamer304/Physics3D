export function secondsToTime(seconds) {
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const formattedTime = [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        secs.toString().padStart(2, '0')
    ].join(':');

    return formattedTime;
}

export function getMinutes(seconds){
    return Math.floor((seconds % 3600) / 60);
}