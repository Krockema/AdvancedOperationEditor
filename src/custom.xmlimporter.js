function readFile(graph, mxUtils, filename) {
    var req = mxUtils.load(filename);
    var root = req.getDocumentElement();
    var decoder = new mxCodec(root.ownerDocument);
    decoder.decode(root, graph.getModel());
    graph.refresh()
};