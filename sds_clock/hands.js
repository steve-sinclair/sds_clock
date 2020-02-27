/***************************************************************
 * FILENAME:    hands.js
 * 
 * DESCRIPTION: Extends Canvas (canvas.js).
 *              Timer engine, drawing functions for
 *              the hands (hour, minute, seconds) and
 *              conversion from time to degrees in
 *              radians.
 * 
 * PUBLIC FUNCTIONS:
 *              void start()
 * 
 * NOTES:       Works in concert with clock.js and is
 *              used as a transparent canvas overlay to
 *              the clock face described in clock.js to
 *              avoid clock.js redrawing every loop
 *              cycle.
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
***************************************************************/
import Canvas from './canvas.js';
import Chimes from './chimes.js';
import { deg_to_rad } from './functions.js';

export default class Hands extends Canvas {
    constructor(canvas) {
        super(canvas);

        // could use this as a route to stopping the clock
        this.timer_handle = null;

        // audio object
        this.chimes = new Chimes();

        // event listeners
        // all chimes are pre-loaded
        this.chimes.addEventListener('audioloaded', this);

        // user changes diameter
        // we could set up an abstract method but events
        // work just as well
        this.addEventListener('canvasresize', this);
    }

    /**
     * Implementation of EventListener interface.
     * 
     * @param {Event} e The Event object passed from dispatched events.
     * @returns void
     */
    handleEvent(e) {
        let type = e.type.toLowerCase();

        // switch in place for future events
        // both events currently trigger same method
        switch (type) {
            case 'audioloaded':
            case 'canvasresize':
                this.start();
                break;
            default:
                break;
        }
    }

