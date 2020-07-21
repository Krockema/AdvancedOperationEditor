var addVertex = function(graph, toolbar, icon, w, h, style)
{
    var vertex = new mxCell(null, new mxGeometry(0, 0, w, h), style);
    vertex.setVertex(true);

    addToolbarItem(graph, toolbar, vertex, icon);
};

function addToolbarItem(graph, toolbar, prototype, image)
{
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
        
        graph.setSelectionCells(graph.importCells([vertex], 0, 0, cell));
    }

    // Creates the image which is used as the drag icon (preview)
    var img = toolbar.addMode(null, image, funct);
    mxUtils.makeDraggable(img, graph, funct);
}