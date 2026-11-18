
// ======================================
// MULTI-CHILD IPC SIMULATOR
// ======================================

// Add communication messages to the log
function addLog(message) {
    const logs = document.getElementById("logs");

    if (logs.textContent === "No communication yet.") {
        logs.innerHTML = "";
    }

    const entry = document.createElement("p");
    entry.textContent = message;
    logs.prepend(entry);
}


// ======================================
// MESSAGE COMMUNICATION ANIMATION
// ======================================

function communicate(child, request, response, resultElement) {

    const childBox = document.getElementById("child" + child);
    const pipe = document.getElementById("pipe" + child);

    if (!childBox || !pipe) return;

    // Prevent repeated requests to the same child
    if (childBox.dataset.busy === "true") {
        addLog("Child " + child + " is already processing a request.");
        return;
    }

    childBox.dataset.busy = "true";

    // Reset previous animation
    pipe.classList.remove("sending", "returning");

    // Highlight active child
    childBox.classList.add("active");

    // STEP 1: Parent sends request
    pipe.classList.add("sending");

    resultElement.textContent =
        "Sending request to Child " + child + "...";

    addLog("Parent → Child " + child + ": " + request);

    // STEP 2: Child receives request
    setTimeout(() => {

        pipe.classList.remove("sending");

        resultElement.textContent =
            "Child " + child + " received request. Processing...";

        addLog("Child " + child + ": Request received.");

        // STEP 3: Child processes request
        setTimeout(() => {

            // STEP 4: Child sends response back
            pipe.classList.add("returning");

            resultElement.textContent =
                "Sending response back to Parent...";

            addLog("Child " + child + " → Parent: Sending response.");

            // STEP 5: Parent receives response
            setTimeout(() => {

                pipe.classList.remove("returning");

                childBox.classList.remove("active");

                resultElement.textContent = response;

                addLog("Parent received response from Child " +
                    child + ": " + response);

                childBox.dataset.busy = "false";

            }, 700);

        }, 500);

    }, 700);
}


// ======================================
// CHILD 1 AND CHILD 2 CALCULATIONS
// ======================================

function calculate(child) {

    const aInput = document.getElementById("a" + child);
    const bInput = document.getElementById("b" + child);

    const resultElement =
        document.getElementById("result" + child);

    if (aInput.value === "" || bInput.value === "") {
        alert("Please enter both numbers.");
        return;
    }

    const a = Number(aInput.value);
    const b = Number(bInput.value);

    const operation =
        document.getElementById("op" + child).value;

    let result;
    let symbol;

    // CHILD 1: Addition and Subtraction
    if (child === 1) {

        if (operation === "add") {
            result = a + b;
            symbol = "+";
        } else {
            result = a - b;
            symbol = "-";
        }

    }

    // CHILD 2: Multiplication and Division
    else if (child === 2) {

        if (operation === "multiply") {
            result = a * b;
            symbol = "×";
        } else {

            if (b === 0) {
                alert("Cannot divide by zero.");
                return;
            }

            result = a / b;
            symbol = "÷";
        }

    } else {
        return;
    }

    const request = `${a} ${symbol} ${b}`;
    const response = `Result: ${result}`;

    communicate(
        child,
        request,
        response,
        resultElement
    );
}


// ======================================
// CHILD 3: TEXT COMMUNICATION
// ======================================

function sendMessage() {

    const input = document.getElementById("message");

    const message = input.value.trim();

    const resultElement =
        document.getElementById("result3");

    if (message === "") {
        alert("Please enter a message.");
        return;
    }

    communicate(
        3,
        message,
        "Message received: " + message,
        resultElement
    );

    input.value = "";
}
