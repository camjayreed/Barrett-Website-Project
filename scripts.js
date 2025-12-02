
// Homepage api button
document.getElementById("bad_button").addEventListener("click", apibuttonpress);
function apibuttonpress() {
    document.getElementById("bad_button").innerText = "you will pay for what youve done"
    fetch('http://127.0.0.1:5000/button_pressed')
}


// Homepage send text api
document.getElementById("text_send").addEventListener("click", apisendtext)
function apisendtext() {
    const text_data = document.getElementById('text_box').value
    fetch('http://127.0.0.1:5000/send_text', {
        method: "POST",
        body: text_data,
     
})}


// Homepage "fake" login
document.getElementById("login_submit").addEventListener("click", apilogin)
function apilogin() {
    const username = document.getElementById("login_box").value
    const password = document.getElementById("password_box").value

    const login = {
       username: username,
       password: password,
    };

    fetch('http://127.0.0.1:5000/user_login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
    })
     
}


