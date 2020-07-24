function addToolbarItem(graph, toolbar, prototype, image, id, infoText)
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
    img.setAttribute("id", id);
    img.setAttribute("data-toggle", "tooltip");
    img.setAttribute("style", "width: 40px");
    img.setAttribute("title", infoText);
    mxUtils.makeDraggable(img, graph, funct);
}

$(document).ready(function () {
    $("#graphToolbarContainer img").tooltip({
        placement: 'right',
        template: '<div class="tooltip">' +
            '<div class="tooltip-arrow"></div>' +
                '<div class="tooltip-head">' +
                    '<h3>Tool Info</h3>' +
                '</div>' +
            '<div class="tooltip-inner"></div>' +
            '</div>'
    });
});