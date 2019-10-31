/* eslint-disable no-loop-func */
var setAttributes = (element, attributes) => {
    var keys = Object.keys(attributes);  
    for (var i=0; i < keys.length; i++) {
        //console.log(`${keys[i]}: ${attributes[keys[i]]}`);
        element.setAttribute(keys[i], attributes[keys[i]]);
    }
}

var checkOptions = (options, fallbacks) => {
    var keys = Object.keys(fallbacks);
    if (!options)
        options = {};
    for (var i=0; i < keys.length; i++) {
        if(!options[keys[i]])
            options[keys[i]] = fallbacks[keys[i]];      
    }

    return options;
}

export var pieChart = (chartId, chartData, optionsToValidate) => {
    var { columns, data } = chartData;
    const w3SvgUrl = 'http://www.w3.org/2000/svg';

    var optionFallbacks = {
        width: 400,
        height: 300,
        valueSuffix: '',
        colors: ['steelblue', 'grey', 'yellow', 'pink', 'red'],
        opacity: 1
    }

    var options = checkOptions(optionsToValidate, optionFallbacks);

    var { width, height, valueSuffix, colors, opacity } = options;
    // Get chart DIV
    var chart = document.getElementById(chartId);
    chart.style = `       
    position: relative;
    width: ${width}px; 
    height: ${height}px; 
    //border: 1px solid black;
    `;

    // Create svg area
    var svg = document.createElementNS(w3SvgUrl, 'svg');
    setAttributes(svg, {
        'width': width,
        'height': height,
        'viewBox': `0 0 ${width} ${height}`
    })
    chart.appendChild(svg);
    
    // Draw Legend
    var legend = document.createElement('div');
    legend.style = `
        position: absolute;
        top: 0px;
        right: 0px;
    `;
    chart.appendChild(legend);

    for ( let i = 0; i < columns.length; i++) {
        console.log(columns[i])
        var listValue = document.createElement('li');
        listValue.style = `
            list-style-type: none;
        `
        legend.appendChild(listValue);
        
        var dot = document.createElement('span');
        dot.style = `
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: ${colors[i]};
        `
        listValue.appendChild(dot);
        listValue.innerHTML += ` ${columns[i]}`;

    }
    
    // Draw slices
    const posX = width * 0.35;
    const posY = width * 0.25;
    const radius = width * 0.12;
    const circumference = 2 * Math.PI * radius;
    var dataSum = data.reduce((a, b) => a + b, 0);
    var rotate = -90; 
    for( let i = 0; i < data.length; i++) {

        var slice = document.createElementNS(w3SvgUrl, 'circle');
        setAttributes(slice, {
            'class': `${chartId}-slice`,
            'r': radius,
            'cx': posX,
            'cy': posY,
            'fill': 'transparent',
            'stroke': colors[i],
            'stroke-width': 1 * (radius * 2),
            'stroke-dasharray': `0 ${circumference}`,
            'transform': `rotate(${rotate} ${posX} ${posY})`,
            'opacity': opacity,
            'style': '-moz-transition: all 0.5s ease; -webkit-transition: all 0.5s ease; transition: all 0.5s ease;'

        })
        svg.appendChild(slice);

        rotate += 360 * (data[i] / dataSum);
    }

    // Animate slices
    var slices = document.getElementsByClassName(`${chartId}-slice`);
    var valueLabel;
    for (let i = 0; i < slices.length; i++) {
        // Animate bars on load
        requestAnimationFrame(() =>
        setTimeout(() => {
                let sliceSize = data[i] / dataSum * 100;
                let sliceAnglePercent = sliceSize * circumference / 100
                slices[i].setAttribute('stroke-dasharray', `${sliceAnglePercent} ${circumference}`)
            })
        );
       
        slices[i].addEventListener('mouseover', (shape) => {
            shape.target.setAttribute('opacity', 0.7)
            valueLabel = document.createElement('div');
            valueLabel.style = `
            position: absolute;
            background-color: white;
            border: 1px solid grey;
            border-radius: 10px;
            padding: 10px;
            color: grey;
            font-size: 0.8em;
            font-weight: bold;
            left: calc(${shape.offsetX}px + 20px);
            top: calc(${shape.offsetY}px + -50px);
            `;

            valueLabel.innerHTML = `${columns[i]}: ${data[i]} ${valueSuffix}`;
            chart.appendChild(valueLabel);     

        }, true);
        slices[i].addEventListener('mouseout', (shape) => {
            shape.target.setAttribute('opacity', opacity)
            chart.removeChild(valueLabel);

        }, true);
    }

}




