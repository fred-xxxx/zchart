// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type])
    }
})

const {ipcRenderer} = require('electron');
ipcRenderer.on('new', newFile);
ipcRenderer.on('open', openFile);
ipcRenderer.on('save', saveFile);
ipcRenderer.on('save-as-png', saveAsPng);
ipcRenderer.on('set-work-mode', setWorkMode);

function newFile(event, type) {
    let data = {"type": type, "content": ""}

    let listener = window.appListener.get(type)
    console.log("listener is", listener);
    if (listener && listener.newFile) {
        data.content = listener.newFile()
    }

    if (listener.draw) {
        listener.draw(data.content)
    }

    // show data to editor
    window.editor(data.content);

    window.fileData = data;
    console.log("new file", window.fileData)
}

function openFile(event, file) {
    const fs = require('fs')
    let content = fs.readFileSync(file, 'utf8').toString()
    if (!content) {
        console.log("read file", file, "fail")
    }

    let data = JSON.parse(content)
    window.fileData = data
    console.log("open file", window.fileData)

    // draw diagram
    let type = data.type
    let listener = window.appListener.get(type)
    console.log("listener is", listener);
    if (listener && listener.draw) {
        listener.draw(data.content)
    }

    // show data to editor
    window.editor(data.content)
}

function saveFile(event, file) {
    const fs = require('fs')
    let content = JSON.stringify(window.fileData)
    fs.writeFileSync(file, content)
}

function saveAsPng(event, file) {
    let saveAsPng = require('save-svg-as-png')

    let svg = document.getElementById("diagram")
    let options = {
        "left": svg.viewBox.animVal.x,
        "top": svg.viewBox.animVal.y,
        "width": svg.viewBox.animVal.width,
        "height": svg.viewBox.animVal.height
    };
    saveAsPng.svgAsPngUri(svg, options).then(uri => {
        let arr = uri.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            str = atob(arr[1]),
            n = str.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = str.charCodeAt(n);
        }

        const fs = require('fs')
        fs.writeFileSync(file, u8arr)
    })
}

function setWorkMode(event, mode) {
    if (mode === "data-diagram-mode") {
        document.getElementById("editBox").style.setProperty('display', 'block');
        document.getElementById("editBox").style.setProperty('width', '30%');
        document.getElementById("showBox").style.setProperty('width', 'calc(70% - 3px)');
    } else {
        document.getElementById("editBox").style.setProperty('display', 'none');
        document.getElementById("showBox").style.setProperty('width', '100%');
    }
}

const {contextBridge} = require('electron')
window.appListener = new Map()
contextBridge.exposeInMainWorld('Draw', {
    addAppListener: (name, callback) => {
        let listener = window.appListener.get(name)
        if (!listener) {
            listener = {draw: callback}
        } else {
            listener.draw = callback
        }

        window.appListener.set(name, listener)
    },

    addSelectNodeListener: (name, callback) => {
        let listener = window.appListener.get(name)
        if (!listener) {
            listener = {select: callback}
        } else {
            listener.select = callback
        }
        window.appListener.set(name, listener)
    },

    addNewFileListener: (name, callback) => {
        let listener = window.appListener.get(name)
        if (!listener) {
            listener = {newFile: callback}
        } else {
            listener.newFile = callback
        }
        window.appListener.set(name, listener)
    },
})

contextBridge.exposeInMainWorld('Edit', {
    addAppListener: e => {
        window.editor = e
    }
})

contextBridge.exposeInMainWorld('Update', {
    updateFileData: content => {
        console.log("update file data content", content)
        window.fileData.content = content
        let type = window.fileData.type;
        let listener = window.appListener.get(type);
        if (listener && listener.draw) {
            listener.draw(content)
        }
    },

    updateSelNode: node => {
        console.log("update selected node", node);
        let type = window.fileData.type;
        let listener = window.appListener.get(type);
        if (listener && listener.select) {
            listener.select(node)
        }
    }
})
