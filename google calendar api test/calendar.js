const fs = require('fs');
const express = require('express');
const {google} = require('googleapis');
const authHelper = require('./auth_helper.js');

// Routing
const router = express.Router();
router.get('/events', (req, res) => { get_calendar_events(req, res) });

async function get_calendar_events(req, res){
    // Load client secrets from a local file.
    const content = await fs.promises.readFile('credentials.json');
    // Authorize a client with credentials, then call the Google Calendar API.
    authHelper.authorize(JSON.parse(content), listEvents, res);
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth, res) {
    // let filtered_events;
    const calendar = google.calendar({version: 'v3', auth});
    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, result) => {
            if(err){
                return console.log('The API returned an error: ' + err);  
            }
            else{
                //const events = result.data.items;
                // const filtered_events = events.map(({summary}) => (summary));  
                // res.send(JSON.stringify(filtered_events));

                const events = [];

                result.data.items.forEach(element => {
                    const our_event = getOurEventFromGoogleEvent(element);
                    events.push(our_event);
                });

                res.send(JSON.stringify(events));
            } 
        }
    );
}

class OurCalendar {
    constructor(name, text) {
        this.name = name;
        this.text = text;
    }
}

class ourEvent {
    constructor(summary) {
        this.summary = `${summary}, from the task manager!`;
        this.creation_date = new Date();
    }
}

function getOurEventFromGoogleEvent(event) {
    const new_event = new ourEvent(event.summary);

    return new_event;
}

module.exports = router;