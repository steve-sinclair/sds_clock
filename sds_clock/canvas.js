/***************************************************************
 * FILENAME:    canvas.js
 * 
 * DESCRIPTION: Extends HTMLElement for the facilitation of event listeners.
 *              Provides the basic infrastructure for resizing by diameter
 *              and general canvas dimensions, drawing context and clock face
 *              radius.
 * 
 * PUBLIC FUNCTIONS:
 *              void resize()
 * 
 * NOTES:       Implemented by both the Clock and Hands objects.
 * 
 * PROBLEMS:    The resize method is crucial and needs some validation
 *              and error checking which I will implement shortly.
 *              It just works fine in my hands but that is not the issue.
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
export default class Canvas extends HTMLElement {
    constructor(canvas) {
        super();

        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.origin = {
            x: this.canvas.offsetWidth / 2,
            y: this.canvas.offsetHeight / 2
        };
        this.radius = this.canvas.offsetWidth / 2;

        // clock based on 600 diameter
        // therefore ratio for fonts etc is width/600
        this._set_diameter = 600;
        this.diameter_ratio = this.canvas.offsetWidth / this._set_diameter;
    }

    /**
     * Sets the width and height of this canvas.
     * 
     * Updates the origin, radius and the diameter ratio.
     * 
     * Fires the canvasresize event on itself.
     * 
     * @param {Number} diameter The new diameter of the clock face
     * @returns void
     */
    resize(diameter) {
        // need to validate and error check here

        // set this width and height
        this.canvas.setAttribute('width', `${diameter}px`);
        this.canvas.setAttribute('height', `${diameter}px`);

        // update object properties
        this.origin.x = this.canvas.offsetWidth / 2;
        this.origin.y = this.canvas.offsetHeight / 2;
        this.radius = this.canvas.offsetWidth / 2;

        this.diameter_ratio = this.canvas.offsetWidth / this._set_diameter;

        // fire canvasresize event
        let event = new Event('canvasresize', {
            bubbles: true,
            cancelable: true
        });

        this.dispatchEvent(event);
    }

    /**
     * Pass in a standard value and get the adjusted value from the diameter
     * ratio.
     * 
     * @param {Number} value The value needing adjustment to current diameter ratio
     * working from 600px as the mean.
     */
    diameterRatio(value) {
        // adjust for diameter ratio
        return value * this.diameter_ratio;
    }

} // END CLASS CANVAS

// define custom element if not previously defined
if (!customElements.get('sds-canvas')) {
    customElements.define('sds-canvas', Canvas);
}