// TODO: Send information to web.py instead of Idomoo API.

const send_request = function (username, URL, request, headers) {
    const xhr = new XMLHttpRequest();
    const request_info = {
        account_id: username,
        url: URL,
        headers: headers,
        request_data: request,
        options: {
            ipr: true,
            auth: true
        }
    };

    xhr.open("POST", "pastrama/api/send-request", true);

    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = function () {
        const response = JSON.parse(xhr.responseText);
        document.getElementById("response").classList.remove("loading");
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.table(response);

            document.getElementById("response").value = JSON.stringify(response, null, 4);
        } else {
            console.error(response);
        }
    };

    xhr.onerror = function () {
        document.getElementById("response").value = xhr.responseText;
    };
    xhr.send(JSON.stringify(request_info));
    document.getElementById("response").classList.add("loading");
};


const save_request = function (request_to_save) {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", "pastrama/api/save_request", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = function () {
        const response = xhr.responseText;

        console.log(response);
    };

    xhr.send(JSON.stringify(request_to_save));
};

