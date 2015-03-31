// Cria subpágina de acordeón.

accordion = function(pagePrefix, prefix, numButtons) {

    dialogFunction = function(pagePrefix, prefix, i) {
        return function(event, ui) {
            console.log("Opening dialog " + pagePrefix + "-" + i + ".html...");
            $("#contents-" + e(prefix + "." + i)).load(pagePrefix + "-" + i + ".html", function() {
                populateElements($("#contents-" + e(prefix + "." + i)));
            });
        }
    };

    radioFunction = function(prefix, i) {
        return function(event) {
            console.log("#dialog-" + e(prefix + "." + i));
            $("#dialog-" + e(prefix + "." + i)).dialog("open");
        }
    };

    $("#radioset-" + e(prefix)).buttonset();
    console.log("accordion() called: #radioset-" + e(prefix));

    for (i = 1; i <= numButtons; ++i) {
        console.log("accordion() called: #dialog-" + e(prefix + "." + i) + ", " + i);
        $("#dialog-" + e(prefix + "." + i)).dialog({
            modal: true,
            position: { my: "center top", at: "center top" },
            autoOpen: false,
            width: 850,
            height: 700,
            open: dialogFunction(pagePrefix, prefix, i)
        });

        $("#radio-" + e(prefix + "." + i)).on("click", radioFunction(prefix, i));
    }
}
