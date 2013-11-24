module G2W {
    /*
     * Guide 2 Wiki starting method.
     */
    export function start() {
        try {
            G2W.Data.resetData();
            G2W.Utils.closeAlertBox();
            G2W.Utils.getById("result").value = "";

            var source = G2W.Utils.getById("source"),
                data = G2W.Converter.getConverter().start(source.value);

            G2W.nextDialog();
        } catch (e) {
            console.log("ERROR: " + e.message);
            G2W.Utils.showAlertBox("danger");
        }
    }

    export function nextDialog() {
        try {
            var totalDialogs = G2W.CustomDialogs.getQueue().queue.length;
            if (totalDialogs > 0) {
                var action = G2W.Utils.getById("cm-action");
                if (totalDialogs == 1) {
                    action.innerText = "Finish";
                } else {
                    action.innerText = "Next >";
                }

                G2W.CustomDialogs.next().open();
            } else {
                $('#customModal').modal('hide');
                G2W.finish();
            }
        } catch (e) {
            console.log("ERROR: " + e.message);
            G2W.Utils.showAlertBox("danger");
        }
    }

    export function finish() {
        try {
            var result = G2W.Utils.getById("result"),
                wiki = G2W.Exporter.getExporter().start(G2W.Data.getData());

            result.value = wiki;

            G2W.Utils.showAlertBox();
            G2W.Utils.getById("source").value = "";
        } catch (e) {
            console.log("ERROR: " + e.message);
            G2W.Utils.showAlertBox("danger");
        }
    }
}

function append(source, target) {
    return source += target + "\n";
}

function appendReplaced(source: string, replace: string, keyVal: any[]) {
    for (var i = 0; i < keyVal.length; i += 2) {
        replace = replace.replace(keyVal[i], keyVal[i + 1].toString());
    }
    return append(source, replace);
}
