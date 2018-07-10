document.addEventListener("DOMContentLoaded", function () {
    /*
    #################################
    ###### External Functions #######
    #################################
    */

    // TODO: Create a Flash alert massage function that gets array and prints it on the web page.

    function alertMassages() {
        console.log("Alert massages! Something is not working. And I will not tell you what.")
    }

    function getAccountId() {
        const raw_account = parseInt(document.getElementById("account_id").value);

        if (raw_account >= 1 && raw_account <= 5000) {
            return raw_account;
        } else {
            document.getElementById("account_id").value = "Enter a valid account";
            return false;
        }
    }

    function jsonIsValid(json) {
        try {
            JSON.parse(json);
            return true;
        } catch (e) {
            return false;
        }
    }

    function getRequest() {
        const raw_request = document.getElementById("request").value;
        if (jsonIsValid(raw_request)) {
            const json_form_request = JSON.parse(raw_request);
            if (document.getElementById("ipr").checked) {
                json_form_request["ipr"] = true;
            }
            console.log(document.getElementById("request"));
            document.getElementById("request").value = JSON.stringify(json_form_request, null, 4);
            return JSON.stringify(json_form_request);
        } else {
            return false;
        }
    }

    function getCheckBoxes(name) {
        const values_dict = {};
        for (let i = 0; i < document.getElementsByName(name).length; i++) {
            if (document.getElementsByName(name)[i].checked) {
                const temp_array = document.getElementsByName(name)[i].value.split(":");
                values_dict[temp_array[0]] = temp_array[1];
            }
        }
        return values_dict;
    }

    function getRadio(name) {
        for (let i = 0; i < document.getElementsByName(name).length; i++) {
            if (document.getElementsByName(name)[i].checked) {
                if (document.getElementsByName(name)[i].value === "Custom") {
                    return document.getElementById(document.getElementsByName(name)[i].id + "_text").value;
                }
                return document.getElementsByName(name)[i].value;
            }
        }
    }

    function hasPing(url) {
        // TODO: Add a function to check if the server response to a ping request.
        console.log(url);
        return true;
    }

    function getURL() {
        const domainName = getRadio("env");
        const endPoint = getRadio("service");
        const URL = domainName + endPoint;
        const errorMessage = [false];

        // Validate the URL
        if (URL.toLowerCase().startsWith("https://") === false)
            errorMessage.push("Missing https:// at the beginning of the URL.");
        if (hasPing(URL) === false)
            errorMessage.push("Server not connected");

        // Returns the URL if validation passed.
        if (errorMessage.length <= 1)
            return [true, URL];
        else return errorMessage;
    }

    const getTestName = function () {
        const test_name = document.getElementById("test_name_to_save").value;
        if (test_name === "") {
            return "cashed_request";
        } else {
            return test_name;
        }

    };

    const getResponse = function () {
        return JSON.stringify(document.getElementById("request").value);
    };

    //
    // Information collectors
    //

    function submit() {
        // Function description:
        // Set error massage to errorMessages if something went wrong.
        // Information sent to server: request, URL, headers, username.
        // Variables definition:
        const errorMassages = [];

        // Get validate and :
        const request = getRequest();
        if (request === false) {
            errorMassages.push("JSON is malformed. Validate it in https://jsonformatter.curiousconcept.com/ and try again.")
        }

        // Get and validate URL.
        const URL = getURL();
        if (URL[0] === false) {
            for (let i = 1; i < URL.length; i++)
                errorMassages.push(URL[i]);
        }

        // Get headers
        const headers = getCheckBoxes("headers");

        // Get and validate account_id
        const username = getAccountId();
        if (username === false) {
            errorMassages.push("Invalid Account ID");
        }

        // Send Request using variables: (username, password, URL, request)
        if (errorMassages.length === 0) {
            send_request(username, URL, request, headers);
            return true;
        } else {
            alertMassages(errorMassages);
            return false;
        }
    }

    const send_request_information = function () {
        const errorMassages = [];

        const request = getRequest();
        const domainName = getRadio("env");
        const endPoint = getRadio("service");
        const headers = getCheckBoxes("headers");
        const username = getAccountId();
        const auth = true;
        const test_name = getTestName();
        const response = getResponse();

        const request_info = {
            "request_name": test_name,
            "request": request,// "{\"ipr\":true,\"priority\":\"high\",\"output\":{\"video\":[{\"video_type\":\"mp4\",\"quality\":26,\"height\":1080}]},\"timeline\":{\"scene_order\":\"linear\",\"scenes\":[{\"scene_id\":32372,\"text\":[{\"key\":\"test_name\",\"val\":[{\"text\":\"Empty text\",\"underline\":true}]},{\"key\":\"input_text\",\"val\":[{\"text\":\"\"}],\"alignment\":[\"center\",\"top\"],\"wrapping_shrink\":false,\"wrapping_breakline\":false,\"wrapping_minimum\":false,\"wrapping_truncate\":false,\"wrapping_truncate_string\":\"???\",\"right_to_left\":false,\"vertical\":false}]}]}}",
            "last_use": "",
            "last_response": response,
            "configuration": {
                "env": domainName,
                "service": endPoint,
                "headers": headers,
                "account_id": username,
                "auth": auth
            }
        };

        if (document.getElementById("send_test_request").checked) {
            if (submit() === false) {
                errorMassages.push("Failed to send request. Request did not saved.");
                alertMassages(errorMassages);
                return false;
            }
        }
        if (errorMassages.length === 0) {
            save_request(request_info);
            return true;
        } else {
            return false;
        }
    };


    /*
    #################################
    ######## Event Listeners ########
    #################################
    */

    document.getElementById("save_request").addEventListener("click", function (event) {
        event.preventDefault();
        if (send_request_information()) {
            console.log("Save Succeeded");
            // Flash alert: "Some errors in validation. Fix them and try again."
        } else {
            console.log("Save Failed");
            // Flash alert: "Some errors in validation. Fix them and try again."
        }
    });

    document.getElementById("request-save").addEventListener("click", function (event) {
        event.preventDefault();
        console.log("Open 'add-request' pop up window.");
        const pop_ups = document.querySelector(".pop-up.add-to-history");
        pop_ups.classList.remove("hidden");
    });

    for (const popup of document.querySelectorAll(".pop-up .close")) {
        popup.addEventListener("click", function (event) {
            event.preventDefault();
            this.parentElement.classList.add("hidden");
        })
    }

    document.getElementsByClassName("send_request")[0].addEventListener("click", function (event) {
        event.preventDefault();
        if (submit()) {
            console.log("Sending Succeeded");
        } else {
            console.log("Sending Failed");
        }
    });

    document.getElementById("add_header").addEventListener("click", function () {
            event.preventDefault();
            const raw_header = document.getElementById("custom_header").value;
            // validate the value
            // Have one ":" in the middle.
            // Add the header to the headers_stock

        }
    );

    const page_init = function() {
        for (const input of document.querySelectorAll(".request_control input")) {
            if (input.checked) {
                input.parentElement.classList.add("selected");
            } else {
                input.parentElement.classList.remove("selected");
            }
        }
    };

    for (let i = 0; i < document.getElementsByClassName("input_div").length; i++) {
        document.getElementsByClassName("input_div")[i].addEventListener("click", function () {
            page_init();
        });
    }

    const inputs = document.getElementsByTagName("input");
    for (let h = 0; h < inputs.length; h++) {
        if (inputs[h].type.toLowerCase() === "text") {
            inputs[h].addEventListener("focus", function () {
                if (this.value.includes("Enter")) {
                    this.value = "";
                }
            });
            inputs[h].addEventListener("blur", function () {
                if (this.value === "") {
                    this.value = "Enter input";
                }
            })
        }
    }
});


// {"ipr":true,"priority":"high","output":{"video":[{"video_type":"mp4","quality":26,"height":1080}]},"timeline":{"scene_order":"linear","scenes":[{"scene_id":32372,"text":[{"key":"test_name","val":[{"text":"Empty text","underline":true}]},{"key":"input_text","val":[{"text":""}],"alignment":["center","top"],"wrapping_shrink":false,"wrapping_breakline":false,"wrapping_minimum":false,"wrapping_truncate":false,"wrapping_truncate_string":"???","right_to_left":false,"vertical":false}]}]}}