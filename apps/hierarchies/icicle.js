import * as util from "./util.js";

class Icicle {
    constructor() {
        this.width = document.getElementById("showBox").clientWidth
        this.height = document.getElementById("showBox").clientHeight;
    }

    SetData(data) {
        this.data = data
    }

    SetSelectNode(node) {
        this.sel = util.transformPath2ValuePath(node, this.data)
        console.log("get node by node is", this.sel);
    }

    newFile() {
        let child = {"name": "cluster"}
        let obj = {"name": "flare", "children":[child]}

        return obj
    }

    Chart(data) {
        const root = d3.partition()
            .size([this.height, this.width])
            .padding(1)
            (d3.hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => b.height - a.height || b.value - a.value));

        const svg = d3.create("svg").attr("id", "diagram")
            .attr("viewBox", [0, 0, this.width, this.height])
            .style("font", "10px sans-serif");

        const cell = svg
            .selectAll("g")
            .data(root.descendants())
            .join("g")
            .attr("transform", d => `translate(${d.y0},${d.x0})`);

        let color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))

        cell.append("rect")
            .attr("width", d => d.y1 - d.y0)
            .attr("height", d => d.x1 - d.x0)
            .attr("fill-opacity", 0.6)
            .attr("fill", d => {
                if (util.isSameNodeWithValuePath(this.sel, d)) {
                    return util.selectedColor
                }
                if (!d.depth) {
                    return "#ccc";
                }
                while (d.depth > 1) {
                    d = d.parent;
                }
                return color(d.data.name);
            });

        const text = cell.filter(d => (d.x1 - d.x0) > 16).append("text")
            .attr("x", 4)
            .attr("y", 13);

        text.append("tspan")
            .text(d => d.data.name);

        text.append("tspan")
            .attr("fill-opacity", 0.7)
            .text(d => ` ${d3.format(",d")(d.value)}`);

        cell.append("title")
            .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${d3.format(",d")(d.value)}`);

        return svg.node();
    }

    ReDraw(data) {
        d3.select("#showBox").selectAll("svg").remove();
        const nodes = this.Chart(this.data)
        d3.select("#showBox").append(node => nodes);
    }
}

let ic = new Icicle()
window.Draw.addAppListener("Icicle", function (data) {
    ic.SetData(data)
    ic.ReDraw()
})

window.Draw.addSelectNodeListener("Icicle", function (node) {
    ic.SetSelectNode(node)
    ic.ReDraw()
})

window.Draw.addNewFileListener("Icicle", function (node) {
    return ic.newFile()
})


