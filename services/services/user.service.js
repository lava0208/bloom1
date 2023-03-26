import { apiUrl } from 'config';
// Add this line to your existing import statement
import { createCheckoutSession } from "services/subscriptionService";

export const userService = {
    getById,
    login,
    register,
    update,
    delete: _delete,
    setId,
    getId,
    currentUser,
    getUser,
    removeUser,
    getSubscription,
    updateUserSubscription
};

const baseUrl = `${apiUrl}/auth`;

async function getById(id) {
    try {
        const response = await fetch(`${baseUrl}/user?id=` + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        return response.json();
    } catch (error) {
        console.log(error)
    }
}

async function login(params) {
    try {
        const response = await fetch(`${baseUrl}/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(params)
        })
        return response.json();
    } catch (error) {
        console.log(error)
    }
}

async function register(params) {
    try {
        const response = await fetch(`${baseUrl}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(params)
        })
        return response.json();
    } catch (error) {
        console.log(error)
    }
}

async function update(id, params) {
    try {
        const response = await fetch(`${baseUrl}/user?id=` + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(params)
        })
        return response.json();
    } catch (error) {
        console.log(error);
    }
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(id) {
    const response = await fetch(`${baseUrl}/user?id=` + id, {
        method: "Delete",
        headers: {
            "Content-Type": "application/json"
        }
    })
    return response.json();
}

function setId(data){
    if (typeof window !== 'undefined') {
        return localStorage.setItem("userid", data);
    }    
}

function getId(){
    if (typeof window !== 'undefined') {
        return localStorage.getItem("userid");
    }
}

function currentUser(data){
    if (typeof window !== 'undefined') {
        return localStorage.setItem("user", data);
    }
}

function getUser(){
    if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem("user"))
    }
}

function removeUser(){
    localStorage.removeItem("user");
    localStorage.removeItem("userid");
}



// Add the new function
async function getSubscription(userId) {
  const response = await fetch(`${baseUrl}/subscription?user_id=` + userId, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
  return response.json();
}

// Add the new function
async function updateUserSubscription(userId, subscriptionId) {
    const response = await fetch(`${baseUrl}/subscription?user_id=` + userId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId }),
    });
    return response.json();
  }
  