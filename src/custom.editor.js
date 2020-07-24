/**
 * Updates the properties panel
 */
function selectionChanged(graph, mxUtils, mxEvent) {
    var div = document.getElementById('properties');

    // Forces focusout in IE
    graph.container.focus();

    // Clears the DIV the non-DOM way
    div.innerHTML = '';

    // Gets the selection cell
    var cell = graph.getSelectionCell();
    var center = document.createElement('center');
    if (cell == null || cell.edge) {
        mxUtils.writeln(center, 'Select an Item to Edit.');
        div.appendChild(center);
    }
    else {
        // Writes the title
        mxUtils.writeln(center, cell.value.nodeName + ' (' + cell.id + ')');
        div.appendChild(center);
        mxUtils.br(div);

        // Creates the form from the attributes of the user object
        var form = new mxForm();

        var attrs = cell.value.children[0].getAttributeNames();

        for (var i = 0; i < attrs.length; i++) {
            if (attrs[i] === "Type") {
                createComboBox(graph, form, cell, attrs[i], mxEvent);
            } else {
                createTextField(graph, form, cell, attrs[i], mxEvent);
            }
        }

        div.appendChild(form.getTable());
        mxUtils.br(div);
    }
}

/**
 * Creates the textfield for the given property.
 */
function createTextField(graph, form, parent, attrName, mxEvent) {
    var cell = parent.value.children[0];
    var input = form.addText(attrName + ':', cell.getAttributeNode(attrName).value);
    var applyHandler = function () {
        var newValue = input.value || '';
        var oldValue = cell.getAttribute(attrName, '');

        if (newValue != oldValue) {
            graph.getModel().beginUpdate();

            try {
                var edit = new mxCellAttributeChange(
                    cell, attrName,
                    newValue);
                graph.getModel().execute(edit);
                // seems broken
                setLabel(mxUtils, parent);
                graph.refresh(parent);
            }
            finally {
                graph.getModel().endUpdate();
            }
        }
    };

    mxEvent.addListener(input, 'keypress', function (evt) {
        // Needs to take shift into account for textareas
        if (evt.keyCode == /*enter*/13 &&
            !mxEvent.isShiftDown(evt)) {
            input.blur();
        }
    });

    if (mxClient.IS_IE) {
        mxEvent.addListener(input, 'focusout', applyHandler);
    }
    else {
        // Note: Known problem is the blurring of fields in
        // Firefox by changing the selection, in which case
        // no event is fired in FF and the change is lost.
        // As a workaround you should use a local variable
        // that stores the focused field and invoke blur
        // explicitely where we do the graph.focus above.
        mxEvent.addListener(input, 'blur', applyHandler);
    }
}

/**
 * Creates the combofield for the given property.
 */
function createComboBox(graph, form, parent, attrName, mxEvent) {
    var cell = parent.value.children[0];
    var input = form.addCombo(attrName, false, 1);
    form.addOption(input, "ARO", "ARO", ("ARO" === cell.getAttributeNode(attrName).value));
    form.addOption(input, "PRO", "PRO", ("PRO" === cell.getAttributeNode(attrName).value));
    form.addOption(input, "SRO", "SRO", ("SRO" === cell.getAttributeNode(attrName).value));

    var applyHandler = function () {
        var newValue = input.value || '';
        var oldValue = cell.getAttribute(attrName, '');

        if (newValue != oldValue) {
            graph.getModel().beginUpdate();

            try {
                var edit = new mxCellAttributeChange(
                    cell, attrName,
                    newValue);
                graph.getModel().execute(edit);
                setLabel(mxUtils, parent);
                graph.refresh(parent);
            }
            finally {
                graph.getModel().endUpdate();
            }
        }
    };

    mxEvent.addListener(input, 'change', function (evt) {
        // #MKTO: seems they blur the input to fake grafical change, and thus enforce an update.
            input.blur();
    });

    if (mxClient.IS_IE) {
        mxEvent.addListener(input, 'focusout', applyHandler);
    }
    else {
        // Note: Known problem is the blurring of fields in
        // Firefox by changing the selection, in which case
        // no event is fired in FF and the change is lost.
        // As a workaround you should use a local variable
        // that stores the focused field and invoke blur
        // explicitely where we do the graph.focus above.
        mxEvent.addListener(input, 'blur', applyHandler);
    }
}
/*
 ** Overrides method to provide a cell label in the display
 */
function setLabelFunction(graph, mxUtils) {
    graph.convertValueToString = function(cell) {
        return setLabel(mxUtils, cell);
    };
}

function setLabel(mxUtils, cell) {
    if (mxUtils.isNode(cell.value)) {
        if (cell.value.nodeName.toLowerCase() == 'complexnode') {
            var type = cell.value.children[0].getAttribute("Type", "");
            var name = cell.value.children[0].getAttribute("Name", "");
            var repeated = cell.value.children[0].getAttribute("Repeat", "");
            return type.concat(": ", name, " (", 0 , "/",repeated, ")");
        } else if (cell.value.nodeName.toLowerCase() == 'singlenode') {
            return cell.value.children[0].getAttribute("Name");
        }
    }
    return '';
}

function setSwimlaneStyle(graph, previous) {
    graph.model.getStyle = function (cell) {
        if (cell != null) {
            if (graph.model.isVertex(cell)) {
                var style = previous.apply(this, arguments);
                switch (cell.value.children[0].getAttribute("Type").substr(0,3)) {
                    case "SRO":
                        style += ';fillColor=#2d7d9a';
                        break;
                    case "PRO":
                        style += ';fillColor=#744da9';
                        break;
                    case "ARO":
                        style += ';fillColor=#68768a';
                        break;
                    default:
                        break;
                }
            }
            return style;
        }
        return null;
    };
}

