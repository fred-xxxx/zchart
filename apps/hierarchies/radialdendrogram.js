import * as util from "./util.js";

class RadialDendrogram {
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
        let r = this.width / 2
        const root = d3.cluster()
            .size([2 * Math.PI, r - 100])
            (d3.hierarchy(data)
                .sort((a, b) => d3.ascending(a.data.name, b.data.name)));

        const svg = d3.create("svg").attr("id", "diagram");

        svg.append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5)
            .selectAll("path")
            .data(root.links())
            .join("path")
            .attr("d", d3.linkRadial()
                .angle(d => d.x)
                .radius(d => d.y));

        svg.append("g")
            .selectAll("circle")
            .data(root.descendants())
            .join("circle")
            .attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0)
      `)
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
            .attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90}) 
        translate(${d.y},0) 
        rotate(${d.x >= Math.PI ? 180 : 0})
      `)
            .attr("dy", "0.31em")
            .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
            .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
            .text(d => d.data.name)
            .clone(true).lower()
            .attr("stroke", "white");

        return svg.attr("viewBox", this.autoBox).node();
    }

    ReDraw(data) {
        d3.select("#showBox").selectAll("svg").remove();
        const nodes = this.Chart(this.data)
        d3.select("#showBox").append(node => nodes);
    }
}

let rd = new RadialDendrogram()
window.Draw.addAppListener("Radial Dendrogram", function (data) {
    rd.SetData(data)
    rd.ReDraw()
})

window.Draw.addSelectNodeListener("Radial Dendrogram", function (node) {
    rd.SetSelectNode(node)
    rd.ReDraw()
})

window.Draw.addNewFileListener("Radial Dendrogram", function (node) {
    return rd.newFile()
})



