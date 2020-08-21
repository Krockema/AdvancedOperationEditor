/**
 * Create Rule Set that only on to one connections are allowed based on
 * https://jgraph.github.io/mxgraph/docs/js-api/files/view/mxMultiplicity-js.html#mxMultiplicity.mxMultiplicity
 */
function createValidationRules(graph) {
    

    // SingleNode node does not want any incoming and outgoing connections
    graph.multiplicities.push(new mxMultiplicity(
        false, 'SingleNode', null, null, 1, 1, ['SingleNode', 'ComplexNode'],
        'Only 1 connector allowed',
        null));

    graph.multiplicities.push(new mxMultiplicity(
        true, 'SingleNode', null, null, 1, 1, ['SingleNode', 'ComplexNode'],
        'Only 1 connector allowed',
        null));

    graph.multiplicities.push(new mxMultiplicity(
        false, 'ComplexNode', null, null, 1, 1, ['SingleNode', 'ComplexNode'],
        'Only 1 connector allowed',
        null));

    graph.multiplicities.push(new mxMultiplicity(
        true, 'ComplexNode', null, null, 1, 1, ['SingleNode', 'ComplexNode'],
        'Only 1 connector allowed',
        null));
}
