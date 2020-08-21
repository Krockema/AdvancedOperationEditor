// Creates a new Toolbar and removes an previous one.
function createToolbar(editor) {
    var container = document.getElementById('graphOperationContainer');
    if (operationBar != null) {
        operationBar.destroy();
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
    // create an Toolbar
    
    operationBar = new mxToolbar(container, editor);
    operationBar.enabled = false;
    return container;
}

// installs default Toolbar for testing purpose 
function createOperationToolbar(graph, editor) {
    var obContainer = createToolbar(editor);
    // Create Editor Items - loop in the future;
    addOperationItem(graph, operationBar, editor.templates["operation"], 'src/editor/shapes/operation.svg', "op1", "1: Zuschneiden");
    addOperationItem(graph, operationBar, editor.templates["operation"], 'src/editor/shapes/operation.svg', "op2", "2: Entgraten");
    addOperationItem(graph, operationBar, editor.templates["operation"], 'src/editor/shapes/operation.svg', "op3", "3: Verschrauben");
    createWrapper(obContainer, "operation");
}

function applyAttributes(template, attr, operationName) {
    var clone = template.clone();
    clone.value.childNodes[0].setAttribute("Name", operationName);
    clone.value.id = attr;
    clone.value.name = operationName;
    return clone;
}

function addOperationItem(graph, toolbar, prototype, image, id, infoText) {
    prototype = applyAttributes(prototype, id, infoText);
    // Function that is executed when the image is dropped on
    // the graph. The cell argument points to the cell under
    // the mousepointer if there is one.
    var funct = function(graph, evt, cell)
    {
        graph.stopEditing(false);
        toolbar.disable = true;
        // set Geometry
        var pt = graph.getPointForEvent(evt);
        var vertex = graph.getModel().cloneCell(prototype);
        vertex.geometry.x = pt.x;
        vertex.geometry.y = pt.y;
        
        // Import Vertex
        graph.setSelectionCells(graph.importCells([vertex], 0, 0, cell));
        // Update Size and Select Cell.
        var created = graph.getSelectionCells()[0];
        graph.model.setStyle(created, 'process');
        graph.updateCellSize(created, false);
        
        // update Menu info
        var itemContainer = document.getElementById(vertex.value.id);
        itemContainer.className = "operationWrapper check";
        var overlay = document.createElement('div');
        overlay.className = 'toolbar-overlay';
        itemContainer.appendChild(overlay);
    }

    // Creates the image which is used as the drag icon (preview)
    var img = toolbar.addMode("test", image, funct);
    img.setAttribute("id", id);
    img.setAttribute("name", infoText.substr(0, 30));
    img.setAttribute("data-toggle", "tooltip");
    //img.setAttribute("style", "::after content: ' test'");

    img.setAttribute("class", id);
    img.setAttribute("title", infoText);
    mxUtils.makeDraggable(img, graph, funct);
    return img;
}


function createWrapper(toolbar, type) {
    
    var items = toolbar.children;
    var base = document.createElement('div');
    // black magic --> append removes the item from toolbar.children therefore we loop while not for each and re-attatch the result to the toolbar
    base.setAttribute("class", type + "Toolbar");
    while (items.length != 0) {
        var wrapper = document.createElement('div');
        var name = items[0].name;
        if (name === undefined) {
            name = '';
        }
        wrapper.setAttribute("id", items[0].id);
        wrapper.setAttribute("name", name);
        wrapper.setAttribute("class", type + "Wrapper uncheck");
        
        wrapper.append(items[0]);
        base.append(wrapper);
    }
    toolbar.append(base);
}