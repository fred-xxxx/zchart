function transformPath2ValuePath(path, data) {
    let i = 0;
    let sp = [];
    let obj = data;
    sp.push(obj.name);
    for (; i < path.length - 1; i++) {
        if (path[i] === "children") {
            i++;
            obj = obj.children[path[i]];
        }
        sp.push(obj.name);
    }
    return sp;
}

function isSameNodeWithValuePath(path, node) {
    if (!path) {
        return false
    }

    let d = node;
    let i = path.length - 1;
    while (d.depth >= 1 && i >= 0) {
        if (d.data.name !== path[i]) {
            return false
        }
        d = d.parent;
        i--;
    }

    return d.data.name === path[i];
}

const selectedColor = "#FF0000"

export {
    transformPath2ValuePath,
    isSameNodeWithValuePath,
    selectedColor
}

