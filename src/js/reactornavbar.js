/* eslint-disable no-loop-func */
import { TimelineMax } from 'gsap/TweenMax';

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

export var floatingNavbar = (chartId, optionsToValidate) => {
    var optionFallbacks = {
        width: 1000,
        height: 100
    }

    var options = checkOptions(optionsToValidate, optionFallbacks);
    var { width, height } = options;

    var navbar = document.getElementById('myNavbar');
        const w3SvgUrl = 'http://www.w3.org/2000/svg';

    // Create svg area
    var svg = document.createElementNS(w3SvgUrl, 'svg');
    setAttributes(svg, {
        'preserveAspectRatio': 'xMidYMid',
        'width': 'auto',
        'height': '50',
        'viewBox': `0 0 ${width} ${height}`,
        'style': 'margin-top: 10px;'
    })
    navbar.appendChild(svg);

    const radius = height / 2;
    const posX = width - radius * 2;
    const posY = height / 2;
    var menuCircle = document.createElementNS(w3SvgUrl, 'circle');
    setAttributes(menuCircle, {
        'class': `${chartId}-circle`,
        'r': radius,
        'cx': posX,
        'cy': posY,
        'fill': 'steelblue',
        'stroke': 'white',
        'stroke-width': 5

    })
    
    var line = document.createElementNS(w3SvgUrl, 'line');
    setAttributes(line, {
        'id': `${chartId}-line`,
        'x1': posX,
        'y1': posY,
        'x2': posX,
        'y2': posY,
        'stroke-linecap': 'round',
        'stroke': 'steelblue',
        'stroke-width': 10
    })

    svg.appendChild(line)
    svg.appendChild(menuCircle);

    menuCircle.addEventListener('click', () => {
        var tl = new TimelineMax({repeat:0});
        tl.to(menuCircle, 0.2, {
            attr: {
                'r': '5'
            }
        })
        .to(line, 0.2, {
            attr: {
                'x2': 50,
            }
        })
        .to(menuCircle, 0.2, {
            attr: {
                'cx': 50
            }
        }, 0.2)        
        .to(menuCircle, 0.2, {
            attr: {
                'r': radius
            }
        })
        .to(line, 0.2, {
            attr: {
                'stroke-width': radius * 2 * 0.8,
                'stroke': 'grey'
            }
        }, 0.4);




    }, true);



}

