class Editor {
    constructor() {
        let container = document.getElementById("editBox");
        const options = {
            onChangeJSON: this.Update,
            onEvent: this.Selected,
            language:"en"
        }
        this.editor = new JSONEditor(container, options);
    }

    Show(data) {
        this.data = data
        this.editor.set(data);
    }

    Update(data) {
        window.Update.updateFileData(data)
    }

    Selected(node, event) {
        if (!node.value || event.type != "mousedown") {
            return
        }

        window.Update.updateSelNode(node.path)
    }
}

let ed = new Editor()
window.Edit.addAppListener(function (data) {
    ed.Show(data)
})