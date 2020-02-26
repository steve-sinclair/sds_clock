import Canvas from './canvas.js';
import { deg_to_rad } from './functions.js';

export default class Clock extends Canvas {
    constructor(canvas) {
        super(canvas);
        console.log("clock");

        this.font = "Century Schoolbook L";

        this.addEventListener('canvasresize', this);
    }

    handleEvent(e) {
        if (e.type.toLowerCase() === 'canvasresize') {
            this.draw();
        }
    }

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

    drawSurround2(ctx, origin, radius) {
        let lgs = ctx.createRadialGradient(origin.x, origin.y, radius * this.radii.surround_inner, origin.x, origin.y, radius * this.radii.surround_outer);
        lgs.addColorStop(0, "saddlebrown");
        lgs.addColorStop(0.25, "sienna");
        lgs.addColorStop(0.5, "burlywood");
        lgs.addColorStop(0.75, "sienna");
        lgs.addColorStop(1, "saddlebrown");
        ctx.fillStyle = lgs;

        ctx.beginPath();
        ctx.arc(origin.x, origin.y, radius * this.radii.surround_outer, 0, 2 * Math.PI, true);
        ctx.arc(origin.x, origin.y, radius * this.radii.surround_inner, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.fill();
    }

    drawClockFacePlate(ctx, origin, radius) {
        // plate colour
        ctx.fillStyle = "palegoldenrod";
        ctx.beginPath();
        ctx.arc(origin.x, origin.y, radius * this.radii.surround_inner, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.fill();

        // legend
        let legend = "ELECTRONICALLY CONTROLLED"
        ctx.font = `${this.diameterRatio(10)}px ${this.font}`;
        let width = this.diameterRatio(ctx.measureText(legend).width);
        ctx.textBaseline = "bottom";
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.translate(origin.x, origin.y);
        ctx.fillText(legend, 0, radius * this.radii.legend, width * 0.7);

        // hand adjustment keyhole
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

            let adjusted_for_kerning = i === text.length - 1 ? 0 : kerning;
            let adjusted_letter_width = (letter_width * max_letter_width) + adjusted_for_kerning;
            let adjusted_radius = radius * radius_length_ratio;
            let half_angle = (adjusted_letter_width / adjusted_radius) / (2 * clockwise);

            // adjust angle to 50% in the direction
            start_angle += ((adjusted_letter_width / adjusted_radius) / (2 * clockwise));
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

        ctx.resetTransform();
    }

    drawMinutesandHoursCircles(ctx, origin, radius) {
        // outer and inner arcs
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;

        // minute markers surround
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

    drawMinuteGraduations(ctx, origin, radius) {
        for (let angle = 0; angle < 60; angle++) {
            ctx.translate(origin.x, origin.y);
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

    drawClockFaceNumbers(ctx, origin, radius, text_array, font, font_size, kerning, max_letter_width, radius_length_ratio, inward_facing = true, reverse = false) {
        let clockwise = -1;

        ctx.font = `${font_size}px ${font}`;

        for (let angle = 0; angle < text_array.length; angle++) {
            let text = text_array[angle];

            // Setup numbers and positioning
            // move to centre
            ctx.translate(origin.x, origin.y);

            // angle in radians
            let start_angle = (angle * 30) * deg_to_rad;
            start_angle += (Math.PI * !inward_facing); // Rotate 180 if outward

            // if reversal needed for outward facing text
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

                let adjusted_for_kerning = i === text.length - 1 ? 0 : kerning;
                let adjusted_letter_width = (letter_width * max_letter_width) + adjusted_for_kerning;
                let adjusted_radius = radius * radius_length_ratio;
                let half_angle = (adjusted_letter_width / adjusted_radius) / (2 * clockwise);

                // adjust angle to 50% in the direction
                start_angle += ((adjusted_letter_width / adjusted_radius) / (2 * clockwise));
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

if (!customElements.get('sds-clock-face')) {
    customElements.define('sds-clock-face', Clock);
}