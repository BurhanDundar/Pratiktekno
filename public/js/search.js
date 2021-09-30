
//     const sendHttpRequest = (method, url, data) => {
//         const promise = new Promise((resolve, reject) => {
//             const xhr = new XMLHttpRequest();
//             xhr.open(method, url);

//             xhr.responseType = 'json';

//             if (data) {
//                 xhr.setRequestHeader('Content-Type', 'application/json');
//             }

//             xhr.onload = () => {
//                 if (xhr.status >= 400) {
//                     reject(xhr.response);
//                 } else {
//                     resolve(xhr.response);
//                 }
//             };

//             xhr.onerror = () => {
//                 reject('Something went wrong!');
//             };

//             xhr.send(JSON.stringify(data));
//         });
//         return promise;
//     };

//     async function search() {
//        let searchedName =  document.querySelector(".searchName").value;
//         await sendHttpRequest('POST','/search', {searchedName:searchedName})
//                 .then((responseData) => {
//                     console.log("a",JSON.parse(responseData))
//                 })
//                 .catch(err => {
//                     console.log(err);
//                 });
//     }



//  function dynamicSearch(data){
//      console.log("data",data);
//     let html = "";
//  for(let i=0;i < products.length;i++) { 
//      html += `<div class="productListContainer">
//      <a href="${products[i].productLink}" class="productList">
//          <img class="productImageFront" src="/uploads/${products[i].productImage}" alt="">
//          <div class="productDescription">${products[i].productName}</div>
//      </a>
//  </div>`
//  } 

//  document.querySelector(".parentProductContainer").innerHTML = html;
//  }
