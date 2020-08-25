// Defines a new class for all icons
function mxIconSet(state, up, down, upAndDown) {
    this.images = [];
    var graph = state.view.graph;

    // Move Down
    if (down || upAndDown) {
        var img = mxUtils.createImage('src/images/down.gif');
        img.setAttribute('title', 'Down');
        img.style.position = 'absolute';
        img.style.cursor = 'pointer';
        img.style.width = '16px';
        img.style.height = '16px';
        img.style.left = (state.x + state.width - 15) + 'px';
        img.style.top = (state.y + state.height - 15) + 'px';

        mxEvent.addGestureListeners(img,
            mxUtils.bind(this, function (evt) {
                var parent = graph.model.getParent(state.cell);
                var index = parent.children.indexOf(state.cell);
                swapArrayElements(parent.children, index, index + 1);
                var result = copy(graph, parent.children);
                graph.removeCells(result);
                paste(graph, parent, false, 0);
                mxEvent.consume(evt);
                this.destroy();
            })
        );

        state.view.graph.container.appendChild(img);
        this.images.push(img);
    }

    if (up || upAndDown) {
        // Move Up
        var img = mxUtils.createImage('src/images/up.gif');
        img.setAttribute('title', 'Up');
        img.style.position = 'absolute';
        img.style.cursor = 'pointer';
        img.style.width = '16px';
        img.style.height = '16px';
        img.style.left = (state.x + state.width - 15) + 'px';
        img.style.top = (state.y) + 'px';

        // mxEvent.addGestureListeners(img,
        //     mxUtils.bind(this, function(evt)
        //     {
        //         // Disables dragging the image
        //         mxEvent.consume(evt);
        //     })
        // );

        mxEvent.addListener(img, 'click',
            mxUtils.bind(this, function (evt) {
                var parent = graph.model.getParent(state.cell);
                var index = parent.children.indexOf(state.cell);
                swapArrayElements(parent.children, index, index - 1);
                var result = copy(graph, parent.children);
                graph.removeCells(result);
                paste(graph, parent, false, 0);
                mxEvent.consume(evt);
                this.destroy();
            })
        );

        state.view.graph.container.appendChild(img);
        this.images.push(img);
    }
};

mxIconSet.prototype.destroy = function () {
    if (this.images != null) {
        for (var i = 0; i < this.images.length; i++) {
            var img = this.images[i];
            img.parentNode.removeChild(img);
        }
    }

    this.images = null;
};

// Shows icons if the mouse is over a cell
function addHoverIcons(graph, iconTolerance = 20) {
    graph.addMouseListener(
        {
            currentState: null,
            currentIconSet: null,
            mouseDown: function(sender, me) {
                // Hides icons on mouse down
                if (this.currentState != null) {
                    this.dragLeave(me.getEvent(), this.currentState);
                    this.currentState = null;
                }
            },
            mouseMove: function(sender, me) {
                if (this.currentState != null &&
                (me.getState() == this.currentState ||
                    me.getState() == null)) {
                    var tol = iconTolerance;
                    var tmp = new mxRectangle(me.getGraphX() - tol,
                        me.getGraphY() - tol,
                        2 * tol,
                        2 * tol);

                    if (mxUtils.intersects(tmp, this.currentState)) {
                        return;
                    }
                }

                var tmp = graph.view.getState(me.getCell());

                // Ignores everything but FRO with more then 1 element
                if (tmp != null && !isFRO(graph.model.getParent(tmp.cell))) {
                    // (graph.isMouseDown || (!graph.getModel().isVertex(tmp.cell)) && ) ) {
                    tmp = null;
                }

                if (tmp != this.currentState) {
                    if (this.currentState != null) {
                        this.dragLeave(me.getEvent(), this.currentState);
                    }

                    this.currentState = tmp;

                    if (this.currentState != null) {
                        this.dragEnter(me.getEvent(), this.currentState);
                    }
                }
            },
            mouseUp: function(sender, me) {},
            dragEnter: function(evt, state) {
                if (this.currentIconSet == null) {
                    var parent = graph.model.getParent(state.cell);
                    var first = isFirst(state.cell, parent);
                    var last = isLast(state.cell, parent);
                    this.currentIconSet = new mxIconSet(state, last, first, (!first && !last));

                }
            },
            dragLeave: function(evt, state) {
                if (this.currentIconSet != null) {
                    this.currentIconSet.destroy();
                    this.currentIconSet = null;
                }
            }
        });
}

function isFRO(parent) {
    if (parent.value != null && parent.children.length > 1) {
        if ("FRO" === parent.value.children[0].getAttribute("Type")) {
            return true;
        }
    }
    return false;
}

function swapArrayElements(arr, indexA, indexB) {
    var temp = arr[indexA];
    arr[indexA] = arr[indexB];
    arr[indexB] = temp;
};

function isFirst(cell, parent) {
    return parent.children[0] === cell;
}

function isLast(cell, parent) {
    return parent.children[parent.children.length - 1] === cell;
}