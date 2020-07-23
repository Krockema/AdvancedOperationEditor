/**
 * Updates the properties panel
 */
function selectionChanged(graph, mxUtils) {
    var div = document.getElementById('properties');

    // Forces focusout in IE
    graph.container.focus();

    // Clears the DIV the non-DOM way
    div.innerHTML = '';

    // Gets the selection cell
    var cell = graph.getSelectionCell();

    if (cell == null || cell.edge) {
        var center = document.createElement('center');
        mxUtils.writeln(center, 'Select an Item to Edit.');
        div.appendChild(center);
    }
    else {
        // Writes the title
        var center = document.createElement('center');
        mxUtils.writeln(center, cell.value.nodeName + ' (' + cell.id + ')');
        div.appendChild(center);
        mxUtils.br(div);

        // Creates the form from the attributes of the user object
        var form = new mxForm();

        var attrs = cell.value.children[0].getAttributeNames();

        for (var i = 0; i < attrs.length; i++) {
            createTextField(graph, form, cell.value.children[0], attrs[i]);
        }

        div.appendChild(form.getTable());
        mxUtils.br(div);
    }
}

/**
 * Creates the textfield for the given property.
 */
function createTextField(graph, form, cell, attrName) {
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
                graph.updateCellSize(cell);
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
/*
 ** Overrides method to provide a cell label in the display
 */
function setLableFunction(graph, mxUtils) {
    graph.convertValueToString = function(cell) {
        if (mxUtils.isNode(cell.value)) {
            if (cell.value.nodeName.toLowerCase() == 'complexnode') {
                var type = cell.value.children[0].getAttribute("Type", "");
                var repeated = cell.value.children[0].getAttribute("Repeat", "");
                return type + ' (0/' + repeated + ')';
            } else if (cell.value.nodeName.toLowerCase() == 'singlenode') {
                return cell.value.children[0].getAttribute("Name");
            }
        }
        return '';
    };
}