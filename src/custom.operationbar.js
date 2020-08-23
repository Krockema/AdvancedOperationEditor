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
        graph.model.setStyle(created, 'process;shape=process;fillColor=#cdd7d6ff;');
        graph.updateCellSize(created, false);
        
        // update Menu info
        var itemContainer = document.getElementById(vertex.value.id);
        itemContainer.className = "operationWrapper check";
        // may move later to a Function to disable menue entries
        // var overlay = document.createElement('div');
        // overlay.className = 'toolbar-overlay';
        // itemContainer.appendChild(overlay);
    }

    // Creates the image which is used as the drag icon (preview)
    var img = toolbar.addMode(id , image, funct);
    img.setAttribute("id", id);
    img.setAttribute("name", infoText.substr(0, 30));
    img.setAttribute("data-toggle", "tooltip");
    //img.setAttribute("style", "::after content: ' test'");

    img.setAttribute("class", id);
    img.setAttribute("title", infoText);
    mxUtils.makeDraggable(img, graph, funct);
    hoverById(graph, id);
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

function hoverById(graph, id){
    var elms=document.getElementsByClassName(id);
    for(var i=0;i<elms.length;i++) {
        elms[i].onmouseover = function() { changeShape(graph, id, "#c7f464"); }
        elms[i].onmouseout = function() { changeShape(graph, id, "#cdd7d6ff"); } 
    }
}

function changeShape(graph, id, shapeColor) {
    var results = filterSameId(graph, id);
    for (var result in results) {
        graph.model.setStyle(results[result][1], "process;shape=process;fillColor=" + shapeColor);
        editor.undoManager.history.pop();editor.undoManager.history.pop();
        editor.undoManager.indexOfNextAdd = editor.undoManager.history.length;
    }
};

function filterSameId(graph, id) {
    return graph.model.filterCells(Object.entries(graph.model.cells),
        function(cell) { return cell[1].value != null && cell[1].value.id === id; });
}
