function readFile(graph, mxUtils, filename) {
    var req = mxUtils.load(filename);
    var root = req.getDocumentElement();
    var decoder = new mxCodec(root.ownerDocument);
    decoder.decode(root, graph.getModel());
    graph.refresh();
};

function readFromFile(filename) {
    xhrDoc= new XMLHttpRequest();
    xhrDoc.open('GET', filename, false);
    // if (xhrDoc.overrideMimeType)
    //     xhrDoc.overrideMimeType('text/plain; charset=x-user-defined');
    xhrDoc.onreadystatechange = function()
    {
        if (this.readyState === 4)
        {
           //  if (this.status === 200) // is 0 on local - might change online ? 
           //  {
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(this.response,"text/xml");
                console.log(xmlDoc);
                createOperationToolbox();
                // var docStr = new XMLSerializer().serializeToString(xmlDoc); // for serializing later on 
                // console.log(docStr);
           // }
        }                   
    }
    xhrDoc.send();
}

function createOperationToolbox() {
    var rows = xmlDoc.children[0].children[1].children;

    var obContainer = createToolbar(editor);
    for (var i = 0; i < rows.length; i++) {
        addOperationItem(graph,
                        operationBar,
                        editor.templates["operation"],
                        'src/editor/shapes/operation.svg',
                        rows[i].getElementsByTagName('APPOID')[0].textContent, // id ,
                        rows[i].getElementsByTagName('APPONAME')[0].textContent // name 
        );
        console.log(rows[i].getElementsByTagName('APPONAME')[0].textContent);
    }
    createWrapper(obContainer,'operation');
}

function createInfoFields(form, id) {
    if (xmlDoc === null) return;
    var rows = xmlDoc.children[0].children[1].children;

    var elements = Array.from(rows).filter(x => x.getElementsByTagName('APPOID')[0].textContent === id);
    if (elements.length === 1) {
        for (var i = 0; i < elements[0].childElementCount; i++) {
            var input = form.addText(elements[0].children[i].nodeName + ':', elements[0].children[i].innerHTML);
            input.setAttribute('disabled', 'true');
        }
    }
}