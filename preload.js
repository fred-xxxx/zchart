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
ipcRenderer.on('mind-map', function (event, file) {
    let data = readFile(file)

    let callback = window.appListener.get('mind-map')
    callback(data)
});

function readFile(file) {
    const fs = require('fs')
    let content = fs.readFileSync(file, 'utf8').toString()
    if (!content) {
        console.log("read file", file, "fail")
    }

    return JSON.parse(content)
}

window.appListener = new Map()

const {contextBridge} = require('electron')
contextBridge.exposeInMainWorld('API', {
    addAppListener: (name, callback) => {
        window.appListener.set(name, callback)
    }
})

