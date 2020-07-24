function customizeElementStyle(graph)
{
    // Creates the default style for vertices
    var style = graph.getStylesheet().getDefaultVertexStyle();
    style[mxConstants.STYLE_STROKECOLOR] = 'gray';
    style[mxConstants.STYLE_ROUNDED] = true;
    style[mxConstants.STYLE_SHADOW] = false;
    style[mxConstants.STYLE_FILLCOLOR] = '#DFDFDF';
    style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
    style[mxConstants.STYLE_FONTCOLOR] = 'black';
    style[mxConstants.STYLE_FONTSIZE] = '12';
    style[mxConstants.STYLE_SPACING] = 4;
    style[mxConstants.STYLE_RESIZE_HEIGHT] = 0;
    style[mxConstants.STYLE_SWIMLANE_FILLCOLOR] = 'white';
    style[mxConstants.STYLE_STROKEWIDTH] = 2;

    // Creates the default style for edges
    style = graph.getStylesheet().getDefaultEdgeStyle();
    style[mxConstants.STYLE_STROKECOLOR] = '#0C0C0C';
    style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'white';
    style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
    style[mxConstants.STYLE_ROUNDED] = true;
    style[mxConstants.STYLE_FONTCOLOR] = 'black';
    style[mxConstants.STYLE_FONTSIZE] = '10';
    style[mxConstants.STYLE_STROKEWIDTH] = 2;
}