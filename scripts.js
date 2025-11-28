

function apibuttonpress() {
    document.getElementById("bad_button").innerText = "you will pay for what youve done"
    fetch('http://127.0.0.1:5000/button_pressed')
}

document.getElementById("bad_button").addEventListener("click", apibuttonpress);


function apisendtext() {
    const text_data = document.getElementById('text_box').value
    fetch('http://127.0.0.1:5000/send_text', {
        method: "POST",
        body: text_data,
     
})}

document.getElementById("text_send").addEventListener("click", apisendtext)


function apilogin() {
    const username = document.getElementById("login_box").value
    const password = document.getElementById("password_box").value

    const login = {
       username: username,
       password: password,
    };

    fetch('http://127.0.0.1:5000/user_login', {
        method: "POST",
        body: JSON.stringify(login),
        headers: {
            "Content-Type": "application/json"
        },
        
    })
     
}



document.getElementById("login_submit").addEventListener("click", apilogin)