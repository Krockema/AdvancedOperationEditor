function createComplexToolbar(graph, editor) {
    // create an Toolbar
    var tbContainer = document.getElementById('graphToolbarContainer');
    var toolbar = new mxToolbar(tbContainer, editor);
    toolbar.enabled = false;
    // Create Editor Items

    addToolbarItem(graph, toolbar, applyType(editor.templates["grouped"], 'SRO' ), 'src/editor/shapes/complex-sro.svg', "Single", "Complex Node to group Single Nodes processed in any order.");
    addToolbarItem(graph, toolbar, applyType(editor.templates["grouped"], 'ARO' ), 'src/editor/shapes/complex-aro.svg', "Alternative", "Complex Node to group Single Nodes processed alternatively.");
    addToolbarItem(graph, toolbar, applyType(editor.templates["grouped"], 'FRO' ), 'src/editor/shapes/complex-fro.svg', "Fixed", "Complex Node to group Single Nodes processed in fixed order.");
    addToolbarItem(graph, toolbar, applyType(editor.templates["grouped"], 'PRO' ), 'src/editor/shapes/complex-pro.svg', "Parallel", "Complex Node to group Single Nodes processed simulanious order.");
    addToolbarItem(graph, toolbar, editor.templates["operation"], 'src/editor/shapes/operation.svg', "Operation", "Single Node that is equal to an operation");
    createWrapper(tbContainer, "complex");
}
function applyType(template, type) {
    var clone = template.clone();
    clone.value.childNodes[0].setAttribute("Type", type);
    return clone;
}

function addToolbarItem(graph, toolbar, prototype, image, id, infoText) {
    // Function that is executed when the image is dropped on
    // the graph. The cell argument points to the cell under
    // the mousepointer if there is one.
    var funct = function(graph, evt, cell)
    {
        graph.stopEditing(false);
    
        var pt = graph.getPointForEvent(evt);
        var vertex = graph.getModel().cloneCell(prototype);
        vertex.geometry.x = pt.x;
        vertex.geometry.y = pt.y;

        graph.model.beginUpdate();
        graph.setSelectionCells(graph.importCells([vertex], 0, 0, cell));
        var created = graph.getSelectionCells()[0];
        //graph.model.setStyle(created, 'process');
        graph.model.endUpdate();
    }

    // Creates the image which is used as the drag icon (preview)
    var img = toolbar.addMode(null, image, funct);
    img.setAttribute("id", id);
    img.setAttribute("data-toggle", "tooltip");
    img.setAttribute("name", id.substr(0, 30));
    img.setAttribute("style", "width: 100px");
    img.setAttribute("title", infoText);
    mxUtils.makeDraggable(img, graph, funct);
}
