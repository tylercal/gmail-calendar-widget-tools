/* global console, MutationObserver */

(function() {
    "use strict";

    var tryCount = 0;
    var calendarTryCount = 0;
    var widget;

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function () {
            tryAgain() && resize('remote_iframe_0', '512px'); // jshint ignore:line
        });
    });

    var divObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function () {
            resize('viewContainer1', '497px');
            resize('agendaEventContainer1', '497px');
        });
    });

    function tryAgain() {
        var spanTags = widget.getElementsByTagName("span");
        for (var i = 0; i < spanTags.length; i++) {
            if (spanTags[i].textContent === "Try again") {
                //console.log("trying to load calendar again");
                spanTags[i].click();
                return false;
            }
        }
        return true;
    }

    function resize(elementId, size) {
        var calendarFrame = document.getElementById(elementId);
        if (calendarFrame !== null && calendarFrame.style.height !== size) {
            calendarFrame.style.height = size;
            //console.log("calendar resized "+elementId+" to "+size);
            return false;
        }
        return true;
    }

    function findCalendarWidget() {
        var headerTags = document.getElementsByTagName("h2");
        for (var i = 0; i < headerTags.length; i++) {
            if (headerTags[i].textContent === "Google Calendar") {
                return headerTags[i].parentNode.parentNode.parentNode;
            }
        }
        return null;
    }

    function findCalendarContainer() {
        var headerTags = document.getElementsByTagName("h2");
        for (var i = 0; i < headerTags.length; i++) {
            if (headerTags[i].textContent === "Google Calendar") {
                return headerTags[i].parentNode.parentNode.parentNode;
            }
        }
        return null;
    }

    function watch() {
        if (window.self !== window.top && document.location.host === 'mail.google.com') {
            return; // only run on main gmail frame
        }

        tryCount++;
        widget = findCalendarWidget();

        if (widget !== null) {
            resize('remote_iframe_0', '512px');
            //noinspection JSCheckFunctionSignatures
            observer.observe(widget, {attributes: true, childList: true, subtree: true});
        } else if (tryCount > 12) {
            console.log("Was not able to find calendar widget after a minute");
        } else {
            setTimeout(watch, 5000);
        }
    }

    function watchFrame() {
        if (window.self === window.top || document.location.host !== 'calendar.google.com') {
            return; // only run on main calendar widget frame
        }

        calendarTryCount++;
        var div = document.getElementById("agendaEventContainer1");

        if (div !== null) {
            resize('agendaEventContainer1', '497px');
            resize('viewContainer1', '497px');
            //noinspection JSCheckFunctionSignatures
            divObserver.observe(div, {attributes: true, childList: true, subtree: true});
        } else if (tryCount > 12) {
            console.log("Was not able to find calendar div after a minute");
        } else {
            setTimeout(watchFrame, 5000);
        }
    }

    watch();
    watchFrame();
})();