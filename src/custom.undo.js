function createUndoManager(editor) {
    var undoManager = new mxUndoManager();
    editor.undoManager = undoManager;
    var listener = function (sender, evt) {
        undoManager.undoableEditHappened(evt.getProperty('edit'));
    };
    graph.getModel().addListener(mxEvent.ADD_CELLS, listener);
    //graph.getView().addListener(mxEvent.ADD_CELLS, listener);

    graph.getModel().addListener(mxEvent.LABEL_CHANGED, listener);
    //graph.getView().addListener(mxEvent.LABEL_CHANGED, listener);

    graph.getModel().addListener(mxEvent.REMOVE_CELLS, listener);
    //graph.getView().addListener(mxEvent.REMOVE_CELLS, listener);


    //graph.getView().addListener(mxEvent.CELLS_RESIZED, listener);
   //  // Keeps the selection state in sync
   //  var undoHandler = function (sender, evt) {
   //      var changes = evt.getProperty('edit').changes;
   //      graph.setSelectionCells(graph.getSelectionCellsForChanges(changes));
   //      graph.refresh(graph.model.getParent(changes[0]));
   //  };
   // 
   //  editor.undoManager.addListener(mxEvent.UNDO, undoHandler);
   //  editor.undoManager.addListener(mxEvent.REDO, undoHandler);
}

function undoLastStep(editor) {
    try {
        editor.undoManager.undo();
        graph.refresh(graph.getDefaultParent());        
    } finally {
        checkIfOperationExist();
    } 
    //graph.cells
}

function redoLastStep(editor) {
    try {
        editor.undoManager.redo();
        graph.refresh(graph.getDefaultParent());
    } finally  {
        checkIfOperationExist();
    } 
    //graph.cells
}