/***************************************************************
 * FILENAME:    sds_clock.js
 * 
 * DESCRIPTION: Extends HTMLElement for the facilitation of custom element
 *              creation, definition and placement in the HTML document.
 * 
 * PUBLIC FUNCTIONS:
 *              Number get diameter()
 *              void set diameter(value)
 * 
 * NOTES:       imports the template, clock and hands modules.
 * 
 * PROBLEMS:    The diameter set method is crucial and needs some validation
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
import template from "./template.js";
import Clock from './clock.js';
import Hands from './hands.js';

export default class sdsClock extends HTMLElement {
    constructor() {
        super();

        // shadow root
        this.shadow_root = this.attachShadow({ mode: 'open' });
        this.shadow_root.appendChild(template.content.cloneNode(true));

        // elements
        this.clock = new Clock(this.shadow_root.getElementById('clock'));
        this.hands = new Hands(this.shadow_root.getElementById('hands'));

        // data
        this._diameter = 600;
    }

    // overrides HTMLElement property
    /**
     * Get an array of attribute names that are watched for changes.
     * @returns {Array} An array of the inline attributes that need to be observed.
     */
    static get observedAttributes() {
        return ['diameter'];
    }

    /**
     * Implementation of HTMLElement method called when custom element
     * is parsed as being a node in the document.
     * 
     * @returns void
     */
    connectedCallback() {
        // draw clock when element placed on document
        this.clock.draw();
    }

    /**
     * Implementation of HTMLElement method called when an observed
     * attribute value changes.
     * 
     * Hands off responsibility for error handling, validation and
     * synchronization to the respective property setter.
     * 
     * @param {String} name The attribute name.
     * @param {String} oldVal The current attribute value.
     * @param {String} newVal The new attribute value
     */
    attributeChangedCallback(name, oldVal, newVal) {
        // we're only observing diameter at present
        switch (name) {
            case 'diameter':
                this.diameter = newVal;
                break;
            default:
                break;
        }
    }

    /**
     * Get the diameter of the clock face.
     * 
     * @returns {Number} the current diameter of the clock face
     */
    get diameter() {
        return this._diameter;
    }

    /**
     * If the value is different the new value is set and the 
     * elements diameter attribute is updated.
     * 
     * the clock and the hands objects are resized accordingly.
     * 
     * @param {Number} value The new diameter value.
     * @returns void
     */
    set diameter(value) {
        // no need to proceed if values are the same
        if (parseInt(value) !== this._diameter) {
            // set object private property
            this._diameter = value;

            // if attribute value out of sync then set it
            if (parseInt(this.getAttribute('diameter')) !== parseInt(this._diameter)) {
                this.setAttribute('diameter', this._diameter);
            }

            // update clock and hands diameter
            this.clock.resize(this._diameter);
            this.hands.resize(this._diameter);
        }
    }
}

// define custom element if not previously defined
if (!customElements.get('sds-clock')) {
    customElements.define('sds-clock', sdsClock);
}
