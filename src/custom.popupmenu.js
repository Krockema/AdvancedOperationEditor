// Function to create the entries in the popupmenu
function createPopupMenu(graph, menu, cell, evt)
{
    if (cell != null)
    {
        menu.addItem('Info (Console)', 'src/images/text.gif', function() {
            console.log('cell', cell);
            console.log('evt', evt);
        });
        //menu.addSeparator();
        menu.addItem('Remove', 'src/images/delete.gif', function() {
            graph.removeCells([cell], true);
        });
    }
    else
    {
        menu.addItem('No-Cell Item', 'src/images/image.gif', function() {
            mxUtils.alert('Some Random Info');
        });
    }
};