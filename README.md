# sds_clock
Analogue wall clock.

Custom HTML element <sds-clock></sds-clock>. Utilising custom elements, shadow DOM and HTML templates. Works in Firefox 73 and Chrome 80. Not testing in anything else.

All graphics hand coded in JavaScript with hourly and quarter hourly chiming audio in mp3; no images used.

Inspired by a railroad wall clock made in 1879 by the American railway pioneer Plimmon Henry Dudley.

http://delaneyantiqueclocks.com/products/detail/993/P-H-Dudley-walnut-wall-regulator-made-in-New-York-Dudley-wall-clock

API

Attribute

diameter: best range is minimum 250 to however large your monitor resolution is.

Property

diameter(value): Use in JS to dynamically resize the clock. value - number: range as for diameter attribute.

Demonstration usage:

Range slider to dynamically resize the clock's diameter from between 200 and 1000 pixels, stepped by 50.

    <div>
        <label for="diameter">Clock Diameter</label>
        <input id="diameter" type="range" min="200" max="1000" step="50" value="600" />
        <input type="text" id="current_diameter" />
    </div>

    <sds-clock id="clock" diameter="600"></sds-clock>

    <script type="module" src="sds_clock/sds_clock.js"></script>

    <style type="text/css">
        #container {
            display: grid;
            grid-template-columns: repeat(2, minmax(min-content, max-content));
            column-gap: 2em;
            margin: 0 auto;
        }
    </style>

    <script>
        document.addEventListener('DOMContentLoaded', e => {
            let clock = document.getElementById('clock');
            let diameter = document.getElementById('diameter');
            let current_diameter = document.getElementById('current_diameter');

            // events
            diameter.addEventListener('change', e => {
                setDiameter();

                clock.setAttribute('diameter', getDiameter());
            });

            function setDiameter() {
                current_diameter.value = getDiameter();

            }

            function getDiameter() {
                return diameter.value
            }

            setDiameter();
        });
    </script>
