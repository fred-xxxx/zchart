class MindMap {
    constructor() {
    }

    ReDraw(data) {
        const svg = d3.select("svg"),
            width = +svg.attr("width"),
            height = +svg.attr("height"),
            g = svg.append("g").attr("transform", "translate(40,0)");

        const tree = d3.tree()
            .size([height, width - 160]);

        const root = d3.hierarchy(data);

        const link = g.selectAll(".link")
            .data(tree(root).links())
            .enter().append("path")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5)
            .attr("d", d3.linkHorizontal()
                .x(function (d) {
                    return d.y;
                })
                .y(function (d) {
                    return d.x;
                }));

        let node = g.selectAll(".node")
            .data(root.descendants())
            .enter().append("g")
            .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        node.append("circle")
            .attr("r", 2.5)
            .attr("fill", function (d) {
                return d.children ? "#555" : "#999";
            })

        node.append("text")
            .attr("dy", 3)
            .attr("x", function (d) {
                return d.children ? -8 : 8;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3)
            .text(function (d) {
                return d.data.name;
            });
    }
}

let MM = new MindMap()
window.API.addAppListener("mind-map", MM.ReDraw)


