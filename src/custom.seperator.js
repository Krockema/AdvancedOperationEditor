function onload() {
    dragElement(document.getElementById("seperator"), "H");
}

// function is used for dragging and moving
function dragElement(element, direction, handler) {
    // Two variables for tracking positions of the cursor
    const drag = { x: 0, y: 0 };
    const delta = { x: 0, y: 0 };
    /* if present, the handler is where you move the DIV from
       otherwise, move the DIV from anywhere inside the DIV */
    handler ? (handler.onmousedown = dragMouseDown) : (element.onmousedown = dragMouseDown);

    // function that will be called whenever the down event of the mouse is raised
    function dragMouseDown(e) {
        drag.x = e.clientX;
        drag.y = e.clientY;
        document.onmousemove = onMouseMove;
        document.onmouseup = () => { document.onmousemove = document.onmouseup = null; }
    }

    // function that will be called whenever the up event of the mouse is raised
    function onMouseMove(e) {
        const currentX = e.clientX;
        const currentY = e.clientY;

        delta.x = currentX - drag.x;
        delta.y = currentY - drag.y;

        const offsetLeft = element.offsetLeft;
        const offsetTop = element.offsetTop;


        const first = document.getElementById("first");
        const second = document.getElementById("second");
        const graphContainer = document.getElementById("graphContainer");
        let firstWidth = first.offsetWidth;
        let secondWidth = second.offsetWidth;
        if (direction === "H") // Horizontal
        {
            element.style.left = offsetLeft + delta.x + "px";
            firstWidth += delta.x;
            secondWidth -= delta.x;
        }
        drag.x = currentX;
        drag.y = currentY;
        first.style.width = firstWidth + "px";
        graphContainer.style.width = firstWidth - 40 + "px";
        second.style.width = secondWidth + "px";
    }
}

function setInitialWidth() {
    var height = window.innerHeight - 70;
    var width = window.innerWidth;
    
    var first = document.getElementById("first");
    var second = document.getElementById("second");
    var sep = document.getElementById("seperator");
    var graphContainer = document.getElementById("graphContainer");
    var propertiesContainer = document.getElementById("properties");
    let secondWidth = (width - 200) * 0.2;
    secondWidth = (secondWidth > 320) ? secondWidth : 320;
    let firstWidth = (width - secondWidth -200);

    first.style.width = firstWidth + "px";
    graphContainer.style.width = firstWidth-40 + "px";
    first.style.height = height + "px";
    second.style.width = secondWidth + "px";
    second.style.height = height + "px";
    sep.style.height = height + "px";
    propertiesContainer.style.height = height - 200 + "px";
}