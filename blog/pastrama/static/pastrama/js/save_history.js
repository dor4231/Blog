const putInfoToForm = function(request_info) {
    const raw_data = JSON.parse(request_info);
    document.getElementById("request").value = JSON.stringify(JSON.parse(raw_data["request"]), null, 4);
    document.getElementById("account_id").value = raw_data.configuration.account_id;
};

const getRequestInformation = function(request_name) {
    console.log("Test name: " + request_name);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/request_history", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = function() {
        putInfoToForm(xhr.responseText);
    };
    xhr.send(request_name);
};

const createHistoryTile = function(history_list, request, test_description) {
    const div = document.createElement("div");
    const h4 = document.createElement("h4");
    const p = document.createElement("p");

    div.classList.add("history_tile");
    h4.innerHTML = request;
    p.innerHTML = test_description;
    div.appendChild(h4);
    div.appendChild(p);

    div.addEventListener("click", function(event) {
        getRequestInformation(this.childNodes[0].innerHTML);
    });

    history_list.appendChild(div);
} ;

const listHistoryRequests = function() {
    // Get the list of history requests and append it to the sidebar (History List).
    const xhr = new XMLHttpRequest();

    xhr.open("GET", "pastrama/api/request_history", true);
    xhr.onload = function () {
        let requests_names = xhr.responseText;
        const history_list = document.querySelector(".requests_store .list");


        requests_names = requests_names.substring(1, requests_names.length - 1);
        requests_names = requests_names.split(",");
        let temp_names = [];
        for (let name of requests_names) {
            name = name.trim();
            temp_names.push(name.substring(2, name.length - 1));
        }


        for (const request of temp_names) {
            createHistoryTile(history_list, request, "");
        }
    };

    xhr.send();
};

listHistoryRequests();