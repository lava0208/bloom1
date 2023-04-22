import { apiUrl } from 'config';



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


const forgotPassword = async (email) => {
    const response = await fetch(`${baseUrl}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: "POST_RESET", email }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "An error occurred while resetting the password");
    }

    return data;
};

const resetPassword = async (token, password) => {
    const response = await fetch(`${baseUrl}/user/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "An error occurred while updating the password");
    }

    return data;
};

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
        console.log('API response:', response); // Log the response object
        return response.json();
    } catch (error) {
        console.log(error);
    }
}

async function cancelSubscription(id) {
    const user = await getById(id);
    if (user.subscriptionId) {
      try {
        await stripe.subscriptions.del(user.subscriptionId);
        const updatedUser = { ...user, share_custom_varieties: false, subscriptionId: null };
        await update(id, updatedUser);
        return { success: true };
      } catch (error) {
        console.log(error);
        return { success: false, error };
      }
    } else {
      return { success: false, error: 'No subscription found for this user' };
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
    cancelSubscription,
    removeUser,
    forgotPassword,
    resetPassword
};