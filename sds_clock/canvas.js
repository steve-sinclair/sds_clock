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

    resize(diameter) {
        this.canvas.setAttribute('width', `${diameter}px`);
        this.canvas.setAttribute('height', `${diameter}px`);
        this.origin.x = this.canvas.offsetWidth / 2;
        this.origin.y = this.canvas.offsetHeight / 2;
        this.radius = this.canvas.offsetWidth / 2;

        this.diameter_ratio = this.canvas.offsetWidth / this._set_diameter;

        let event = new Event('canvasresize', {
            bubbles: true,
            cancelable: true
        });

        this.dispatchEvent(event);
    }

    diameterRatio(value) {
        return value * this.diameter_ratio;
    }

} // END CLASS CANVAS

if (!customElements.get('sds-canvas')) {
    customElements.define('sds-canvas', Canvas);
}