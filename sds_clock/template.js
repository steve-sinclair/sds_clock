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