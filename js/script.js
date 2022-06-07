var dropdownValues = [];
var response = '';
var cursorPosition = {};

// var mousePosition = {x:0, y:0};
// document.addEventListener('mousemove', function(mouseMoveEvent){
//   mousePosition.x = mouseMoveEvent.pageX;
//   mousePosition.y = mouseMoveEvent.pageY;
// }, false);

document.getElementById("langTextArea").addEventListener('keydown', (e) => {


    if (e.key === " " ||
        e.code === "Space" ||
        e.keyCode === 32 ||
        e.key === "Enter" ||
        e.keyCode === 13
    ) {
        let textContent = document.getElementById("langTextArea").value;
        let translatedText = textContent.substring(0, textContent.lastIndexOf(" "));
        let textToConvert = textContent.substring(textContent.lastIndexOf(" "));
        let patternHindi = /[\u0900-\u097F]/;
        if (patternHindi.test(textToConvert) || !textToConvert.replace(/\s/g, '').length
        ) {
            textToConvert = "";
        }
        if (textToConvert != "") {
            fetch(`https://www.google.com/inputtools/request?text=${textToConvert}&ime=transliteration_en_hi&num=5&cp=0&cs=0&ie=utf-8&oe=utf-8&app=jsapi&uv=a`).then(
                data => data.json()).then(
                    data => {
                        console.log(data);
                        console.log(data[1][0][1][0]);
                        dropdownValues.push(data[1][0][1]);

                        response = data[1][0][1][0] ? data[1][0][1][0] : data[1][0][1][1];
                        if (translatedText !== "") {
                            translatedText = translatedText + response + " ";
                        }
                        else {
                            translatedText = translatedText + response + " ";
                        }
                        document.getElementById('langTextArea').value = translatedText;
                    }
                )
        }
    }

    if (e.key === "Backspace" || e.keyCode === 8) {
        if (e.target.value ? e.target.value.length === 0 : 1) {
            return;
        }
        if (e.target.value.lastIndexOf(" ") === e.target.value.length - 1) {
            document.getElementById("dropdown").style.display = 'none';
            return;
        }
        else if (getSelectionText().length === e.target.value.length) {
            // all text selected.

            return;
        }
        else {
            if (document.getElementById("dropdown").style.display === 'none') {
                let value = document.getElementById('langTextArea').value;
                value = value.substring(value.lastIndexOf(" ") + 1);
                fillDropdown(value);
                document.getElementById("dropdown").style.top = 160 + (cursorPosition.start/90) * 15 + 'px';
                document.getElementById("dropdown").style.left = 150 + (cursorPosition.start * 10) + 'px';
                document.getElementById("dropdown").style.display = 'block';
                document.getElementById("dropdown").focus();
                // document.getElementById("dropdown").click();
            }
        }
    }
})

document.getElementById("langTextArea").addEventListener('click', (e) => {
    document.getElementById("dropdown").style.top = e.clientY + 'px';
    document.getElementById("dropdown").style.left = e.clientX + 'px';
    if (document.getElementById("dropdown").style.display === 'none') {
        fillDropdown(e.target.value);
        document.getElementById("dropdown").style.display = 'block';
    }
    else {
        document.getElementById("dropdown").style.display = 'none';
    }
});


document.getElementById("dropdown").addEventListener("change", function () {
    let translatedText = document.getElementById('langTextArea').value;
    let translatedTextBefore = translatedText.substring(0, cursorPosition.start);
    translatedTextBefore = translatedTextBefore.substring(0, translatedTextBefore.lastIndexOf(" "));
    let translatedTextAfter = translatedText.substring(cursorPosition.start);
    translatedTextAfter = translatedTextAfter.substring(translatedTextAfter.indexOf(" "));

    document.getElementById('langTextArea').value = translatedTextBefore + document.getElementById("dropdown").value + translatedTextAfter;
});

// document.getElementById("dropdown").addEventListener("onchange", function () {
//     let translatedText = document.getElementById('langTextArea').value;
//     let translatedTextBefore = translatedText.substring(0, cursorPosition.start);
//     translatedTextBefore = translatedTextBefore.substring(0, translatedTextBefore.lastIndexOf(" "));
//     let translatedTextAfter = translatedText.substring(cursorPosition.start);
//     translatedTextAfter = translatedTextAfter.substring(translatedTextAfter.indexOf(" "));

//     document.getElementById('langTextArea').value = translatedTextBefore + document.getElementById("dropdown").value + translatedTextAfter;
//     document.getElementById("dropdown").innerHTML = "";
//     document.getElementById("dropdown").style.display = 'none';
// });


function fillDropdown(value) {
    let select = document.getElementById("dropdown");
    document.getElementById("dropdown").innerHTML = "";
    cursorPosition = getCursorPosition(document.getElementById("langTextArea"))
    let text = getTheWord(cursorPosition.start, value);
    let index = dropdownValues.findIndex(x => x.includes(text));
    if(index === -1) {
        index = dropdownValues.length -1;
    }
    let dropdownValue = dropdownValues[index];
    for (let i = 0; i < dropdownValue.length; i++) {
        let option = document.createElement("option"),
            txt = document.createTextNode(dropdownValue[i]);
        option.appendChild(txt);
        option.setAttribute("value", dropdownValue[i]);
        select.insertBefore(option, select.lastChild);
    }
}


function getTheWord(i, sentence) {
    return sentence.substring(sentence.lastIndexOf(" ", i) === -1 ? 0 : sentence.lastIndexOf(" ", i), sentence.indexOf(" ", i) === -1 ? sentence.length : sentence.indexOf(" ", i));
}

function getCursorPosition(input) {
    if ("selectionStart" in input && document.activeElement == input) {
        return {
            start: input.selectionStart,
            end: input.selectionEnd
        };
    }
    else if (input.createTextRange) {
        var sel = document.selection.createRange();
        if (sel.parentElement() === input) {
            var rng = input.createTextRange();
            rng.moveToBookmark(sel.getBookmark());
            for (var len = 0;
                rng.compareEndPoints("EndToStart", rng) > 0;
                rng.moveEnd("character", -1)) {
                len++;
            }
            rng.setEndPoint("StartToStart", input.createTextRange());
            for (var pos = { start: 0, end: len };
                rng.compareEndPoints("EndToStart", rng) > 0;
                rng.moveEnd("character", -1)) {
                pos.start++;
                pos.end++;
            }
            return pos;
        }
    }
    return -1;
}

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}