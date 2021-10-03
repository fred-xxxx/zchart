import * as util from './util.js'

class Tidytree {
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
        let d = d3.hierarchy(data);
        d.dx = 10;
        d.dy = this.width / (d.height + 1);
        const root = d3.tree().nodeSize([d.dx, d.dy])(d);

        let x0 = Infinity;
        let x1 = -x0;
        root.each(d => {
            if (d.x > x1) x1 = d.x;
            if (d.x < x0) x0 = d.x;
        });

        const svg = d3.create("svg").attr("id", "diagram")
            .attr("viewBox", [0, 0, this.width, x1 - x0 + root.dx * 2]);

        const g = svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("transform", `translate(${root.dy / 3},${root.dx - x0})`);

        const link = g.append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5)
            .selectAll("path")
            .data(root.links())
            .join("path")
            .attr("d", d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x));

        const node = g.append("g")
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3)
            .selectAll("g")
            .data(root.descendants())
            .join("g")
            .attr("transform", d => `translate(${d.y},${d.x})`);

        node.append("circle")
            .attr("fill", d => {
                if(util.isSameNodeWithValuePath(this.sel, d)){
                    return util.selectedColor
                }
                return d.children ? "#555" : "#999"
            })
            .attr("r", 2.5);

        node.append("text")
            .attr("dy", "0.31em")
            .attr("x", d => d.children ? -6 : 6)
            .attr("text-anchor", d => d.children ? "end" : "start")
            .text(d => d.data.name)
            .clone(true).lower()
            .attr("stroke", "white");

        return svg.node()
    }

    ReDraw(data) {
        console.log("show tidy tree diagram")
        d3.select("#showBox").selectAll("svg").remove();

        let showBox = document.getElementById("showBox")
        this.width = showBox.clientWidth || showBox.offsetWidth
        const nodes = this.Chart(this.data)
        d3.select("#showBox").append(node => nodes);
    }
}

let tt = new Tidytree()
window.Draw.addAppListener("Tidy Tree", function (data) {
    tt.SetData(data)
    tt.ReDraw()
})

window.Draw.addSelectNodeListener("Tidy Tree", function (node) {
    tt.SetSelectNode(node)
    tt.ReDraw()
})

window.Draw.addNewFileListener("Tidy Tree", function (node) {
    return tt.newFile()
})

