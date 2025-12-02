// Real login page
document.getElementById("login_real_submit").addEventListener("click", api_login_real)
function api_login_real() {
    const username = document.getElementById("login_real").value
    const password = document.getElementById("pass_real").value

    const login = {
       username: username,
       password: password,
    };

    fetch('http://127.0.0.1:5000/real_login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
    })
     
}


