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

    init() {
        // OBJECTS
        // tick tock sound
        this.ticking = new Audio('audio/ticktock2.mp3');
        this.ticking.id = "ticking";
        this.ticking.loop = true;
    }

    loadChimes() {
        this.quarter_chimes = [];
        this.hour_chimes = [];

        // quarter chimes array
        for (let i = 0; i < 3; i++) {
            let x = new Audio();
            x.addEventListener('canplaythrough', this);
            x.classList.add('quarter_chime');
            x.src = `audio/q${i + 1}.mp3`;

            this.quarter_chimes[i] = x;
        }

        // hour chimes array
        for (let i = 0; i < 12; i++) {
            let x = new Audio();
            x.addEventListener('canplaythrough', this);
            x.classList.add('hour_chime');
            x.src = `audio/h${i + 1}.mp3`;

            this.hour_chimes[i] = x;
        }
    }

    areChimesLoaded() {
        return this.quarter_chimes_count === this.quarter_chimes_total && this.hour_chimes_count === this.hour_chimes_total;
    }

    play(hour = 0, quarter = 0) {
        if (!this.areChimesLoaded()) {
            return;
        }

        // quarterly chime
        if (quarter) {
            this.quarter_chimes[quarter - 1].play();
        }
        // hourly chime
        else if (hour) {
            this.hour_chimes[hour - 1].play();
        }
    }

    startTick() {
        this.ticking.play();
    }

    handleEvent(e) {
        let el = e.target;
        let type = e.type;

        switch (e.type) {
            case 'canplaythrough':
                // chimes loaded?
                if (el.classList.contains('quarter_chime')) {
                    this.quarter_chimes_count++;
                }

                if (el.classList.contains('hour_chime')) {
                    this.hour_chimes_count++;
                }

                if (this.areChimesLoaded()) {
                    let event = new Event('audioloaded', {
                        bubbles: true,
                        cancelable: true
                    });

                    this.dispatchEvent(event);
                }
                break;
            default:
                break;
        }
    }
} // END CLASS CHIMES

if (!customElements.get('sds-chime')) {
    customElements.define('sds-chime', Chimes);
}