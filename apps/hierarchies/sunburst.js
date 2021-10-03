import * as util from './util.js'

class Sunburst {
    constructor() {
        this.data = undefined;
        this.sel = undefined;
        this.width = document.getElementById("showBox").clientWidth
        this.height = document.getElementById("showBox").clientHeight;
    }

    autoBox() {
        document.body.appendChild(this);
        const {x, y, width, height} = this.getBBox();
        document.body.removeChild(this);

        return [x, y, width, height];
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
        let radius = this.width / 2

        const root = d3.partition()
            .size([2 * Math.PI, radius])
            (d3.hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value))

        const svg = d3.create("svg").attr("id", "diagram");

        let color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))

        svg.append("g")
            .attr("fill-opacity", 0.6)
            .selectAll("path")
            .data(root.descendants().filter(d => d.depth))
            .join("path")
            .attr("fill", d => {
                if (util.isSameNodeWithValuePath(this.sel, d)) {
                    return util.selectedColor
                }
                while (d.depth > 1) d = d.parent;
                return color(d.data.name);
            })
            .attr("d", d3.arc()
                .startAngle(d => d.x0)
                .endAngle(d => d.x1)
                .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
                .padRadius(radius / 2)
                .innerRadius(d => d.y0)
                .outerRadius(d => d.y1 - 1))
            .append("title")
            .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${d3.format(",d")(d.value)}`);

        svg.append("g")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .attr("font-size", 10)
            .attr("font-family", "sans-serif")
            .selectAll("text")
            .data(root.descendants().filter(d => d.depth && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10))
            .join("text")
            .attr("transform", function (d) {
                const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
                const y = (d.y0 + d.y1) / 2;
                return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
            })
            .attr("dy", "0.35em")
            .text(d => d.data.name);

        return svg.attr("viewBox", this.autoBox).node();
    }

    ReDraw() {
        d3.select("#showBox").selectAll("svg").remove();
        let showBox = document.getElementById("showBox");
        this.width = showBox.clientWidth || showBox.offsetWidth;

        const nodes = this.Chart(this.data);
        d3.select("#showBox").append(node => nodes);
    }
}

let sb = new Sunburst()
window.Draw.addAppListener("Sunburst", function (data) {
    sb.SetData(data)
    sb.ReDraw()
})

window.Draw.addSelectNodeListener("Sunburst", function (node) {
    sb.SetSelectNode(node)
    sb.ReDraw()
})

window.Draw.addNewFileListener("Sunburst", function (node) {
    return sb.newFile()
})




