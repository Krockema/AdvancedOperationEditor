function showXML(graph)
{
    var encoder = new mxCodec();
    var node = encoder.encode(graph.getModel());
    mxUtils.popup(mxUtils.getPrettyXml(node), true);
};
