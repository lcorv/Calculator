window.onload = () => {
    const qs = (el) => document.querySelector(el);
    const ce = (el) => document.createElement(el)
    calculator = {};
    let dark = qs("#dark");
    let display = qs('.display');
    let resultDisp = qs('.result');
    let operationDisp = qs('.operation');
    let settings = qs('.settings');
    let modal = qs('.modal');
    let close = qs('.close');
    let modalContainer = qs('.modal-container');

    //settings vars
    var colors = {
        red: "#f66",
        blue: "#46a",
        fandango: "#b38",
        green: "#4c7",
        tealGreen: "#198",
        grey: "#99a",
        indigo: "#3bf",
        magenta: "#f3d",
        orange: "#e73",
        pink: "#d99",
        floral: "#bad",
        yellow: "#ca2"
    }
    var vibrate = 0;
    //calculator vars
    calculator.rootTemp = '';
    calculator.root = false;
    calculator.power = false;
    calculator.pow = '';
    calculator.radic = '';
    calculator.temp;
    calculator.operation = '';
    calculator.symbolsArray = [
        "AC",
        "0",
        ".",

    ]
    calculator.actionsArray = [
        "!",
        "π",
        "Bin",
        `x&#8319;`,
        "√",
        "%",
        "x²",
        "(",
        ")"
    ]
    calculator.operators = {
        "÷": "/",
        "x": "*"
    }
    calculator.operatorsArray = [
        "Ans", "<=", "÷", "•", "-", "+", "="
    ]
    calculator.numbersArray = [
        "7", "8", "9", "4", "5", "6", "1", "2", "3"
    ]
    //render button
    calculator.render = (cont, arr) => {
        for (string of arr) {
            let sym = string;
            let btn = document.createElement('div');

            if (calculator.numbersArray.includes(string) || string == 0) {
                btn.classList.add('num')
            }
            btn.classList.add('btn');
            btn.classList.add('ripple');
            if (string == "<=") {
                btn.innerHTML = `<i class="fa fa-solid fa-delete-left"></i>`
            }
            else {
                btn.innerHTML = string;
            }
            btn.addEventListener('click', () => calculator.calc(sym))
            cont.appendChild(btn)
        }
    }
    //calculator function
    calculator.calc = (symbol) => {
        resultDisp.classList.remove('done');
        qs('.sym').classList.remove('done');
        window.navigator.vibrate(vibrate);
        if (!calculator.numbersArray.includes(symbol) && symbol !== '0' && symbol !== "(" && symbol !== ")") {
            if (checkSame(symbol)) {
                return
            }
        }
        if (symbol == 'x&#8319;') {
            symbol = '^'
        }
        if (symbol == 'Ans') {
            answer();
            return;
        }
        if (symbol == 'Bin') {
            res = resultDisp.innerHTML;
            if (res[res.length - 1] === "b") {
                return
            }
            bin = (res >>> 0).toString(2);
            resultDisp.innerHTML = bin + "b"
            return
        }
        if (symbol == '=') {
            if (calculator.root || calculator.power) {
                calculator.pow = '';
                calculator.power = false;
                calculator.root = false;
                calculator.radic = '';
            }
            getResult();
            if (qs('.resultDiv')) {
                qs('.resultDiv').style.fontSize = '30px'
                resultDisp.classList.add('done');
                qs('.sym').classList.add('done');
            }
            /*
            console.log((calculator.operation));
            console.log(formatOp(calculator.operation))
            */
        }
        else {
            if (symbol == 'AC') {
                reset();
                return
            }
            if (symbol == '<=') {
                if (calculator.root == true) {
                    calculator.operation.replace(`Math.sqrt(${calculator.radic})`, '');
                    calculator.root = false;
                    displayOp();
                    getResult();
                    return
                }
                else {
                    let co = calculator.operation;
                    if (co[co.length - 1] == '²') {
                        calculator.power = false;
                        calculator.pow = '';
                    }
                    if (co[co.length - 1] == '√') {
                        calculator.root = false;
                        calculator.radic = '';
                    }
                    calculator.operation = calculator.operation.slice(0, -1);
                    operationDisp.innerHTML = operationDisp.innerHTML.slice(0, -1);
                    displayOp();
                    getResult();
                    return
                }
            }
            if (symbol == '%') {
                calculator.operation += '%';
                return
            }
            if (symbol == '√' && calculator.root == false) {
                calculator.root = ''
                calculator.temp = calculator.operation;
                if (calculator.numbersArray.includes(calculator.temp[calculator.temp.length - 1])) {
                    calculator.temp += "•"
                }
                calculator.operation = calculator.temp + `√(${calculator.radic}`
                calculator.root = true;
                displayOp();
                getResult();
                return
            }
            if (calculator.root == true) {
                if (calculator.numbersArray.includes(symbol)) {
                    calculator.radic += symbol;
                    calculator.operation = calculator.temp + `√(${calculator.radic}`
                }
                else {
                    calculator.root = false
                    calculator.radic = '';
                    calculator.temp = '';
                }
            }
            if (symbol == 'x²' && calculator.power == false) {
                calculator.temp = calculator.operation;
                if (calculator.numbersArray.includes(calculator.temp[calculator.temp.length - 1])) {
                    calculator.temp += "•"
                }
                calculator.operation = calculator.temp + `(${calculator.pow})²`
                calculator.power = true;
                displayOp();
                getResult();
                return
            }
            if (calculator.power == true) {
                if (calculator.numbersArray.includes(symbol) || symbol == "." || symbol == '0') {
                    calculator.pow += symbol;
                    calculator.operation = calculator.temp + `(${calculator.pow})²`
                }
                else {
                    calculator.power = false
                    calculator.pow = '';
                    calculator.temp = '';
                }
            }
            if (!calculator.power && !calculator.root) {
                calculator.operation += symbol
            }
            displayOp();
            getResult();
        }
    }
    //get the result of the operation and display
    function getResult() {
        try {
            if (calculator.operation == '') {
                resultDisp.innerHTML = '';
            }
            else {
                let evalOp = eval(formatOp(calculator.operation));
                resultDisp.innerHTML = evalOp.toString().length > 8 && evalOp % 1 !== 0 ? evalOp.toFixed(8) : evalOp;
            }
        }
        catch {

        }
    }
    //format operation in Javascript
    function formatOp(op) {
        //square root
        let re = /√\((.*?)\)/g;
        //pow2
        let rep = /([^a-z]|^)\((.*?)\)²/g;
        //pi with number
        let repi = /([0-9+])π/g
        //pi
        let repi1 = /π/g;
        //pow
        let repow = /(\(.*\)|\d*\.?\d+?)\^(\(.*?\)|\-*π*\d\.*\d*)/g;
        //factorial
        let refact = /(\(.*?\)|\d*?)\!/g;
        op = op.replaceAll(repi, `$1*3.14159265`)
        op = op.replaceAll(repi1, "3.14159265");
        op = op.replaceAll(re, `Math.sqrt($1)`);
        op = op.replaceAll('•', '*');
        op = op.replaceAll('÷', '/');
        op = op.replaceAll('%', '*0.01*');
        op = op.replaceAll(refact, `rFact($1)`)
        op = op.replaceAll(repow, `Math.pow($1,$2)`);
        op = op.replaceAll(rep, `$1Math.pow($2,2)`);
        return op
    }
    //factorial function
    function rFact(num) {
        if (num === 0) { return 1; }
        else { return num * rFact(num - 1); }
    }
    //ans function
    function answer() {
        calculator.operation = resultDisp.innerHTML;
        displayOp();
    }
    //reset operations
    function reset() {
        calculator.operation = '';
        calculator.radic = '';
        calculator.temp = '';
        operationDisp.innerHTML = '';
        resultDisp.innerHTML = '';

    }
    //don't repeat symbols
    function checkSame(sym) {
        let co = calculator.operation;
        if (sym == co[co.length - 1]) {
            return true;
        }
    }
    //display operation on the screen and autoresize font
    function displayOp() {
        operationDisp.innerHTML = '';
        let div = document.createElement('div');
        div.className = 'resultDiv';
        div.style.fontSize = '20cqw';
        let repow = /(\(.*?\)|\d*\.*\d*)\^(\(.*?\)|\-*[\π|\d*]\.*\d*)/g;
        let recom = /(\d+\.\d+|[\+,\-,\÷,\•]|^)\./g;
        calculator.operation = calculator.operation.replaceAll(recom, `$1`);
        calculator.operation = calculator.operation.replaceAll(/^[•,÷,!,\^,\),\%]/g, '');
        calculator.operation = calculator.operation.replaceAll(/^[0]([0-9*])|([\+,\-,\•,\÷])[0]([0-9*])/g, `$2$1$3`);
        let opDisp = calculator.operation;
        opDisp = opDisp.replaceAll(repow, `$1<sup>$2</sup>`);
        div.innerHTML = opDisp;
        operationDisp.appendChild(div)
        let ratio = operationDisp.clientWidth / div.clientWidth;
        if (ratio < 1) {
            let newSize = Math.round(20 * ratio) - 1;
            div.style.fontSize = newSize + 'cqw';
        }
    }
    //display buttons
    let actions = qs('.actions')
    calculator.render(actions, calculator.actionsArray)
    let operations = qs('.operations');
    calculator.render(operations, calculator.operatorsArray)
    let numbers = qs('.numbers');
    calculator.render(numbers, calculator.numbersArray)
    let symbols = qs('.symbols');
    calculator.render(symbols, calculator.symbolsArray)
    //modal
    function closeModal() {
        modal.style.animation = '';
        modal.style.animation = 'close 0.2s forwards';
        window.setTimeout(() => {
            modalContainer.style.display = 'none';
            modalContainer.style.animation = 'closeModal 0.1s 1 forwards';
            modalContainer.style.animation = '';
        }, 200)
    }
    function openModal() {
        modal.style.animation = 'open 0.2s forwards'
        modalContainer.style.display = 'flex';
    }
    //open modal
    settings.addEventListener('click', () => {
        openModal();
    })
    //close modal
    close.addEventListener('click', () => {
        closeModal();
    })
    modalContainer.addEventListener('click', () => {
        closeModal();
    })
    modal.addEventListener('click', (e) => {
        e.stopPropagation()
    })
    qs("#vibrate").addEventListener('change', () => {
        vibrate = qs("#vibrate").value;
        qs(".output").innerHTML = `${vibrate}ms`
        window.navigator.vibrate(vibrate)
    })
    qs("#color").addEventListener('change', () => {
        document.documentElement.style.setProperty('--one',
            colors[qs('#color').value])
    })
    dark.addEventListener('change', () => {
        if (dark.checked) {
            document.documentElement.style.setProperty('--primary', 'var(--one)');
            document.documentElement.style.setProperty('--background', 'var(--two)');
            document.documentElement.style.setProperty('--text', 'var(--three)')
        }
        else {
            document.documentElement.style.setProperty('--primary', 'var(--three)');
            document.documentElement.style.setProperty('--background', 'var(--one)');
            document.documentElement.style.setProperty('--text', 'var(--two)')
        }
    })
    let ripples = document.querySelectorAll('.ripple');
    //adding ripple effect
    ripples.forEach((ripple) => {
        ripple.addEventListener('pointerdown', (e) => {
            let pointerX = e.offsetX;
            let pointerY = e.offsetY;
            let point = ce('div');
            point.className = 'ripple-active';
            point.style.left = pointerX + 'px';
            point.style.top = pointerY + 'px';
            ripple.appendChild(point);
            window.setTimeout(() => {
                ripple.removeChild(point);
            }, 1000)
        })
    })
}
