class AppMenu {
    constructor(win) {
        this.win = win;
        this.template = [{
            label: 'file',
            submenu: [{
                label: 'New'
            }, {
                label: 'Open',
                click: async => {
                    this.openFile()
                }
            }, {
                label: 'Close'
            }]
        }];
    }

    GetTemplate() {
        return this.template
    }

    openFile() {
        const {ipcMain, dialog} = require("electron");

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
            // console.log("open file", filePaths[0])
            this.win.webContents.send('mind-map', filePaths[0])
        }
    }
}

module.exports = {AppMenu: AppMenu}
