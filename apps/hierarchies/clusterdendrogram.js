import * as util from './util.js'

class ClusterDendrogram {
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

    autoBox() {
        document.body.appendChild(this);
        const {x, y, width, height} = this.getBBox();
        document.body.removeChild(this);
        return [x, y, width, height];
    }

    Chart(data) {
        console.log("cluster diagram data is", data);
        let d = d3.hierarchy(data).sort((a, b) =>
            d3.descending(a.height, b.height) || d3.ascending(a.data.name, b.data.name));
        d.dx = 10;
        d.dy = this.width / (d.height + 1);
        const root = d3.cluster().nodeSize([d.dx, d.dy])(d);

        const svg = d3.create("svg").attr("id", "diagram");

        svg.append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5)
            .selectAll("path")
            .data(root.links())
            .join("path")
            .attr("d", d => `
        M${d.target.y},${d.target.x}
        C${d.source.y + root.dy / 2},${d.target.x}
         ${d.source.y + root.dy / 2},${d.source.x}
         ${d.source.y},${d.source.x}
      `);

        svg.append("g")
            .selectAll("circle")
            .data(root.descendants())
            .join("circle")
            .attr("cx", d => d.y)
            .attr("cy", d => d.x)
            .attr("fill", d => {
                if(util.isSameNodeWithValuePath(this.sel, d)){
                    return util.selectedColor
                }
                return d.children ? "#555" : "#999"
            })
            .attr("r", 2.5);

        svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3)
            .selectAll("text")
            .data(root.descendants())
            .join("text")
            .attr("x", d => d.y)
            .attr("y", d => d.x)
            .attr("dy", "0.31em")
            .attr("dx", d => d.children ? -6 : 6)
            .text(d => d.data.name)
            .filter(d => d.children)
            .attr("text-anchor", "end")
            .clone(true).lower()
            .attr("stroke", "white");

        return svg.attr("viewBox", this.autoBox).node();
    }

    ReDraw() {
        d3.select("#showBox").selectAll("svg").remove();
        const nodes = this.Chart(this.data)
        d3.select("#showBox").append(node => nodes);
    }
}

let cd = new ClusterDendrogram()
window.Draw.addAppListener("Cluster Dendrogram", function (data) {
    cd.SetData(data)
    cd.ReDraw()
})

window.Draw.addSelectNodeListener("Cluster Dendrogram", function (node) {
    cd.SetSelectNode(node)
    cd.ReDraw()
})

window.Draw.addNewFileListener("Cluster Dendrogram", function (node) {
    return cd.newFile()
})

