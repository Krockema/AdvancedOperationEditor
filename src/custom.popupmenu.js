// Function to create the entries in the popupmenu
function createPopupMenu(graph, menu, cell, evt)
{
    if (cell != null)
    {
        menu.addItem('Info', 'src/images/text.gif', function()
        {
            mxUtils.alert(cell);
        });
        //menu.addSeparator();
        menu.addItem('Remove', 'src/images/delete.gif', function()
        {
            graph.removeCells([cell], true)
        });
    }
    else
    {
        menu.addItem('No-Cell Item', 'src/images/image.gif', function()
        {
            mxUtils.alert('Some Random Info');
        });
    }
};