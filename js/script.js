var dropdownValues = [];
var response = '';
document.getElementById("langTextArea").addEventListener('keypress', (e) => {
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
                        console.log(data[1][0][1][1]);
                        dropdownValues = data[1][0][1];
                        response = data[1][0][1][1] ? data[1][0][1][1] : data[1][0][1][0];
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
})

document.getElementById("langTextArea").addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById("dropdown").style.top = e.clientY + 'px';
    document.getElementById("dropdown").style.left = e.clientX + 'px';
    if (document.getElementById("dropdown").style.display === 'none') {
        fillDropdown();
        document.getElementById("dropdown").style.display = 'block';
    }
    else {
        document.getElementById("dropdown").style.display = 'none';
    }
});

document.getElementById("langTextArea").addEventListener('click', (e) => {
    document.getElementById("dropdown").style.display = 'none';
});

document.getElementById("dropdown").addEventListener("click", function() {
    let translatedText = document.getElementById('langTextArea').value;
    translatedText = translatedText.substring(0, translatedText.lastIndexOf(response));
    response = document.getElementById("dropdown").value;
    translatedText = translatedText + document.getElementById("dropdown").value;
    document.getElementById('langTextArea').value = translatedText;
});


function fillDropdown (e) {
    let select = document.getElementById("dropdown");
    document.getElementById("dropdown").innerHTML = "";
    for (let i = 0; i < dropdownValues.length; i++) {
        let option = document.createElement("option"),
            txt = document.createTextNode(dropdownValues[i]);
        option.appendChild(txt);
        option.setAttribute("value", dropdownValues[i]);
        select.insertBefore(option, select.lastChild);
    }
}
