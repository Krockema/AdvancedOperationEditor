/**
 * Create Rule Set that only on to one connections are allowed based on
 * https://jgraph.github.io/mxgraph/docs/js-api/files/view/mxMultiplicity-js.html#mxMultiplicity.mxMultiplicity
 */
function setFolding(graph) {
    // Changes swimlane orientation while collapsed
    graph.model.getStyle = function(cell)
    {
        var style = mxGraphModel.prototype.getStyle.apply(this, arguments);
					
        if (graph.isCellCollapsed(cell))
        {
            if (style != null)
            {
                style += ';';
            }
            else
            {
                style = '';
            }
							
            style += 'horizontal=1;align=left;spacingLeft=14;';
        }
						
        return style;
    };

    // Keeps widths on collapse/expand					
    var foldingHandler = function(sender, evt)
    {
        var cells = evt.getProperty('cells');
						
        for (var i = 0; i < cells.length; i++)
        {
            var geo = graph.model.getGeometry(cells[i]);

            if (geo.alternateBounds != null)
            {
                geo.width = geo.alternateBounds.width;
            }
        }
    };

    graph.addListener(mxEvent.FOLD_CELLS, foldingHandler);
}
