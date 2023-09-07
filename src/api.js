const express = require("express");
const serverless = require("serverless-http");

// Create an instance of the Express app
const app = express();

// Create a router to handle routes
const router = express.Router();

// Define a route that responds with a JSON object when a GET request is made to the root path
router.get('/', (req, res) => {
    console.log("hello")
    const { slack_name, track } = req.query;

    // Validate the 'offset' parameter to be within +/- 2
    const offsetValue = parseInt(1);
    if (isNaN(offsetValue) || Math.abs(offsetValue) > 2) {
        return res.status(400).json({ error: 'Invalid offset value. It should be between -2 and 2.' });
    }

    const now = new Date();
    now.setUTCHours(now.getUTCHours() + offsetValue);

    var stat_code = res.statusCode

    const info = {
        slack_name: slack_name || 'Unknown',
        current_day: now.toLocaleString('en-US', { weekday: 'long' }),
        utc_time: now.toISOString(),
        track: track,
        github_file_url: 'https://github.com/IniBen/info/blob/main/index.js',
        github_repo_url: 'https://github.com/IniBen/info',
        status_code: stat_code.toString()
    };

    res.status(200).json(info);

});

// Use the router to handle requests to the `/.netlify/functions/api` path
app.use('/.netlify/functions/api', router);

// Export the app and the serverless function
module.exports.handler = serverless(app);