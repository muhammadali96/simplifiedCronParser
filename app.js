
//Assumptions
//input is string
//minute field: 60 values ranging from 0-59
//hour field: 24 values ranging from 0-23
//followed by /bin/run_me_{descriptor}
//Output is same type and format
//specify day
//Output is soonest time event occurs




const fs = require("fs");
let data = fs.readFileSync(process.stdin.fd, "utf-8");
data = data.split("\n")

let currentTime = process.argv[2]
let output = data.map((configLine) => {
    return cronParse(configLine, currentTime)


})
console.log(output.join("\n"))

function computeCurrentTime(currentTime) {
    //given currentTime string, compute currentMinute and currentHour as numbers
    let currentTimeArray = currentTime.split(':')
    let currentHour = parseInt(currentTimeArray[0])
    let currentMinute = parseInt(currentTimeArray[1])

    return { currentHour, currentMinute }
}

function formatMinute(minute) {
    if (minute < 10) {
        minute = `0${minute}`;
    }
    return minute;
}


function runMeDaily(cronMinute, cronHour, descriptor, currentTime) {
    let soonestTime;
    let day;
    let { currentHour, currentMinute } = computeCurrentTime(currentTime)

    cronMinute = formatMinute(cronMinute)

    if (currentHour < cronHour) {
        day = 'today'
    }
    if (currentHour > cronHour) {
        day = 'tomorrow'
    }
    else {
        if (currentMinute < cronMinute || currentMinute === cronMinute)
            day = 'today'
        else if (currentMinute > cronMinute)
            day = 'tomorrow'
    }
    soonestTime = `${cronHour}:${cronMinute}`

    return `${soonestTime} ${day} - ${descriptor}`
}

// //TESTS
// console.log(runMeDaily(30, 16, '/bin/run_me_daily', '16:10'), '16:30 today - /bin/run_me_daily')
// console.log(runMeDaily(30, 17, '/bin/run_me_daily', '16:10'), '17:30 today - /bin/run_me_daily')


function runMeEveryMinute(descriptor, currentTime) {
    return `${currentTime} today - ${descriptor}`
}

//TESTS
// console.log(runMeEveryMinute('/bin/run_me_every_minute', '16:10'), '16:10 today - /bin/run_me_every_minute')

function runMeHourly(cronMinute, descriptor, currentTime) {
    let day = 'today';
    let soonestTime;
    let { currentHour, currentMinute } = computeCurrentTime(currentTime)
    cronMinute = formatMinute(cronMinute)

    if (currentMinute <= cronMinute) {
        soonestTime = `${currentHour}:${cronMinute}`;
    }
    else if (currentMinute > cronMinute && currentHour === 23) {
        soonestTime = `00:${cronMinute}`
        day = 'tomorrow';
    }
    else {
        soonestTime = `${currentHour + 1}:${cronMinute}`
    }

    return `${soonestTime} ${day} - ${descriptor}`
}

//TESTS
// console.log(runMeHourly(30, '/bin/run_me_hourly', '16:10'), '16:30 today - /bin/run_me_hourly')
// console.log(runMeHourly(30, '/bin/run_me_hourly', '23:45'), '00:30 tomorrow - /bin/run_me_hourly')
// console.log(runMeHourly(0, '/bin/run_me_hourly', '23:00'), '23:00 today - /bin/run_me_hourly')
// console.log(runMeHourly(10, '/bin/run_me_hourly', '22:50'), '23:10 today - /bin/run_me_hourly')
// console.log(runMeHourly(0, '/bin/run_me_hourly', '01:20'), '2:00 today - /bin/run_me_hourly') 

function runMeSixtyTimes(cronHour, descriptor, currentTime) {
    let day;
    let soonestTime;
    let { currentHour, currentMinute } = computeCurrentTime(currentTime)

    if (currentHour < cronHour) {
        soonestTime = `${cronHour}:00`
        day = 'today';
    }
    else if (currentHour === cronHour) {
        soonestTime = currentTime
        day = 'today';
    }
    else {
        day = 'tomorrow';
        soonestTime = `${cronHour}:00`

    }
    return `${soonestTime} ${day} - ${descriptor}` //extract as function
}


//TESTS
// console.log(runMeSixtyTimes(13, '/bin/run_me_sixty_times', '16:10'), '13:00 tomorrow - /bin/run_me_sixty_times')
// console.log(runMeSixtyTimes(19, '/bin/run_me_sixty_times', '16:10'), '19:00 today - /bin/run_me_sixty_times')
// console.log(runMeSixtyTimes(13, '/bin/run_me_sixty_times', '13:10'), '13:10 today - /bin/run_me_sixty_times')
// console.log(runMeSixtyTimes(0, '/bin/run_me_sixty_times', '23:10'), '0:00 tomorrow - /bin/run_me_sixty_times')




function cronParse(configLine, currentTime) {
    let configLineArray = configLine.split(' ')
    let cronMinuteString = configLineArray[0]
    let cronHourString = configLineArray[1]
    let descriptor = configLineArray[2]


    if (cronMinuteString === '*' && cronHourString === '*') {
        console.log('runMeEveryMinute')
        return runMeEveryMinute(descriptor, currentTime)
    }

    else if (cronMinuteString === '*') {
        console.log('runMeSixtyTimes')
        let cronHour = parseInt(cronHourString)
        return runMeSixtyTimes(cronHour, descriptor, currentTime)
    }
    else if (cronHourString === '*') {
        console.log('runMeHourly')
        let cronMinute = parseInt(cronMinuteString)
        return runMeHourly(cronMinute, descriptor, currentTime)
    }
    else {
        let cronHour = parseInt(cronHourString)
        let cronMinute = parseInt(cronMinuteString)
        return runMeDaily(cronMinute, cronHour, descriptor, currentTime)
    }
}



//TESTS
// console.log(cronParse('30 1 /bin/run_me_daily', '16:10') === '1:30 tomorrow - /bin/run_me_daily')
// console.log(cronParse('45 * /bin/run_me_hourly', '16:10') === '16:45 today - /bin/run_me_hourly')
// console.log(cronParse('* * /bin/run_me_every_minute', '16:10') === '16:10 today - /bin/run_me_every_minute')
// console.log(cronParse('* 19 /bin/run_me_sixty_times', '16:10') === '19:00 today - /bin/run_me_sixty_times')


//For every line in cat input.txt define configLine and run cronParse
//currentTime does not change
