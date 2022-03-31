const core = require('@actions/core');

const whatToLog = core.getInput('what_to_log', {required: true});

async function run() {
    if (whatToLog) {
        console.log("CUSTOM ACTION RUN with true");
    } else {
        console.log("CUSTOM ACTION RUN with false");
    }
}

run();