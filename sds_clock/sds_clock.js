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

    static get observedAttributes() {
        return ['diameter'];
    }

    connectedCallback() {
        this.clock.draw();
    }

    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case 'diameter':
                console.log('attribute changed', name, newVal);
                this.diameter = newVal;
                break;
            default:
                break;
        }
    }

    get diameter() {
        return this._diameter;
    }

    set diameter(value) {
        if (parseInt(value) !== this._diameter) {
            this._diameter = value;

            if (parseInt(this.getAttribute('diameter')) !== parseInt(this._diameter)) {
                this.setAttribute('diameter', this._diameter);
            }

            console.log('call resizing');
            // update clock and hands diameter
            this.clock.resize(this._diameter);
            this.hands.resize(this._diameter);
        }
    }
}

if (!customElements.get('sds-clock')) {
    customElements.define('sds-clock', sdsClock);
}
