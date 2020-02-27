/***************************************************************
 * FILENAME:    clock.js
 * 
 * DESCRIPTION: Extends Canvas (canvas.js).
 *              Draws the clock face elements i.e.
 *              clock surround,
 *              face plate,
 *              makers name and location,
 *              the hour and minute containing circles,
 *              the minute graduations,
 *              the minute and hour numbers and numerals.
 * 
 * PUBLIC FUNCTIONS:
 *              void draw()
 * 
 * NOTES:       Works in concert with hand.js and is
 *              used as an underlay canvas to the hands
 *              described in hands.js.
 * 
 * AUTHOR:      Steve Sinclair
 * CREDIT:      James Alford
 *              For inspiration on curved text algolrithms
 *              http://html5graphics.blogspot.com/2015/03/html5-canvas-rounded-text.html#comment-form
 * 
 * START DATE:  17th February 2020
 * LICENSE:     None. Free use.
 * 
 * CHANGE LOG:
 * DATE         DETAIL  
 * 26/2/20      General clean up. Removal of console logs.
 * 27/2/20      Add module header and JSDocs headers
***************************************************************/
import Canvas from './canvas.js';
import { deg_to_rad } from './functions.js';

export default class Clock extends Canvas {
    constructor(canvas) {
        super(canvas);

        this.font = "Century Schoolbook L, Georgia, serif";

        this.addEventListener('canvasresize', this);
    }

    /**
     * Implementation of EventListener interface.
     * 
     * @param {Event} e The Event object passed from dispatched events.
     * @returns void
     */
    handleEvent(e) {
        if (e.type.toLowerCase() === 'canvasresize') {
            this.draw();
        }
    }