    /**
     * Entry point for hands.js.
     * Starts tick tock audio.
     * Begins the timing loop (20 loops per second) and draws the hands.
     * Polls for hourly and quarterly chimes
     * 
     * @returns void
     */
    start() {
        // background ticking audio
        // SYNCHRONIZATION IS A PROBLEM HERE
        this.chimes.startTick();

        this.timer_handle = setInterval(() => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // DRAW HANDS
            this.drawHands(this.ctx, this.origin, this.getTimeRadians());

            // SYNCHRONIZE CHIMES
            // All chimes have been preloaded so there is little
            // to no load latency.

            // get current time
            let { h, m, s } = this.getNow();

            // HOUR
            // hourly chimes have a 4 second winding up
            // intro that needs to be taken into account 
            // to allow the hourly chime to strike bang
            // on the hour.
            // check for 4 seconds to go
            if (s === 56) {
                if (m === 59) {
                    // adjust hour forward
                    if (h === 0 || h === 12) {
                        h = 1;
                    }
                    else {
                        h++;
                    }

                    // play audio
                    this.chimes.play(h);
                }
            }
            // QUARTER
            // these audio tracks come in straight so need no run in.
            else if (s === 0) {
                if ([15, 30, 45].includes(m)) {
                    // no need to test for 0 as that is an hourly chime anyway
                    // 15 minutes past is first quarter etc., up to 3
                    this.chimes.play(0, m / 15);
                }
            }
        }, 50);
    }

    /**
     * Draws the hour, minute and second hands and adds the centre
     * hand fixing cap.
     * 
     * @param {CanvasRenderingContext2D} ctx The 2d context obtained from the hands canvas.
     * @param {Object} origin The objext containg the x and y coordinates of the centre of the clock face.
     * @param {Object} angles The object containg the current angles (in radians) of the hour, minute and second hands.
     * @returns void
     */
    drawHands(ctx, origin, angles) {
        // this is just a series of canvas drawing instructions

        // HOUR HAND
        // ctx.resetTransform();
        ctx.translate(origin.x, origin.y);
        ctx.rotate(angles.hour);
        // base shank
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(this.diameterRatio(4), 0);
        ctx.lineTo(this.diameterRatio(-4), 0);
        ctx.lineTo(this.diameterRatio(-2), this.diameterRatio(-90));
        ctx.lineTo(this.diameterRatio(2), this.diameterRatio(-90));
        ctx.closePath();
        ctx.fill();

        // piercing
        ctx.lineWidth = this.diameterRatio(4);
        ctx.strokeStyle = "black"
        ctx.beginPath();
        ctx.moveTo(0, this.diameterRatio(-90));
        ctx.quadraticCurveTo(this.diameterRatio(-20), this.diameterRatio(-90), 0, this.diameterRatio(-120));
        ctx.moveTo(0, this.diameterRatio(-90));
        ctx.quadraticCurveTo(this.diameterRatio(20), this.diameterRatio(-90), 0, this.diameterRatio(-120));
        ctx.stroke();

        // furrel
        ctx.beginPath();
        ctx.moveTo(this.diameterRatio(2), this.diameterRatio(-120));
        ctx.lineTo(this.diameterRatio(-2), this.diameterRatio(-120));
        ctx.lineTo(0, this.diameterRatio(-150));
        ctx.closePath();
        ctx.fill();

        // MINUTE HAND
        ctx.resetTransform();
        ctx.translate(origin.x, origin.y);
        ctx.rotate(angles.minute);
        // base shank
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(this.diameterRatio(4), this.diameterRatio(20));
        ctx.lineTo(this.diameterRatio(-4), this.diameterRatio(20));
        ctx.lineTo(this.diameterRatio(-2), this.diameterRatio(-150));
        ctx.lineTo(this.diameterRatio(2), this.diameterRatio(-150));
        ctx.closePath();
        ctx.fill();

        // bottom weight
        ctx.fillStyle = "darkorange";
        ctx.beginPath();
        ctx.arc(this.diameterRatio(0), this.diameterRatio(30), this.diameterRatio(10), 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.fillStyle = "gold";
        ctx.beginPath();
        ctx.arc(this.diameterRatio(0), this.diameterRatio(30), this.diameterRatio(9), 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.fillStyle = "lightyellow";
        ctx.beginPath();
        ctx.arc(this.diameterRatio(0), this.diameterRatio(30), this.diameterRatio(8), 0, 2 * Math.PI, true);
        ctx.fill();
        // weight centre gradient
        let lgf = ctx.createLinearGradient(this.diameterRatio(-10), this.diameterRatio(12), this.diameterRatio(10), this.diameterRatio(32));
        lgf.addColorStop(0, "white");
        lgf.addColorStop(0.5, "gold")
        lgf.addColorStop(1, "white");
        ctx.fillStyle = lgf;
        ctx.beginPath();
        ctx.arc(this.diameterRatio(0), this.diameterRatio(30), this.diameterRatio(7), 0, 2 * Math.PI, true);
        ctx.fill();

        // piercing
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(this.diameterRatio(0), this.diameterRatio(-150));
        ctx.bezierCurveTo(this.diameterRatio(20), this.diameterRatio(-140), this.diameterRatio(20), this.diameterRatio(-190), this.diameterRatio(0), this.diameterRatio(-180));
        ctx.lineWidth = this.diameterRatio(4);
        ctx.stroke();

        // piercing bar
        ctx.lineWidth = this.diameterRatio(4);
        ctx.beginPath();
        ctx.moveTo(this.diameterRatio(1), this.diameterRatio(-150));
        ctx.lineTo(this.diameterRatio(-8), this.diameterRatio(-150));
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.diameterRatio(1), this.diameterRatio(-180));
        ctx.lineTo(this.diameterRatio(-8), this.diameterRatio(-180));
        ctx.stroke();

        ctx.lineWidth = this.diameterRatio(2);
        ctx.beginPath();
        ctx.moveTo(this.diameterRatio(-5), this.diameterRatio(-150));
        ctx.lineTo(this.diameterRatio(-5), this.diameterRatio(-180));
        ctx.stroke();

        // furrel
        ctx.beginPath();
        ctx.moveTo(this.diameterRatio(2), this.diameterRatio(-180));
        ctx.lineTo(this.diameterRatio(-2), this.diameterRatio(-180));
        ctx.lineTo(0, this.diameterRatio(-220));
        ctx.closePath();
        ctx.fill();

        // SECOND HAND
        ctx.resetTransform();
        ctx.translate(origin.x, origin.y);
        ctx.rotate(angles.second);
        // shank
        lgf = ctx.createLinearGradient(this.diameterRatio(-3), this.diameterRatio(0), this.diameterRatio(3), this.diameterRatio(0));
        lgf.addColorStop(0.0, "darkgrey");
        lgf.addColorStop(0.35, "silver");
        lgf.addColorStop(0.5, "white")
        lgf.addColorStop(0.65, "silver");
        lgf.addColorStop(1.0, "darkgrey");
        ctx.fillStyle = lgf;

        ctx.beginPath();
        ctx.moveTo(this.diameterRatio(3), this.diameterRatio(18));
        ctx.lineTo(this.diameterRatio(-3), this.diameterRatio(18));
        ctx.lineTo(this.diameterRatio(-1), this.diameterRatio(-240));
        ctx.lineTo(this.diameterRatio(1), this.diameterRatio(-240));
        ctx.closePath();
        ctx.fill();

        // bottom weight
        ctx.lineWidth = this.diameterRatio(4);
        lgf = ctx.createRadialGradient(this.diameterRatio(0), this.diameterRatio(24), this.diameterRatio(6), this.diameterRatio(0), this.diameterRatio(28), this.diameterRatio(10));
        lgf.addColorStop(0.0, "darkgrey");
        lgf.addColorStop(0.4, "silver");
        lgf.addColorStop(0.5, "white")
        lgf.addColorStop(0.6, "silver");
        lgf.addColorStop(1.0, "darkgrey");
        ctx.strokeStyle = lgf;

        ctx.beginPath();
        ctx.arc(this.diameterRatio(0), this.diameterRatio(26), this.diameterRatio(8), 0, 2 * Math.PI, true);
        ctx.stroke();

        // ADD CENTRE CAP
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.diameterRatio(0), this.diameterRatio(0), this.diameterRatio(12), 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.fillStyle = "darkgrey";
        ctx.beginPath();
        ctx.arc(this.diameterRatio(0), this.diameterRatio(0), this.diameterRatio(11), 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.diameterRatio(0), this.diameterRatio(0), this.diameterRatio(10), 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.fillStyle = "darkslategrey";
        ctx.beginPath();
        ctx.arc(this.diameterRatio(0), this.diameterRatio(0), this.diameterRatio(2), 0, 2 * Math.PI, true);
        ctx.fill();

        ctx.resetTransform();
    }

    /**
     * Gets the current time, extracts the hours, minutes and seconds and
     * converts them first to degrees and then radians.
     * @returns {Object} Object containing hour, minute and seconds in radians
     */
    getTimeRadians() {
        // time fragments
        let { h, m, s } = this.getNow();

        // hour is 30 degrees
        // plus the fractional elements of the minutes
        // and seconds
        let h_deg = ((30 * h) + (m / 60 * 30) + (s / 360 * 6)) * deg_to_rad;

        // minutes are 6 degrees
        // plus the fractional element of the seconds
        let m_deg = ((6 * m) + (s / 60 * 6)) * deg_to_rad;

        // seconds are 6 degrees
        let s_deg = (6 * s) * deg_to_rad;

        // return object for hour, minutes and seconds
        return { hour: h_deg, minute: m_deg, second: s_deg };
    }

    /**
     * Gets the current time into an object containing hours, minutes and seconds
     * @returns {Object} Object with properties h, m and s.
     */
    getNow() {
        // current time
        let now = new Date();

        // return object for hour, minutes and seconds
        return { h: now.getHours() % 12, m: now.getMinutes(), s: now.getSeconds() };
    }
} // END CLASS HANDS

// define custom element if not previously defined
if (!customElements.get('sds-clock-hands')) {
    customElements.define('sds-clock-hands', Hands);
}