function customLayout(mxLayout) {
    mxLayout.execute = function (parent) {
	    if (parent != null) {
		    var pgeo = this.getParentSize(parent);
			var horizontal = parent.orientation === 'row';
		    var model = this.graph.getModel();
		    var fillValue = null;

		    if (pgeo != null) {
			    fillValue = (horizontal) ? pgeo.height - this.marginTop - this.marginBottom :
				    pgeo.width - this.marginLeft - this.marginRight;
		    }

		    fillValue -= 2 * this.border;
		    var x0 = this.x0 + this.border + this.marginLeft;
		    var y0 = this.y0 + this.border + this.marginTop;

		    // Handles swimlane start size
		    if (this.graph.isSwimlane(parent)) {
			    // Uses computed style to get latest 
			    var style = this.graph.getCellStyle(parent);
			    var start = mxUtils.getNumber(style, mxConstants.STYLE_STARTSIZE, mxConstants.DEFAULT_STARTSIZE);
			    var horz = mxUtils.getValue(style, mxConstants.STYLE_HORIZONTAL, true) == 1;

			    if (pgeo != null) {
				    if (horz) {
					    start = Math.min(start, pgeo.height);
				    }
				    else {
					    start = Math.min(start, pgeo.width);
				    }
			    }

			    if (horizontal == horz) {
				    fillValue -= start;
			    }

			    if (horz) {
				    y0 += start;
			    }
			    else {
				    x0 += start;
			    }
		    }

		    model.beginUpdate();
		    try {
			    var tmp = 0;
			    var last = null;
			    var lastValue = 0;
			    var lastChild = null;
			    var cells = this.getLayoutCells(parent);

			    for (var i = 0; i < cells.length; i++) {
				    var child = cells[i];
				    var geo = model.getGeometry(child);
					horizontal = model.getParent(child).orientation === 'row';
				    if (geo != null) {
					    geo = geo.clone();

					    if (this.wrap != null && last != null) {
						    if ((horizontal && last.x + last.width +
							    geo.width + 2 * this.spacing > this.wrap) ||
							    (!horizontal && last.y + last.height +
								    geo.height + 2 * this.spacing > this.wrap)) {
							    last = null;

							    if (horizontal) {
								    y0 += tmp + this.spacing;
							    }
							    else {
								    x0 += tmp + this.spacing;
							    }

							    tmp = 0;
						    }
					    }

					    tmp = Math.max(tmp, (horizontal) ? geo.height : geo.width);
					    var sw = 0;

					    if (!this.borderCollapse) {
						    var childStyle = this.graph.getCellStyle(child);
						    sw = mxUtils.getNumber(childStyle, mxConstants.STYLE_STROKEWIDTH, 1);
					    }

					    if (last != null) {
						    var temp = lastValue + this.spacing + Math.floor(sw / 2);

						    if (horizontal) {
							    geo.x = this.snap(((this.allowGaps) ? Math.max(temp, geo.x) :
								    temp) - this.marginLeft) + this.marginLeft;
						    }
						    else {
							    geo.y = this.snap(((this.allowGaps) ? Math.max(temp, geo.y) :
								    temp) - this.marginTop) + this.marginTop;
						    }
					    }
					    else if (!this.keepFirstLocation) {
						    if (horizontal) {
							    geo.x = (this.allowGaps && geo.x > x0) ? Math.max(this.snap(geo.x -
								    this.marginLeft) + this.marginLeft, x0) : x0;
						    }
						    else {
							    geo.y = (this.allowGaps && geo.y > y0) ? Math.max(this.snap(geo.y -
								    this.marginTop) + this.marginTop, y0) : y0;
						    }
					    }

					    if (horizontal) {
						    geo.y = y0;
					    }
					    else {
						    geo.x = x0;
					    }

					    if (this.fill && fillValue != null) {
						    if (horizontal) {
							    geo.height = fillValue;
						    }
						    else {
							    geo.width = fillValue;
						    }
					    }

					    if (horizontal) {
						    geo.width = this.snap(geo.width);
					    }
					    else {
						    geo.height = this.snap(geo.height);
					    }

					    this.setChildGeometry(child, geo);
					    lastChild = child;
					    last = geo;

					    if (horizontal) {
						    lastValue = last.x + last.width + Math.floor(sw / 2);
					    }
					    else {
						    lastValue = last.y + last.height + Math.floor(sw / 2);
					    }
				    }
			    }

			    if (this.resizeParent && pgeo != null && last != null && !this.graph.isCellCollapsed(parent)) {
				    this.updateParentGeometry(parent, pgeo, last);
			    }
			    else if (this.resizeLast && pgeo != null && last != null && lastChild != null) {
				    if (horizontal) {
					    last.width = pgeo.width - last.x - this.spacing - this.marginRight - this.marginLeft;
				    }
				    else {
					    last.height = pgeo.height - last.y - this.spacing - this.marginBottom;
				    }

				    this.setChildGeometry(lastChild, last);
			    }
		    }
		    finally {
			    model.endUpdate();
		    }
	    }
	};

    mxLayout.updateParentGeometry = function (parent, pgeo, last) {
		var horizontal = parent.orientation === 'row';
        var model = this.graph.getModel();

        var pgeo2 = pgeo.clone();

        if (horizontal) {
            var tmp = last.x + last.width + this.marginRight + this.border;

            if (this.resizeParentMax) {
                pgeo2.width = Math.max(pgeo2.width, tmp);
            }
            else {
                pgeo2.width = tmp;
            }
        }
        else {
            var tmp = last.y + last.height + this.marginBottom + this.border;

            if (this.resizeParentMax) {
                pgeo2.height = Math.max(pgeo2.height, tmp);
            }
            else {
                pgeo2.height = tmp;
            }
        }

        if (pgeo.x != pgeo2.x || pgeo.y != pgeo2.y ||
            pgeo.width != pgeo2.width || pgeo.height != pgeo2.height) {
            model.setGeometry(parent, pgeo2);
        }
    };
}