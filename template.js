/***************************************************************
 * FILENAME:    template.js
 * 
 * DESCRIPTION: Creates new template element and adds mark up
 *              and styling to the innerHTML.
 * 
 * PUBLIC FUNCTIONS:
 *              --none--
 * 
 * NOTES:       Called by sdsClock object.
 * 
 * PROBLEMS:    When future implementation by browsers for the
 *              Shadow Parts technology has been completed then
 *              one can name parts for light DOM manipulation.
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
let template = document.createElement('template');

template.innerHTML = `<div id="container">
    <canvas id="clock" width="600" height="600"></canvas>
    <canvas id="hands" width="600" height="600"></canvas>
</div>

<style type="text/css">
    :host {
        padding: 0;
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 12pt;
        box-sizing: border-box;
    }

    #container {
        position: relative;
    }

    #clock,
    #hands {
        position: absolute;
        top: 0;
        left: 0;
    }
</style>`
export default template;