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
ipcRenderer.on('open', readFile);
ipcRenderer.on('save-as-png', saveAsPng);

function readFile(event, file) {
    const fs = require('fs')
    let content = fs.readFileSync(file, 'utf8').toString()
    if (!content) {
        console.log("read file", file, "fail")
    }

    let data = JSON.parse(content)

    let callback = window.appListener.get('mind-map')
    callback(data)
}

function saveAsPng(event, file) {
    let saveAsPng = require('save-svg-as-png')
    saveAsPng.svgAsPngUri(document.getElementById("diagram")).then(uri =>{
        dataURLtoFile(uri, file)
    })
}

function dataURLtoFile(dataurl, file) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

    const fs = require('fs')
    fs.writeFileSync(file, u8arr)
}

window.appListener = new Map()

const {contextBridge} = require('electron')
const fs = require("fs");
contextBridge.exposeInMainWorld('API', {
    addAppListener: (name, callback) => {
        window.appListener.set(name, callback)
    }
})

