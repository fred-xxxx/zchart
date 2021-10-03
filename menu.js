const {app, dialog} = require('electron');

class AppMenu {
    constructor(win) {
        this.win = win;
        this.isNewFile = false;
        this.fileName = "";
        this.workMode = "diagram-mode";
        this.template = [{
            label: "&File",
            submenu: [{
                label: 'New',
                accelerator: 'CommandOrControl+N',
                submenu: [{
                    label: 'Tidy Tree',
                    click: async => {
                        this.newFile('Tidy Tree')
                    }
                }, {
                    label: 'Radial Tidy Tree',
                    click: async => {
                        this.newFile('Radial Tidy Tree')
                    }
                }, {
                    label: 'Cluster Dendrogram',
                    click: async => {
                        this.newFile('Cluster Dendrogram')
                    }
                }, {
                    label: 'Radial Dendrogram',
                    click: async => {
                        this.newFile('Radial Dendrogram')
                    }
                }, {
                    label: 'Sunburst',
                    click: async => {
                        this.newFile('Sunburst')
                    }
                }, {
                    label: 'Icicle',
                    click: async => {
                        this.newFile('Icicle')
                    }
                }]
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
                accelerator: 'CommandOrControl+S',
                click: async => {
                    this.saveFile()
                }
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
            label: '&View',
            submenu: [{
                label: 'Data-Diagram Mode',
                type: 'checkbox',
                accelerator: 'CommandOrControl+Shift+D',
                click: async => {
                    this.setWorkMode()
                }
            }],
        }, {
            label: '&Help',
            submenu: [{
                label: 'Help',
                accelerator: 'CommandOrControl+H',
                click: async => {
                    this.help()
                }
            }, {
                label: 'Donate',
                accelerator: 'CommandOrControl+D'
            }, {
                type: 'separator'
            }, {
                label: 'About Us',
                accelerator: 'CommandOrControl+A'
            }]
        }];
    }

    GetTemplate() {
        return this.template;
    }

    newFile(type) {
        this.isNewFile = true;
        this.fileName = "";
        this.win.webContents.send('new', type);
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
            this.isNewFile = false
            this.fileName = filePaths[0]
        }
    }

    saveFile() {
        if (this.isNewFile) {
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
                    {name: 'zchart', extensions: ['zchart']}
                ]
            }

            //Synchronous
            let filePath = dialog.showSaveDialogSync(this.win, options)
            if (filePath) {
                this.isNewFile = false;
                this.fileName = filePath;
                this.win.webContents.send('save', filePath)
            }
        } else {
            this.win.webContents.send('save', this.fileName)
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

    setWorkMode() {
        if (this.workMode === "diagram-mode") {
            this.workMode = "data-diagram-mode";
        } else {
            this.workMode = "diagram-mode";
        }
        this.win.webContents.send('set-work-mode', this.workMode);
    }

    help() {
        const shell = require('electron').shell
        shell.openExternal('https://github.com/z-galaxy/zchart/blob/main/help/manual_cn.md')
    }
}

module.exports = {AppMenu: AppMenu}
