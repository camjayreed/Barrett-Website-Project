// Real login page
document
  .getElementById("login_real_submit")
  .addEventListener("click", api_login_real);

async function api_login_real() {
  const username = document.getElementById("login_real").value;
  const password = document.getElementById("pass_real").value;

  const login = {
    username: username,
    password: password,
  };

  const response = await fetch("http://127.0.0.1:5000/real_login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(login),
  });

  const data = await response.json();
  const token = data.access_token;
  localStorage.setItem("access_token", token);

  console.log("login response json:", data);
  console.log("token from login:", data.access_token);
  localStorage.setItem("access_token", data.access_token);
  console.log("token stored now:", localStorage.getItem("access_token"));

  if (data.status === "ok") {
    // let them in
    window.location.replace("/");
  } else {
    // reject login
    console.log("Login failed");
  }
}
