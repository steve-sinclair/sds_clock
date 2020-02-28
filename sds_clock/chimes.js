/***************************************************************
 * FILENAME:    chimes.js
 * 
 * DESCRIPTION: Extends HTMLElement for the facilitation of event listeners.
 *              Preloads the ticking backing audio and the chimes
 *              for the hours and quarter hours.
 * 
 * PUBLIC FUNCTIONS:
 *              void play()
 * 
 * NOTES:       Called by Hands object.
 *              Extends HTMLElement so that event listeners can be
 *              registered and captured.
 * 
 * PROBLEMS:    Synchronization between the ticking backing audio
 *              and the actual movement of the second hand.
 *              Any comments here would be appreciated.
 * 
 * AUTHOR:      Steve Sinclair
 * START DATE:  17th February 2020
 * LICENSE:     None. Free use.
 * 
 * CHANGE LOG:
 * DATE         DETAIL  
 * 26/2/20      General clean up. Removal of console logs.
 * 27/2/20      Add module header and JSDocs headers
 * 28/2/20      Error handling for audio loading
***************************************************************/
export default class Chimes extends HTMLElement {
    constructor() {
        super();

        this.hour_chimes_total = 12;
        this.quarter_chimes_total = 3;
        this.hour_chimes_count = 0;
        this.quarter_chimes_count = 0;

        this.init();
        this.loadChimes();
    }

    /**
     * Creates and primes the ticking backing track.
     * 
     * @returns void
     */
    init() {
        // OBJECTS
        // create and prime tick tock sound
        this.ticking = new Audio();
        this.ticking.addEventListener('error', this);
        this.ticking.id = "ticking";
        this.ticking.loop = true;
        this.ticking.src = "audio/ticktock2.mp3"
    }

    /**
     * Creates 2 arrays for stroring audio objects for each of the 
     * 12 hourly chimes and the 3 quarterly chimes.
     * 
     * src properties and Event listeners are set for each.
     * 
     * The canplaythrough event is handled elsewhere.
     * 
     * @returns void
     */
    loadChimes() {
        this.quarter_chimes = [];
        this.hour_chimes = [];

        // quarter chimes array
        for (let i = 0; i < 3; i++) {
            // audio object
            let x = new Audio();

            // event listeners handled by the class
            x.addEventListener('canplaythrough', this);
            x.addEventListener('error', this);

            // add class for css selector identification
            x.classList.add('quarter_chime');

            // prime with src
            x.src = `audio/q${i + 1}.mp3`;

            // add to array
            this.quarter_chimes[i] = x;
        }

        // hour chimes array
        // ...procedures as above...
        for (let i = 0; i < 12; i++) {
            let x = new Audio();
            x.addEventListener('canplaythrough', this);
            x.addEventListener('error', this);
            x.classList.add('hour_chime');
            x.src = `audio/h${i + 1}.mp3`;

            this.hour_chimes[i] = x;
        }
    }

    /**
     * Returns true when all the chimes have been loaded and are ready to play
     * via the canplaythrough.
     * 
     * @returns {Boolean} If the current count and total of both the hour and quarter chimes are equal
     *                      then true, otherwise false.
     */
    areChimesLoaded() {
        return this.quarter_chimes_count === this.quarter_chimes_total && this.hour_chimes_count === this.hour_chimes_total;
    }

    /**
     * Plays either the hour or quarter chime passed.
     * 
     * @param {Number} hour The hour chime to play or 0 for quarter.
     * @param {Number} quarter The quarter to play or empty for hour.
     */
    play(hour = 0, quarter = 0) {
        // bail out if chimes not yet loaded
        if (!this.areChimesLoaded()) {
            return;
        }

        // quarterly chime
        if (quarter) {
            // adjust quarter by -1 to access correct array element
            this.quarter_chimes[quarter - 1].play();
        }
        // hourly chime
        else if (hour) {
            // adjust hour by -1 to access correct array element
            this.hour_chimes[hour - 1].play();
        }
    }

    /**
     * Starts the ticking audio backing track.
     * 
     * @returns void
     */
    startTick() {
        this.ticking.play();
    }

    /**
     * Implementation of EventListener interface.
     * 
     * @param {Event} e The Event object passed from dispatched events.
     * @returns void
     */
    handleEvent(e) {
        // element and event type
        let el = e.target;
        let type = e.type;

        switch (e.type) {
            case 'canplaythrough':
                // determine quarterly and hourly audio file
                // loaded.
                // increment counts.
                if (el.classList.contains('quarter_chime')) {
                    this.quarter_chimes_count++;
                }

                if (el.classList.contains('hour_chime')) {
                    this.hour_chimes_count++;
                }

                // if all chimes are loaded fire audioloaded event
                if (this.areChimesLoaded()) {
                    let event = new Event('audioloaded', {
                        bubbles: true,
                        cancelable: true
                    });

                    this.dispatchEvent(event);
                }
                break;
            case 'error':
                switch (el.error.code) {
                    case MEDIA_ERR_ABORTED:
                        throw `Error: ${el.error.message}, Code: ${el.error.code} - Audio download aborted (${el.src})`;
                    case MEDIA_ERR_NETWORK:
                        throw `Error: ${el.error.message}, Code: ${el.error.code} - Audio download failed due to network error (${el.src})`;
                    case MEDIA_ERR_DECODE:
                        throw `Error: ${el.error.message}, Code: ${el.error.code} - Audio could not be decoded (${el.src})`;
                    case MEDIA_ERR_SRC_NOT_SUPPORTED:
                        throw `Error: ${el.error.message}, Code: ${el.error.code} - Audio format not supported (${el.src})`;
                }
                break;
            default:
                break;
        }
    }
} // END CLASS CHIMES

// define custom element if not previously defined
if (!customElements.get('sds-chime')) {
    customElements.define('sds-chime', Chimes);
}