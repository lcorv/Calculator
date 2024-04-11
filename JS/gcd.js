window.onload = () => {
    //creating shortcut
    qs = (el) => document.querySelector(el);

    //select node elements
    let display = qs('.display');
    let details = qs('.details');
    let inputsContainer = qs('.inputs-container');
    let addBtn = qs('#add');
    let removeBtn = qs('#remove');
    let form = qs('form');
    let reset = qs('.clear');
    let info = qs('.fa-info');
    let modal = qs('.modal');
    let close = qs('.close');
    let modalContainer = qs('.modal-container')

    window.setTimeout(() => { openModal(); }, 500);

    //get inputs values and calculate GCD
    function calculateGCD() {
        let inputs = document.querySelectorAll('input');
        GCD = inputs[0].value;
        inputs.forEach((input) => {
            let next = input.value;
            GCD = getGCD(GCD, next);
        })
        return GCD;
    }

    //calculte GCD of two numbers
    function getGCD(aVal, bVal) {
        if (aVal && bVal) {
            while (bVal != 0) {
                let temp = bVal;
                bVal = aVal % bVal;
                aVal = temp
            }
            return aVal;
        }
        else
        //display error
        {
            display.innerHTML = '';
            let error = document.createElement('div');
            error.className = 'error';
            error.innerHTML = 'Please fill the form';
            display.appendChild(error)
        }
    }

    //display GCD and details
    function displayGCD() {
        let result = calculateGCD();
        if (result != undefined) {
            display.innerHTML = ''
            details.innerHTML = ''
            let div = document.createElement('div');
            div.className = 'gcd'
            //display GCD
            div.innerHTML = calculateGCD();
            display.appendChild(div);
            let inputs = document.querySelectorAll('input');
            inputs.forEach((input) => {
                let a = input.value;
                //display details
                details.innerHTML += `${a} : ${result} = ${a / result}<br>`
            })
        }
    }

    //adding event listeners
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        displayGCD();
        reset.focus()
    })

    //clear fields
    form.addEventListener('reset', () => {
        let inputs = document.querySelectorAll('input');
        display.innerHTML = '';
        details.innerHTML = ''
    })

    //add new input
    add.addEventListener('click', () => {
        let input = document.createElement('input');
        input.type = 'number'
        num = inputsContainer.children.length + 1
        input.id = 'n' + num;
        if (num == 3) {
            input.placeholder = num + "rd number"
        }
        else {
            input.placeholder = num + "th number"
        }
        inputsContainer.appendChild(input)
    })

    //remove last input
    removeBtn.addEventListener('click', () => {
        let inputs = document.querySelectorAll('input');
        if (inputs.length > 2) {
            let last = inputs[inputs.length - 1]
            last.style.animation = 'close 0.2s 1 forwards';
            window.setTimeout(() => {
            try{
                last.parentNode.removeChild(last);
                displayGCD();
                }
            catch{
            }
            }, 200)
        }
    })
    function closeModal() {
        modalContainer.style.animation = 'closeModal 0.1s 1 forwards';
        window.setTimeout(() => {
            modalContainer.style.display = 'none';
            modalContainer.style.animation = '';
        }, 100)
    }
    function openModal() {
        modalContainer.style.display = 'flex';
    }
    //open modal
    info.addEventListener('click', () => {
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

}

