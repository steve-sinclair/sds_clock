import Canvas from './canvas.js';
import Chimes from './chimes.js';
import { deg_to_rad } from './functions.js';

export default class Hands extends Canvas {
    constructor(canvas) {
        super(canvas);
        console.log("hands");

        this.timer_handle = null;

        this.chimes = new Chimes();
        this.chimes.addEventListener('audioloaded', this);

        this.addEventListener('canvasresize', this);

    }

    handleEvent(e) {
        console.log('hands event', e.type);
        let el = e.target;
        let type = e.type;

        if (type = 'audioloaded') {
            console.log("audio loaded...starting.");
            this.start();
        }

        if (type.toLowerCase() === 'canvasresize') {
            this.start();
        }
    }

    start() {
        this.chimes.startTick();

        this.timer_handle = setInterval(() => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // DRAW HANDS
            this.drawHands(this.ctx, this.origin, this.getTimeRadians());

            // SYNCHRONIZE CHIMES
            // need chime?
            let { h, m, s } = this.getNow();

            // HOUR
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

                    this.chimes.play(h);
                }
            }
            // QUARTER
            else if (s === 0) {
                if ([15, 30, 45].includes(m)) {
                    // no need to test for 0 as that is an hourly chime anyway
                    // 15 minutes past is first quarter etc., up to 3
                    this.chimes.play(0, m / 15);
                }
            }
        }, 50);
    }

    drawHands(ctx, origin, angles) {
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
        lgf = ctx.createRadialGradient(this.diameterRatio(0), this.diameterRatio(24),this.diameterRatio(6), this.diameterRatio(0), this.diameterRatio(28),this.diameterRatio(10));
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

    getTimeRadians() {
        // time fragments
        let { h, m, s } = this.getNow();

        let h_deg = ((30 * h) + (m / 60 * 30) + (s / 360 * 6)) * deg_to_rad;
        let m_deg = ((6 * m) + (s / 60 * 6)) * deg_to_rad;
        let s_deg = (6 * s) * deg_to_rad;

        return { hour: h_deg, minute: m_deg, second: s_deg };
    }

    getNow() {
        let now = new Date();

        return { h: now.getHours() % 12, m: now.getMinutes(), s: now.getSeconds() };
    }
} // END CLASS HANDS

if (!customElements.get('sds-clock-hands')) {
    customElements.define('sds-clock-hands', Hands);
}