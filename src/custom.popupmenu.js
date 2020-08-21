// Function to create the entries in the popupmenu
function createPopupMenu(graph, editor, menu, cell, evt)
{
    if (cell != null)
    {
        menu.addItem('Info (Console)', 'src/images/text.gif', function() {
            console.log('cell', cell);
            console.log('evt', evt);
        });

        var selection = graph.getSelectionCells();
        if(allCellParentEquals(graph, selection)) {
            menu.addItem('Duplicate', 'src/images/copy.gif', function() {
                copy(graph, selection);
                paste(graph, selection[0].getParent());
            });

            menu.addItem('Group', 'src/images/group.gif', function() {
                group(graph, evt, editor.templates["grouped"] ,selection);
            });
        }
        //menu.addSeparator();
        menu.addItem('Remove', 'src/images/delete.gif', function() {
            unlockUponDelete(selection);
        });
    }
    else
    {
        menu.addItem('No-Cell Item', 'src/images/image.gif', function() {
            mxUtils.alert('Some Random Info');
        });
    }
};

function allCellParentEquals(graph, selection) {
    var equals = true;
    var previous = graph.model.getParent(selection[0]);
    for (var i = 1; i < selection.length; i++) {
        if (graph.model.getParent(selection[i]) !== previous) {
            equals = false;
        }
    }
    return equals;
}

function unlockUponDelete(removals) {
    if(removals != null) {
        for (var i = 0; i < removals.length; i++) {
            var itemContainer = document.getElementById(removals[i].value.id);
            if (itemContainer != null) {
                itemContainer.className = "operationWrapper uncheck";
                itemContainer.removeChild(itemContainer.children[1]);
            }
            unlockUponDelete(removals[i].children);
        }
    graph.removeCells(removals, true);
    }
}

function group(graph, evt, prototype, cells) {
    graph.stopEditing(false);
    var cell = graph.model.getParent(cells[0]); // attention: only works for same level, should may be checked in before.
    var pt = graph.getPointForEvent(evt);
    var vertex = graph.getModel().cloneCell(prototype);
    vertex.geometry.x = pt.x;
    vertex.geometry.y = pt.y;
    //graph.setSelectionCells(
    var parent = graph.importCells([vertex], 0, 0, cell)[0];
    var result = copy(graph, cells);
    graph.removeCells(result);
    paste(graph, parent);
}

function copy(graph, cells) {
    var result = graph.getExportableCells(cells);
    mxClipboard.parents = new Object();


    for (var i = 0; i < result.length; i++)
    {
        mxClipboard.parents[i] = (parent === null) ? graph.model.getParent(cells[i]) : parent;
    }

    mxClipboard.insertCount = 1;
    mxClipboard.setCells(graph.cloneCells(result));
    return result;
}

function paste(graph, newParent) {
    if (!mxClipboard.isEmpty())
    {
        var cells = graph.getImportableCells(mxClipboard.getCells());
        var delta = 40;
        var parent = (newParent === null) ? graph.getDefaultParent() : newParent;

        graph.model.beginUpdate();
        try
        {
            for (var i = 0; i < cells.length; i++) {
                var tmp = parent;
                if (mxClipboard.parents != null && mxClipboard.parents[i] !== window && graph.model.contains(mxClipboard.parents[i])) {
                    tmp = mxClipboard.parents[i];
                    //delta = 0;
                }
                cells[i] = graph.importCells([cells[i]], delta, delta, tmp)[0];
            }
        }
        finally
        {
            graph.model.endUpdate();
        }
        // selects the inserted cells
        graph.setSelectionCells(cells);
    }
};