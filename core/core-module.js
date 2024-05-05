//import { svgDocument } from './coil-strip-tracking-zones';
//let svg = svgDocument;
/*
    if you run the web app locally above code won't work, you'll run into CORS errors due to JavaScript module security requirements. 
    You need to do your testing through a server. we can use NPM to do that but NodeJS must be installed: commands below can help out to run a lite server.
    npm install -g live-server  // Install globally via npm.
    live-server                 // Run in the html's directory.
    npx live-server             //Next command is even shorter and without altering your packages, basically is a package executer that is used to directly execute Javascript packages without installing them
    npm start                   //Run in root directory to access your files using http://127.0.0.1:8080/coil-StripTrackingZones.html
*/

/*
//https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
fetch('https://hbinsitestoragebeta.blob.core.windows.net/assets/images/xml-vector-image.svg')
.then(res => res.text())
.then(svg => {
    const content = document.getElementById('content');
    content.innerHTML = svg
    console.log(content.querySelector('svg'))
});
// Definitely "fetch" is the way for all modern browsers to load up our file without any external third party library but that's not possible here running files locally. 
// We must host the HTML file to avoid CORS and HTTP cross origin errors related to security issues using any library or framework to serve the file on any browser!
// In order to serve a static site, a single-page web app, or a static file besides "live-server" with localhost we can also use: NextJS, ExpressJS, React, NetCore or Angular! pick your favourite.
*/

let angles = 
[
    { 
        name:'left-to-right-ZONE', 
        zones:[0,1,2,3,5,12,18,21,25,28,32,33,37,43,47,48,49,50,52,53,56,60,67,68], 
        rotate:'rotate(-20)',
        stops:[{ color: null, from:"0", to:"1" },{ color: '#e7e7e7ff', from:"0", to:"1"}]
    },
    {
        name:'right-to-left-ZONE', 
        zones:[51], 
        rotate:'rotate(-40,0,0.7)',
        stops:[{ color: '#e7e7e7ff', from: "1", to: "0"},{ color: null, from: "1", to: "0"}]
    },
    {
        name:'down-to-up-ZONE', 
        zones:[4,6,15,16,19,20,26,27,34,35,36,41,42,54,55,61,64], 
        rotate:'rotate(98,0,-0.07)',
        stops:[{ color: '#e7e7e7ff', from: "1", to: "0"},{ color: null, from: "1", to: "0"}]
    },
    {
        name:'up-to-down-ZONE', 
        zones:[9,13,14,17,22,23,24,29,30,31,38,39,40,44,45,46,57,58,59], 
        rotate:'rotate(100)',
        stops:[{ color: null, from:"0", to:"1" },{ color: '#e7e7e7ff', from:"0", to:"1"}]
    },
    {
        name:'entry-accumulator-ZONE', 
        zones:[7,8,10,11], 
        rotate:'rotate(94,0,-0.05)',
        stops:[
            { color: 'transparent', from: "1", to: "0"},
            { color: '#e7e7e7ff', from: "1", to: "0"}]
        },
        {
            name:'exit-accumulator-ZONE', 
            zones:[62,63,65,66], 
            rotate:'rotate(94,0,-0.05)',
            stops:[
                { color: 'transparent', from: "1", to: "0"},
                { color: '#e7e7e7ff', from: "1", to: "0"}
            ]
    }
];

let readyStateCheckInterval = setInterval(function() 
{
    if (document.readyState === "complete") {
        init();
        clearInterval(readyStateCheckInterval);
    }
}, 10);

let content = null;
function getElement(Id){
    if(!content) {
        content = document.getElementById('content');
        content.innerHTML = svgDocument;
    }

    return content.ownerDocument.getElementById(Id);
}

