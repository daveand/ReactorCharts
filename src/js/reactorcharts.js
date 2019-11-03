/* eslint-disable no-loop-func */
import { TweenMax } from 'gsap/TweenMax';

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

export var doughnutChart = (chartId, chartData, optionsToValidate) => {
    var { columns, data } = chartData;
    const w3SvgUrl = 'http://www.w3.org/2000/svg';

    var optionFallbacks = {
        width: 600,
        height: 400,
        valueSuffix: '',
        colors: ['steelblue', 'grey', 'yellow', 'pink', 'red', 'orange'],
        opacity: 1
    }

    var options = checkOptions(optionsToValidate, optionFallbacks);

    var { width, height, valueSuffix, colors, opacity } = options;
    // Get chart DIV
    var chart = document.getElementById(chartId);
    chart.style = `
    display: flex;       
    position: relative;
    height: auto; 
    //border: 1px solid black;
    `;

    // Create svg area
    var svg = document.createElementNS(w3SvgUrl, 'svg');
    setAttributes(svg, {
        'preserveAspectRatio': 'xMidYMin meet',
        'width': width,
        'height': 'auto',
        'viewBox': `0 0 ${width} ${height}`
    })
    chart.appendChild(svg);
    
    // Draw Legend
    var legendGroup = document.createElementNS(w3SvgUrl, 'g');
    svg.appendChild(legendGroup);
    var legendListStep = 20;
    for ( let i = 0; i < columns.length; i++) {
        console.log(columns[i])

        var legendCircle = document.createElementNS(w3SvgUrl, 'circle');
        setAttributes(legendCircle, {
            'class': `${chartId}-circle`,
            'r': 4,
            'cx': width - 110,
            'cy': legendListStep - 5,
            'fill': colors[i],  
        })
        var legendText = document.createElementNS(w3SvgUrl, 'text');
        legendText.innerHTML = columns[i];
        setAttributes(legendText, {
            'x': width - 100,
            'y': legendListStep,
            'fill': 'grey',
            'style': `font-size: 14px;`
        })



        legendGroup.appendChild(legendCircle);
        legendGroup.appendChild(legendText);
        legendListStep += 20;

        // var listValue = document.createElement('li');
        // listValue.style = `
        //     list-style-type: none;
        //     font-size: 14px;
        // `
        // legend.appendChild(listValue);
        
        // var dot = document.createElement('span');
        // dot.style = `
        // display: inline-block;
        // width: 10px;
        // height: 10px;
        // border-radius: 50%;
        // background-color: ${colors[i]};
        // `

        // var text = document.createElement('span');
        // text.style = `
        // margin-left: 10px;
        // display: inline-block;
        // color: grey;
        // `
        // text.innerHTML += ` ${columns[i]}`;

        // listValue.appendChild(dot);
        // listValue.appendChild(text);
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
            'stroke-width': 0,
            'stroke-dasharray': `0 ${circumference}`,
            'transform': `rotate(${rotate} ${posX} ${posY})`,
            'opacity': opacity

        })
        svg.appendChild(slice);

        rotate += 360 * (data[i] / dataSum);
    }

    var circle = document.createElementNS(w3SvgUrl, 'circle');
    setAttributes(circle, {
        'class': `${chartId}-circle`,
        'r': 50,
        'cx': posX,
        'cy': posY,
        'fill': 'white',

    })
    svg.appendChild(circle);


    // Animate slices
    var slices = document.getElementsByClassName(`${chartId}-slice`);
    var valueLabel;
    for (let i = 0; i < slices.length; i++) {
        
        // Animate bars on load 
        let sliceSize = data[i] / dataSum * 100;
        let sliceAnglePercent = sliceSize * circumference / 100
        TweenMax.to(slices[i], 0.7, {
            attr: {
                'stroke-dasharray': `${sliceAnglePercent} ${circumference}`,
                'stroke-width': 1 * (radius * 2)
            }
        })
       
        slices[i].addEventListener('mouseover', (shape) => {
            TweenMax.to(slices[i], 0.3, {
                    'opacity': 0.6               
            })

            let labelPosX = shape.offsetX + 20
            let labelPosY = shape.offsetY - 50
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
            left: ${labelPosX}px;
            top: ${labelPosY}px;
            `;

            valueLabel.innerHTML = `${columns[i]}: ${data[i]} ${valueSuffix}`;
            chart.appendChild(valueLabel);     

        }, true);
        slices[i].addEventListener('mouseout', (shape) => {
            TweenMax.to(slices[i], 0.3, {
                'opacity': opacity               
            })

            //shape.target.setAttribute('opacity', opacity)
            chart.removeChild(valueLabel);

        }, true);
    }

}

export var lineChart = (chartId, chartData, optionsToValidate) => {
    var { columns, data } = chartData;
    const w3SvgUrl = 'http://www.w3.org/2000/svg';
    console.log(columns, data)
    var optionFallbacks = {
        width: 600,
        height: 400,
        valueSuffix: '',
        colors: ['steelblue', 'grey', 'yellow', 'pink', 'red'],
        opacity: 1,
        scaleResolution: 50
    }

    var options = checkOptions(optionsToValidate, optionFallbacks);
    var { width, height, valueSuffix, opacity, scale, median, scaleResolution } = options;

    // Get chart DIV
    var chart = document.getElementById(chartId);
    chart.style = `
    display: flex;       
    position: relative;
    height: auto; 
    //border: 1px solid black;
    `;

    // Draw scale
    var scaleRange;
    var scalePosition = 0;
    var dataRange = [];
    if (scale != null) {
        scaleRange = scale.high - scale.low;
        scalePosition = scale.low;
    }
    else {
        for (var i = 0; i < data.length; i++) {
            dataRange.push(data[i][1]);
        }
        //var min = Math.min(...data);
        var max = Math.max(...dataRange);
        scaleRange = max;
        scale = { low: 0, high: max};
        console.log('scaleRange', scaleRange);
    }
    var scaleRangeAdjusted = (Math.ceil( scaleRange / 100 ) * 100);
    var scaleStepsPercent = scaleResolution / scaleRangeAdjusted;
    var scaleSteps = scaleStepsPercent * scaleRangeAdjusted;
    var numberOfSteps = scaleRangeAdjusted / scaleSteps;

    console.log('scaleRangeAdjusted', scaleRangeAdjusted)
    console.log('scaleStepsPercent', scaleStepsPercent);
    console.log('scaleSteps', scaleSteps)
    console.log('numberOfSteps', numberOfSteps);

    // Create svg area
    var svg = document.createElementNS(w3SvgUrl, 'svg');
    setAttributes(svg, {
        'preserveAspectRatio': 'xMidYMin meet',
        'width': width,
        'height': 'auto',
        'viewBox': `0 -${scale.low} ${width} ${height}`
    })
    chart.appendChild(svg);
   
    
    // Create scale group
    var scaleGroup = document.createElementNS(w3SvgUrl, 'g');
    var drawScale = () => {
        svg.appendChild(scaleGroup);

        var scaleStart = scale.low;
        for (let i = 0; i < numberOfSteps; i++) {
            var scaleStepLine = document.createElementNS(w3SvgUrl, 'line');
            setAttributes(scaleStepLine, {
                'id': `${chartId}-scaleline${i}`,
                'x1': 0,
                'y1': height - scaleStart,
                'x2': width,
                'y2': height - scaleStart,
                'style': `stroke: lightgrey; stroke-width: 1`
            })
            var scaleStepText = document.createElementNS(w3SvgUrl, 'text');
            setAttributes(scaleStepText, {
                'id': `${chartId}-scaletext${i}`,
                'x': 0,
                'y': height - scaleStart - 4,
                'fill': 'grey',
                'style': `font-size: 14px;`
            })
            scaleStepText.innerHTML = Math.round(scalePosition);
    
            scaleGroup.appendChild(scaleStepLine);
            scaleGroup.appendChild(scaleStepText);
        
            scalePosition += scaleSteps;
            scaleStart += height / numberOfSteps;     
        }
        scalePosition = 0;
        scaleStart = 0;  
    }
    drawScale();

    var pointPosition = 50;
    var startLinePath = `M${pointPosition} ${height}`
    var linePath = `M${pointPosition} ${height - ( data[0][1] / scaleRangeAdjusted ) * height }`;
    var drawPath = () => {
        // Create linepath
        for( let i = 0; i < data.length; i++) {
            //console.log(data[i])
            var pointValue = height - ( data[i][1] / scaleRangeAdjusted ) * height ;
            //console.log(pointValue)
            startLinePath += ` L${pointPosition} ${height}`
            linePath += ` L${pointPosition} ${pointValue}`
    
            var point = document.createElementNS(w3SvgUrl, 'circle');
            setAttributes(point, {
                'id': `${chartId}-point${i}`,
                'class': `${chartId}-point`,
                'r': 0,
                'cx': pointPosition,
                'cy': pointValue,
                'fill': 'steelblue',
                'stroke': 'transparent',
                'stroke-width': 15,
                'style': '-moz-transition: all 1.5s ease; -webkit-transition: all 1.5s ease; transition: all 1.5s ease;',
            })
            svg.appendChild(point);
    
    
            pointPosition += (width - 50) / data.length;
        }
        pointPosition = 50;
    }
    drawPath();

    var line = document.createElementNS(w3SvgUrl, 'path');
    var drawLine = () => {
        setAttributes(line, {
            'class': `${chartId}-line`,
            'id': `${chartId}-line`,
            'stroke': 'steelblue',
            'stroke-width': 2,
            'fill': 'transparent',
            'opacity': opacity,
            'd': startLinePath
            
        })
        svg.appendChild(line);
        
        TweenMax.to(line, 0.8, {
            attr: {
                'd': linePath
            }
        });

        linePath = `M${pointPosition} ${height - ( data[0][1] / scaleRangeAdjusted ) * height }`;
    }
    drawLine();

    var medianLine = document.createElementNS(w3SvgUrl, 'line');
    var medianText = document.createElementNS(w3SvgUrl, 'text');
    var drawMedian = () => {
        var dataSum = 0;
        for (let i = 0; i < data.length; i++) {
            dataSum = dataSum + data[i][1];
        }
        let medianTextValue = dataSum / data.length
        let medianValue = medianTextValue / scaleRangeAdjusted * height ;
        let startX = 25;
        setAttributes(medianLine, {
            'id': `${chartId}-medianline${i}`,
            'x1': startX,
            'y1': height - medianValue,
            'x2': width - startX,
            'y2': height - medianValue,
            'style': `stroke: green; stroke-width: 1`
        })
        setAttributes(medianText, {
            'id': `${chartId}-scaletext${i}`,
            'x': startX,
            'y': height - medianValue - 4,
            'fill': 'grey',
            'style': `font-size: 14px;`
        })
        medianText.innerHTML = Math.round(medianTextValue);

        svg.appendChild(medianLine);
        svg.appendChild(medianText);
        medianValue = 0;

    }

    if (median)
        drawMedian();

    var animatePoints = () => {
        // Animate points
        var points = document.getElementsByClassName(`${chartId}-point`);
        var valueLabel;
        for (let i = 0; i < points.length; i++) {
            TweenMax.to(points[i], 1, {
                attr: {
                    'r': 4
                }
            });
            
            points[i].addEventListener('mouseover', (shape) => {
                TweenMax.to(points[i], 0.3, {
                    attr: {
                        'opacity': 0.6,
                        'r': 6
                    }
                });
                TweenMax.to(line, 0.3, {
                    attr: {
                        'opacity': 0.6,
                    }
                });
    
                let labelPosX = shape.offsetX + 20
                let labelPosY = shape.offsetY - 50
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
                left: ${labelPosX}px;
                top: ${labelPosY}px;
                `;
    
                valueLabel.innerHTML = `${data[i][0]}: ${data[i][1]} ${valueSuffix}`;
                chart.appendChild(valueLabel);     
    
            }, true);
            points[i].addEventListener('mouseout', (shape) => {
                TweenMax.to(points[i], 0.3, {
                    attr: {
                        'opacity': opacity,
                        'r': 4
                    }
                });
                TweenMax.to(line, 0.3, {
                    attr: {
                        'opacity': opacity,
                    }
                });
                chart.removeChild(valueLabel);
    
            }, true);
        }
    }
    animatePoints();

    // Detect scroll and disable browser scrolling
    var scrollValue = 0;
    svg.addEventListener('wheel', (scroll) => {
        var body = document.getElementsByTagName('body');
        //console.log(body);
        body[0].style = `
            overflow: hidden;
        `
        scrollValue = scroll.deltaY / 10 * 5;
        
        for (let i = 0; i < numberOfSteps; i++) {
            let line = document.getElementById(`${chartId}-scaleline${i}`);
            let text = document.getElementById(`${chartId}-scaletext${i}`);
            scaleGroup.removeChild(line);
            scaleGroup.removeChild(text);
        }
        for (let i = 0; i < data.length; i++) {
            let point = document.getElementById(`${chartId}-point${i}`);
            svg.removeChild(point)
        }
        
        svg.removeChild(line);

        if(median) {
            svg.removeChild(medianLine);
            svg.removeChild(medianText);
        }

        
        scaleRangeAdjusted += scrollValue;
        scaleStepsPercent = scaleResolution / scaleRangeAdjusted;
        scaleSteps = scaleStepsPercent * scaleRangeAdjusted;
        numberOfSteps = scaleRangeAdjusted / scaleSteps;
        
        console.log(scaleRangeAdjusted, numberOfSteps)
        drawScale();
        drawPath();
        drawLine();
        animatePoints();
        if(median)
            drawMedian();
            
    
    }, true);
    svg.addEventListener('mouseout', (scroll) => {
        var body = document.getElementsByTagName('body');
        //console.log(body);
        body[0].style = ``
        //console.log(scroll)
    }, true);
    
}