    /**
     * Entry point for clock.js.
     * Sets up the lengths along the radius for placement 
     * of each discrete element.
     * 
     * Creates string arrays for the numbers and numerals.
     * 
     * Draws the clock face elements in order of back to front to avoid
     * overpainting.
     * 
     * @returns void
     */
    draw() {
        // clock face radii for design working outwards
        this.radii = {
            legend: 0.1,
            keyhole: 0.15,
            makers_name: 0.29,
            makers_location: 0.39,
            hours_inner: 0.45,
            hour_numerals: 0.52,
            hours_outer: 0.64,
            minutes_inner: 0.72,
            diamond_middle: 0.75,
            minutes_outer: 0.78,
            minute_numbers: 0.81,
            surround_inner: 0.86,
            surround_outer: 0.99
        };

        // clock face numbers
        let minutes_array = ['60', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
        let hours_array = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

        // build up layers of clock
        this.drawSurround2(this.ctx, this.origin, this.radius);
        this.drawClockFacePlate(this.ctx, this.origin, this.radius);
        // makers name
        this.drawMakersDetails(this.ctx, this.origin, this.radius, "P . H . DUDLEY", this.font, this.diameterRatio(16), this.diameterRatio(0), 1, this.radii.makers_name);
        // makers location
        this.drawMakersDetails(this.ctx, this.origin, this.radius, "N . Y .", this.font, this.diameterRatio(16), this.diameterRatio(0), 1, this.radii.makers_location);
        this.drawMinutesandHoursCircles(this.ctx, this.origin, this.radius);
        this.drawMinuteGraduations(this.ctx, this.origin, this.radius);
        // minute numbers
        this.drawClockFaceNumbers(this.ctx, this.origin, this.radius, minutes_array, this.font, this.diameterRatio(20), this.diameterRatio(-1), 1, this.radii.minute_numbers);
        // hour numerals
        this.drawClockFaceNumbers(this.ctx, this.origin, this.radius, hours_array, this.font, this.diameterRatio(65), this.diameterRatio(-3), 0.25, this.radii.hour_numerals);
    }

    /**
     * Creates a radial gradient of differing shades of browns to
     * recreate the light wood vaneer of the sample real world
     * clock case.
     * 
     * Draws 2 arcs and fills with the gradient pattern.
     * 
     * @param {CanvasRenderingContext2D} ctx The 2d context obtained from the clock canvas.
     * @param {Object} origin The objext containg the x and y coordinates of the centre of the clock face.
     * @param {Number} radius The current radius of the clock face.
     * @returns void
     */
    drawSurround2(ctx, origin, radius) {
        // brown wood effect(!) radial gradient
        let lgs = ctx.createRadialGradient(origin.x, origin.y, radius * this.radii.surround_inner, origin.x, origin.y, radius * this.radii.surround_outer);
        lgs.addColorStop(0, "saddlebrown");
        lgs.addColorStop(0.25, "sienna");
        lgs.addColorStop(0.5, "burlywood");
        lgs.addColorStop(0.75, "sienna");
        lgs.addColorStop(1, "saddlebrown");
        ctx.fillStyle = lgs;

        // draw 2 concentric circles to given radii
        ctx.beginPath();
        ctx.arc(origin.x, origin.y, radius * this.radii.surround_outer, 0, 2 * Math.PI, true);
        ctx.arc(origin.x, origin.y, radius * this.radii.surround_inner, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.fill();
    }

    /**
     * Draws the face plate.
     * 
     * Adds the Electronically Controlled legend.
     * 
     * Draws the adjustment keyhole.
     * 
     * @param {CanvasRenderingContext2D} ctx The 2d context obtained from the clock canvas.
     * @param {Object} origin The objext containg the x and y coordinates of the centre of the clock face.
     * @param {Number} radius The current radius of the clock face.
     * @returns void
     */

    drawClockFacePlate(ctx, origin, radius) {
        // face plate circle and fill
        ctx.fillStyle = "palegoldenrod";
        ctx.beginPath();
        ctx.arc(origin.x, origin.y, radius * this.radii.surround_inner, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.fill();

        // legend
        // centred and bottomed out baseline wise
        let legend = "ELECTRONICALLY CONTROLLED"
        ctx.font = `${this.diameterRatio(10)}px ${this.font}`;
        let width = this.diameterRatio(ctx.measureText(legend).width);
        ctx.textBaseline = "bottom";
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.translate(origin.x, origin.y);
        ctx.fillText(legend, 0, radius * this.radii.legend, width * 0.7);

        // hand adjustment keyhole
        // 2 concentric circles black with darkgrey outer
        ctx.fillStyle = "darkgrey";
        ctx.beginPath();
        ctx.arc(this.diameterRatio(0), radius * this.radii.keyhole, this.diameterRatio(9), 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.diameterRatio(0), radius * this.radii.keyhole, this.diameterRatio(7), 0, 2 * Math.PI, true);
        ctx.fill();

        ctx.resetTransform();
    }


    /**
     * Reverses the text.
     * 
     * Recalculates the start angle based on arc lengths of each character
     * of the text.
     * 
     * Rotate the canvas to this new angle.
     * 
     * Draws each character on the given curve.
     * 
     * @param {CanvasRenderingContext2D} ctx The 2d context obtained from the clock canvas.
     * @param {Object} origin The objext containg the x and y coordinates of the centre of the clock face.
     * @param {Number} radius The current radius of the clock face.
     * @param {String} text The text to lay out on the curve.
     * @param {String} font The font(s) in CSS style.
     * @param {Number} font_size Font size in pixels.
     * @param {Number} kerning The space in pixels (+/-) between characters.
     * @param {Number} max_letter_width Ratio of text width to expand/condense text.
     * @param {Number} radius_length_ratio Baseline from radius to draw text.
     * @returns void
     */
    drawMakersDetails(ctx, origin, radius, text, font, font_size, kerning, max_letter_width, radius_length_ratio) {
        ctx.font = `${font_size}px ${font}`;
        let clockwise = -1;
        let start_angle = 0;
        let inward_facing = false

        // reverse text
        text = text.split("").reverse().join("");

        // translate origin
        ctx.translate(origin.x, origin.y);

        // rotate 50% of total angle for center alignment
        for (let i = 0; i < text.length; i++) {
            let letter_width = ctx.measureText(text[i]).width;

            // obtain the half angle offset along the curve
            let adjusted_for_kerning = i === text.length - 1 ? 0 : kerning;
            let adjusted_letter_width = (letter_width * max_letter_width) + adjusted_for_kerning;
            let adjusted_radius = radius * radius_length_ratio;
            let half_angle = (adjusted_letter_width / adjusted_radius) / (2 * clockwise);

            // adjust angle to 50% in the direction
            start_angle += half_angle;
        }

        // rotate into actual start position
        ctx.rotate(start_angle);

        // draw each numeral component
        for (let i = 0; i < text.length; i++) {
            // get width of each character
            let letter_width = ctx.measureText(text[i]).width;

            // rotate half numeral
            ctx.rotate(((letter_width * max_letter_width) / 2) / (radius * radius_length_ratio) * -clockwise);

            // draw the numeral
            ctx.fillText(text[i], 0, (!inward_facing ? 1 : -1) * radius * radius_length_ratio, letter_width * max_letter_width);

            // rotate a half numeral plus kerning
            ctx.rotate((((letter_width * max_letter_width) / 2) + kerning) / (radius * radius_length_ratio) * -clockwise);
        }

        ctx.resetTransform();
    }


    /**
     * Draws the outer and inner circles that delimit the minute
     * and hour numbers, numerals and graduations.

     * @param {CanvasRenderingContext2D} ctx The 2d context obtained from the clock canvas.
     * @param {Object} origin The objext containg the x and y coordinates of the centre of the clock face.
     * @param {Number} radius The current radius of the clock face.
     * @returns void
     */
    drawMinutesandHoursCircles(ctx, origin, radius) {
        // outer and inner arcs
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;

        // minute numbers and graduations markers surround
        ctx.beginPath();
        ctx.arc(origin.x, origin.y, radius * this.radii.minutes_outer, 0, 2 * Math.PI, true);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(origin.x, origin.y, radius * this.radii.minutes_inner, 0, 2 * Math.PI, true);
        ctx.stroke();

        // hour numerals surround
        ctx.beginPath();
        ctx.arc(origin.x, origin.y, radius * this.radii.hours_outer, 0, 2 * Math.PI, true);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(origin.x, origin.y, radius * this.radii.hours_inner, 0, 2 * Math.PI, true);
        ctx.stroke();
    }


    /**
     * Draws 60 rectangular markers, one for each minute.
     * 
     * For every 5 minute intervals, draw a diamond instead.
     * 
     * @param {CanvasRenderingContext2D} ctx The 2d context obtained from the clock canvas.
     * @param {Object} origin The objext containg the x and y coordinates of the centre of the clock face.
     * @param {Number} radius The current radius of the clock face.
     * @returns void
     */
    drawMinuteGraduations(ctx, origin, radius) {
        // iterate for each minute
        for (let angle = 0; angle < 60; angle++) {
            ctx.translate(origin.x, origin.y);

            // rotate extra 6 degrees for each minute
            ctx.rotate((angle * 6) * deg_to_rad);

            // 5 minute diamond markers
            if (angle % 5 === 0) {
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.moveTo(0, -(radius * this.radii.minutes_inner));
                ctx.lineTo(this.diameterRatio(-3), -(radius * this.radii.diamond_middle));
                ctx.lineTo(0, -(radius * this.radii.minutes_outer));
                ctx.lineTo(this.diameterRatio(3), -(radius * this.radii.diamond_middle));
                ctx.lineTo(0, -(radius * this.radii.minutes_inner));
                ctx.fill();
            }
            // intermediate minute rectangle markers
            else {
                ctx.lineWidth = this.diameterRatio(3);
                ctx.strokeStyle = "black";
                ctx.beginPath();
                ctx.moveTo(0, -(radius * this.radii.minutes_inner));
                ctx.lineTo(0, -(radius * this.radii.minutes_outer));
                ctx.closePath();
                ctx.stroke();
            }

            ctx.resetTransform();
        }
    }


    /**
     * Iterates each element in text_array, sets angle in radians and adjusts for outward
     * facing text, reversing text if necessary.
     * 
     * Set text baseline to middle and text align to centre.
     * 
     * Recalculates the start angle based on arc lengths of each character
     * of the text and takes 50%.
     * 
     * Rotate the canvas to this new angle.
     * 
     * Draws each character on the given curve.
     * 
     * @param {CanvasRenderingContext2D} ctx The 2d context obtained from the clock canvas.
     * @param {Object} origin The objext containg the x and y coordinates of the centre of the clock face.
     * @param {Number} radius The current radius of the clock face.
     * @param {Array} text_array Array of numerals etc to draw in a curved fashion around the clock face.
     * @param {String} font The font(s) in CSS style.
     * @param {Number} font_size Font size in pixels.
     * @param {Number} kerning The space in pixels (+/-) between characters.
     * @param {Number} max_letter_width Ratio of text width to expand/condense text.
     * @param {Number} radius_length_ratio Baseline from radius to draw text.
     * @param {Boolean} inward_facing If text faces inwards (default) or outwards.
     * @param {Boolean} reverse If outward facing then set to true. false (default).
     * @returns void
     */
    drawClockFaceNumbers(ctx, origin, radius, text_array, font, font_size, kerning, max_letter_width, radius_length_ratio, inward_facing = true, reverse = false) {
        let clockwise = -1;

        // CSS like font property
        ctx.font = `${font_size}px ${font}`;

        // iterate text_array
        for (let angle = 0; angle < text_array.length; angle++) {
            let text = text_array[angle];

            // Setup numbers and positioning
            // move to centre
            ctx.translate(origin.x, origin.y);

            // angle in radians
            let start_angle = (angle * 30) * deg_to_rad;

            // Rotate 180 if outward facing to turn text upside down
            start_angle += (Math.PI * !inward_facing);

            // reversal needed for outward facing text
            if (reverse) {
                text = text.split("").reverse().join("");
            }

            // CENTRE HORIZONTALLY AND VERTICALLY
            // text baseline
            ctx.textBaseline = 'middle';
            // align text centre
            ctx.textAlign = 'center';

            // rotate 50% of total angle for center alignment
            for (let i = 0; i < text.length; i++) {
                let letter_width = ctx.measureText(text[i]).width;

                // obtain the half angle offset along the curve
                let adjusted_for_kerning = i === text.length - 1 ? 0 : kerning;
                let adjusted_letter_width = (letter_width * max_letter_width) + adjusted_for_kerning;
                let adjusted_radius = radius * radius_length_ratio;
                let half_angle = (adjusted_letter_width / adjusted_radius) / (2 * clockwise);

                // adjust angle to 50% in the direction
                start_angle += half_angle;
            }

            // rotate into actual start position
            ctx.rotate(start_angle);

            // draw each numeral component
            for (let i = 0; i < text.length; i++) {
                let letter_width = ctx.measureText(text[i]).width;

                // rotate half numeral
                ctx.rotate(((letter_width * max_letter_width) / 2) / (radius * radius_length_ratio) * -clockwise);

                // draw the numeral
                ctx.fillText(text[i], 0, (!inward_facing ? 1 : -1) * radius * radius_length_ratio, letter_width * max_letter_width);

                // rotate a half numeral plus kerning
                ctx.rotate((((letter_width * max_letter_width) / 2) + kerning) / (radius * radius_length_ratio) * -clockwise);
            }

            // clear out previous transform(s) ready for next numeral
            ctx.resetTransform();
        }
    }
} // END CLASS CLOCK

// define custom element if not previously defined
if (!customElements.get('sds-clock-face')) {
    customElements.define('sds-clock-face', Clock);
}