function validateAccumulators()
{
    let rangeEntry = getElement('entry-acc').value;
    let rangeExit = getElement('exit-acc').value;
    
    getElement('txtEntrySpeed').textContent = getElement('inputEntrySpeed').value;
    getElement('txtEntryAccumulator').textContent = '% Full:' + ((rangeEntry*0.010)*100);
    getElement('txtExitAccumulator').textContent = '% Full:' + ((rangeExit*0.010)*100);
    getElement('txtProcessSpeed').textContent = getElement('inputProcessSpeed').value;
    getElement('txtExitSpeed').textContent = getElement('inputExitSpeed').value;
    getElement('lblEntry').textContent = rangeEntry +'% FULL';
    getElement('lblExit').textContent = rangeExit +'% FULL';

    let entryAccumulator = [7,8,10,11];
    let exitAccumulator = [62,63,65,66];

    let entryCylinder1 = getElement('ACCST_CYLINDER1');
    let entryCylinder2 = getElement('ACCST_CYLINDER2');
    let exitCylinder1 = getElement('ACCEX_CYLINDER1');
    let exitCylinder2 = getElement('ACCEX_CYLINDER2');

    entryCylinder1.setAttribute('transform','matrix(0.55443385,-0.11843933,0.04342172,0.60818874,29.04819,'+ ((((38.391153-62.391153)/100)*rangeEntry)-38.391153).toFixed(5) +')');

    entryCylinder2.setAttribute('transform','matrix(0.55443385,-0.11843933,0.04342172,0.60818874,33.280923,'+ ((((39.09282-63.09282)/102.100)*rangeEntry)-39.09282).toFixed(5) +')');

    exitCylinder1.setAttribute('transform','matrix(0.55443385,-0.11843933,0.04342172,0.60818874,167.36786,'+ ((((54.702639-76.702639)/100)*rangeExit)-54.702639).toFixed(5) +')');

    exitCylinder2.setAttribute('transform','matrix(0.55443385,-0.11843933,0.04342172,0.60818874,171.25177,'+ ((((55.520661-77.520661)/100)*rangeExit)-55.520661).toFixed(5) +')');

    for(let x in entryAccumulator) setLinearGradient(entryAccumulator[x],1-(rangeEntry*0.01));
    for(let x in exitAccumulator) setLinearGradient(exitAccumulator[x],1-(rangeExit*0.01));
}

function init() {
    validateAccumulators();
}

function play() {
    let checkbox = getElement('allZones');
    validateAccumulators();
    if(checkbox.checked) {
        for(let x = 0; x <= 68; x++){
            setLinearGradient(x);
        }
    }
    else {
        let num = parseInt(getElement('inputZone').value);
        if(isNaN(num)) {
            alert('Value must be number type.');
            return false;
        }
        else {
            setLinearGradient(num);
        }
    }
}

function setLinearGradient(num, accumulator = null) {
    let angle = angles.find(e => e.zones.some(p => p == num));
    let zone = getElement('ZONE' + num);
    let combobox = getElement('batch-color');

    if(zone) {
        let linearGradient = getElement(angle.name + num);
        if(linearGradient == null || linearGradient == undefined) {
            let newLGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            newLGradient.setAttribute('id', angle.name + num);
            newLGradient.setAttribute('gradientTransform', angle.rotate);

            for(let x in angle.stops) {
                let stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                stop.setAttribute('offset', (accumulator!=null && angle.stops[x].color == 'transparent')?accumulator:0);
                stop.setAttribute('stop-color', (angle.stops[x].color == null)? combobox.value : angle.stops[x].color);
                if(accumulator==null) {
                    let animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                    animate.setAttribute('dur', '1s');
                    animate.setAttribute('attributeName', 'offset');
                    animate.setAttribute('fill', 'freeze');
                    animate.setAttribute('from', angle.stops[x].from);
                    animate.setAttribute('to', angle.stops[x].to);
                    animate.setAttribute('begin','indefinite');
                    stop.appendChild(animate);
                }
                newLGradient.appendChild(stop);
            }
            getElement('DataExchangeFormats').appendChild(newLGradient);
        }

        zone.style.fill = 'url(#'+ angle.name + num +')';
        let item = getElement(angle.name + num);
        for(let x in item.children) {
            if(item.children[x].tagName=='stop') {
                let color = item.children[x].getAttribute('stop-color');
                if(accumulator!=null && angle.stops[x].color == 'transparent') {
                    item.children[x].setAttribute('offset',accumulator);
                }

                if(item.children[x].hasChildNodes()) {
                    item.children[x].setAttribute('stop-color',(color !='#e7e7e7ff')? combobox.value : color);
                    for(let a in item.children[x].children) {
                        if(typeof item.children[x].children[a] == 'object') {
                            item.children[x].children[a].beginElement();
                        }
                    }
                }
                else if(accumulator==null) {
                    item.children[x].setAttribute('stop-color',(color !='transparent')?combobox.value: color);
                }
            }
        }
    }
    else {
        alert('Zone does not exists.');
    }
}
