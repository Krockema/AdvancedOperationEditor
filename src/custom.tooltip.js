function addDefaultToolTip(graph)
{
    // Installs a custom tooltip for cells
    graph.getTooltipForCell = function(cell)
    {
        return 'Doubleclick and right- or shiftclick';
    }
}
