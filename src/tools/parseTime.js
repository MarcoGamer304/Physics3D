//recive seconds and return formate Time hh:mm:ss
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
// recive seconds and return minutes
export function getMinutes(seconds){
    return Math.floor((seconds % 3600) / 60);
}
//recive Time and return milliseconds
export function timeToMilliseconds(time) {
    if(!time){ return 0; }
    const [hours, minutes, seconds] = time.split(':').map(Number);
    
    const milliseconds = 
        (hours * 60 * 60 * 1000) +  
        (minutes * 60 * 1000) +   
        (seconds * 1000); 
    
    return milliseconds;
}