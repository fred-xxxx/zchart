const {app, dialog} = require('electron');

class AppMenu {
    constructor(win) {
        this.win = win;
        this.template = [{
            label: "&File",
            submenu: [{
                label: 'New',
                accelerator: 'CommandOrControl+N'
            }, {
                type: 'separator'
            }, {
                label: 'Open',
                accelerator: 'CommandOrControl+O',
                click: async => {
                    this.openFile()
                }
            }, {
                type: 'separator'
            }, {
                label: 'Save',
                accelerator: 'CommandOrControl+S'
            }, {
                label: 'Save As PNG',
                accelerator: 'CommandOrControl+Shift+S',
                click: async => {
                    this.saveAsPng()
                }
            }, {
                type: 'separator'
            }, {
                label: 'Close',
                accelerator: 'CommandOrControl+Q',
                click: async => {
                    app.quit()
                }
            }]
        }, {
            label: '&Mode',
            submenu: [{
                label: 'mind-map',
                accelerator: 'CommandOrControl+M'
            }]
        }, {
            label: '&View',
            submenu: [{
                label: 'data mode',
                type: 'radio'
            }, {
                label: 'diagram mode',
                type: 'radio'
            }, {
                label: 'data-diagram mode',
                type: 'radio'
            }]
        }, {
            label: '&About',
            submenu: [{
                label: 'register',
                accelerator: 'CommandOrControl+R'
            }, {
                label: 'logo in',
                accelerator: 'CommandOrControl+L'
            }, {
                label: 'about us',
                accelerator: 'CommandOrControl+A'
            }]
        }];
    }

    GetTemplate() {
        return this.template
    }

    openFile() {
        const {dialog} = require("electron");

        let options = {
            // See place holder 1 in above image
            title: "Open",

            // See place holder 2 in above image
            defaultPath: "./",

            // See place holder 3 in above image
            buttonLabel: "Open",

            // See place holder 4 in above image
            filters: [
                {name: 'zchart', extensions: ['zchart']},
                {name: 'All Files', extensions: ['*']}
            ],
            properties: ['openFile']
        }

        //Synchronous
        let filePaths = dialog.showOpenDialogSync(this.win, options)
        if (filePaths) {
            this.win.webContents.send('open', filePaths[0])
        }
    }

    saveAsPng() {
        const {dialog} = require("electron");

        let options = {
            // See place holder 1 in above image
            title: "Save",

            // See place holder 2 in above image
            defaultPath: "./",

            // See place holder 3 in above image
            buttonLabel: "Save",

            // See place holder 4 in above image
            filters: [
                {name: 'PNG', extensions: ['png']}
            ]
        }

        //Synchronous
        let filePath = dialog.showSaveDialogSync(this.win, options)
        if (filePath) {
            this.win.webContents.send('save-as-png', filePath)
        }
    }
}

module.exports = {AppMenu: AppMenu}
