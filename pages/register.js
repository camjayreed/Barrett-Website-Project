// Real register page
document.getElementById("register_submit").addEventListener("click", api_register)
function api_register() {
    const username = document.getElementById("register_user").value
    const password = document.getElementById("register_pass").value

    const login = {
       username: username,
       password: password,
    };

    fetch('http://127.0.0.1:5000/register', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
    })
     
}