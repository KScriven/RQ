// demo.js

// This is used by demo.html to demonstrate rq.js. It include a widget function
// that represents a service requestory, a show function that is a callback
// that displays the final result, and an RQ program written as an annotated
// nested array.

/*jslint browser */

/*property
    addEventListener, appendChild, backgroundColor, createElement,
    createTextNode, fallback, getElementById, parallel, race, sequence,
    stringify, style, type, value
*/

import RQ from "./rq.js";

function widget(name) {
    'use strict';
    return function requestor(callback, value) {
        var result = value
            ? value + '>' + name
            : name;
        var demo = document.getElementById("demo");
        var fieldset = document.createElement("fieldset");
        var legend = document.createElement("legend");
        var success = document.createElement("input");
        var failure = document.createElement("input");
        fieldset.appendChild(legend);
        fieldset.appendChild(success);
        fieldset.appendChild(failure);
        legend.appendChild(document.createTextNode(name));
        success.type = "button";
        success.value = "success";
        success.addEventListener("click", function () {
            fieldset.style.backgroundColor = "lightgreen";
            return callback(result);
        }, false);
        failure.type = "button";
        failure.value = "failure";
        failure.addEventListener("click", function () {
            fieldset.style.backgroundColor = "pink";
            return callback(undefined, result);
        }, false);
        demo.appendChild(fieldset);
        return function cancel() {
            fieldset.style.backgroundColor = "darkgray";
        };
    };
}

function show(success, failure) {
    'use strict';
    var result;
    var title;
    var color;
    var demo = document.getElementById("demo");
    var fieldset = document.createElement("fieldset");
    var legend = document.createElement("legend");
    if (failure === undefined) {
        result = JSON.stringify(success);
        title = "success";
        color = "lightgreen";
    } else {
        result = JSON.stringify(failure);
        title = "failure";
        color = "pink";
    }
    fieldset.appendChild(legend);
    legend.appendChild(document.createTextNode(title));
    fieldset.appendChild(document.createTextNode(result));
    fieldset.style.backgroundColor = color;
    legend.style.backgroundColor = color;
    demo.appendChild(fieldset);
}

RQ.parallel([
    RQ.sequence([
        widget("Seq A1"),
        widget("Seq A2"),
        widget("Seq A3")
    ]),
    RQ.sequence([
        widget("Seq B1"),
        widget("Seq B2"),
        widget("Seq B3")
    ]),
    widget("C"),
    RQ.race([
        widget("Race D1"),
        widget("Race D2"),
        widget("Race D3")
    ]),
    RQ.fallback([
        widget("Fall E1"),
        widget("Fall E2"),
        widget("Fall E3")
    ])
], [
    RQ.sequence([
        widget("Opt Seq O1"),
        widget("Opt Seq O2"),
        widget("Opt Seq O3")
    ]),
    RQ.sequence([
        widget("Opt Seq P1"),
        widget("Opt Seq P2"),
        widget("Opt Seq P3")
    ]),
    widget("Opt Q"),
    RQ.race([
        widget("Opt Race R1"),
        widget("Opt Race R2"),
        widget("Opt Race R3")
    ]),
    RQ.fallback([
        widget("Opt Fall S1"),
        widget("Opt Fall S2"),
        widget("Opt Fall S3")
    ])
])(show);
