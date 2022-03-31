const core = require('@actions/core');
const recursiveReaddir = require('recursive-readdir');
const matter = require('gray-matter');
const moment = require('moment');

const timeRangeInMinutes = core.getInput('time_range_minutes', {required: true});
const endTime = moment.utc().seconds(0);
const startTime = endTime.clone().subtract(parseInt(timeRangeInMinutes), 'minutes');
const contentDir = core.getInput('content_directory', {default: ''});

async function run() {
    core.setOutput('is_scheduled', false);
    await recursiveReaddir(contentDir, ['!*.md']).then(files => {
        for (i = 0; i < files.length; i++) {
            if (shouldPublish(files[i])) {
                core.setOutput('is_scheduled', true);
                core.info(`${files[i]} is scheduled`);
                return;
            }
        }
    })
}

function shouldPublish(filename) {
    const file = matter.read(filename);
    if ('date' in file.data) {
        const date = moment.utc(file.data.date);
        return !date.isAfter(endTime) && date.isAfter(startTime);
    }
    return false;
}

run();