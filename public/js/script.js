// responsive navbar
const toggleButton = document.getElementsByClassName('toggle-button')[0] // admin panele özel bunun ayarına bakarsın
const navbarLinks = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
  navbarLinks.classList.toggle('active')
})
    
    function update(e) {
        let rowId = e.closest("tr").getAttribute("id");
        let rowInputs = document.getElementById(`${rowId}`).querySelectorAll("input");
        for (let i = 0; i < rowInputs.length; i++) {
            rowInputs[i].disabled = false;
            rowInputs[i].style = `
            border:1px solid blue;
            `;
        }
        // update görünmez save ve cancel görünür hale gelecek
        e.closest("tr").querySelector(".update").classList.add("hide");
        e.closest("tr").querySelector(".save").classList.remove("hide");
        e.closest("tr").querySelector(".cancel").classList.remove("hide");
    }

    function cancel(e) {
        let rowId = e.closest("tr").getAttribute("id");
        let rowInputs = document.getElementById(`${rowId}`).querySelectorAll("input");
        for (let i = 0; i < rowInputs.length; i++) {
            rowInputs[i].disabled = true;
            rowInputs[i].style = `
            border:none;
            `;
        }
        // update görünmez save ve cancel görünür hale gelecek
        e.closest("tr").querySelector(".update").classList.remove("hide");
        e.closest("tr").querySelector(".save").classList.add("hide");
        e.closest("tr").querySelector(".cancel").classList.add("hide");
    }

    function save(e) {
        let rowId = e.closest("tr").getAttribute("id");
        let rowInputs = document.getElementById(`${rowId}`).querySelectorAll("input");
        for (let i = 0; i < rowInputs.length; i++) {
            rowInputs[i].disabled = true;
            rowInputs[i].style = `
            border:none;
            `;
        }
        e.closest("tr").querySelector(".update").classList.remove("hide");
        e.closest("tr").querySelector(".save").classList.add("hide");
        e.closest("tr").querySelector(".cancel").classList.add("hide");
    }

    const sendHttpRequest = (method, url, data) => {
        const promise = new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url);

            xhr.responseType = 'json';

            if (data) {
                xhr.setRequestHeader('Content-Type', 'application/json');
            }

            xhr.onload = () => {
                if (xhr.status >= 400) {
                    reject(xhr.response);
                } else {
                    resolve(xhr.response);
                }
            };

            xhr.onerror = () => {
                reject('Something went wrong!');
            };

            xhr.send(JSON.stringify(data));
        });
        return promise;
    };

    function deleteP(productId) {
        let r = confirm("Silmek istediğinize emin misiniz ?");
        if (r == true) {
            sendHttpRequest('POST', '/delete', { id: productId })
                .then(responseData => {
                    console.log(responseData);
                })
                .catch(err => {
                    console.log(err);
                });
            window.location.href = window.location.href;
        }else{
            return;
        }

    };

    function search() {
       let searchedName =  document.querySelector(".searchName").value;
        sendHttpRequest('POST', '/search', {searchedName:searchedName})
                .then(responseData => {
                    console.log("response",responseData);
                })
                .catch(err => {
                    console.log(err);
                });
    }

    function clearTdRow(){
        let tdRows = document.querySelectorAll(".tdRow");
        for(let i = 0;i < tdRows.length;i++){
            tdRows[i].parentElement.removeChild(tdRows[i])
        }
    }