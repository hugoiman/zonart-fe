import {baseURL, token} from "../general/env.js";

function getCustomer() {
    let result = $.ajax({
        url: `${baseURL}/api/customer`,
        type: "GET",
        headers: { Authorization: `Bearer ${token}`},
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function updateCustomer(username, email, nama) {
    let jsonData = JSON.stringify({
        username,
        email,
        nama,
    });
    let result = $.ajax({
        url: `${baseURL}/api/customer`,
        type: "PUT",
        headers: { Authorization: `Bearer ${token}`},
        data: jsonData,
        contentType: "application/json",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

function changePassword(oldPassword, newPassword) {
    let jsonData = JSON.stringify({
        oldPassword,
        newPassword,
    });
    let result = $.ajax({
        url: `${baseURL}/api/change-password`,
        type: "PUT",
        headers: { Authorization: `Bearer ${token}`},
        data: jsonData,
        contentType: "application/json",
        success: function (resp) {},
        error: function (error) {},
    });
    return result;
}

export {getCustomer, updateCustomer, changePassword};





























// async function getCustomer() {
//     try {
//       const response = await fetch("http://localhost:8080/api/customer", {
//         method: "GET",
//         headers: {
//           Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZEN1c3RvbWVyIjozLCJ1c2VybmFtZSI6ImFzZGYiLCJleHAiOjE2MTI2OTE4OTh9.9ev298LVlHf4_rVtLAeeyQ3yfTcKg_uYXlOMPnBcTfU"
//         }
//       });
//       const responseJson = await response.json();
//       return responseJson;
//     } catch(error) {
//       console.log(error);
//     }
// }

// const customer = callback => {
//     $.ajax({
//         url: "http://localhost:8080/api/customer",
//         type: "GET",
//         headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZEN1c3RvbWVyIjozLCJ1c2VybmFtZSI6ImFzZGYiLCJleHAiOjE2MTI2OTE4OTh9.9ev298LVlHf4_rVtLAeeyQ3yfTcKg_uYXlOMPnBcTfU"},
//         success: function (resp) {
//             callback(resp);
//         },
//         error: function (error) {
//           console.log(error);
//         },
//     });
// }
