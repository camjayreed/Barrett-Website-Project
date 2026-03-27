// Real register page
document
  .getElementById("register_submit")
  .addEventListener("click", api_register);
function api_register() {
  const username = document.getElementById("register_user").value;
  const password = document.getElementById("register_pass").value;

  const login = {
    username: username,
    password: password,
  };

  fetch("http://localhost:8080/register_user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(login),
  });

  window.setTimeout(() => {
    window.location.replace("/");
  }, 100); // wait 100ms then redirect to root
}
