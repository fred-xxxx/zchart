function moveDividingLine() {
    let editBox = document.getElementById('editBox');
    let dividingLine = document.getElementById('dividingLine');
    let showBox = document.getElementById('showBox');
    const minReservedWidth = 100

    dividingLine.addEventListener("mousedown", function (ev) {
        let dx = ev.clientX;
        let editWidth = editBox.offsetWidth;
        let showWidth = showBox.offsetWidth;

        document.onmousemove = function (ev) {
            let diff = ev.clientX - dx;
            if (minReservedWidth < (editWidth - diff) && minReservedWidth < (showWidth + diff)) {
                let editPct = Math.round((editWidth - diff) * 100 / (editWidth + showWidth))
                let showPct = 100 - editPct

                editBox.style.width = editPct + '%';
                showBox.style.width = "calc(" + showPct + "% - 3px)";
            }

            return false;
        };

        document.onmouseup = function (ev) {
            document.onmousemove = null;
            document.onmouseup = null;
        };

        return false;
    })
}

moveDividingLine()



