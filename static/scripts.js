// Function to capitalize users name
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Display current logged in user
async function check_current_user() {
  const response = await fetch("http://127.0.0.1:5000/current_user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  console.log(data);

  document.getElementById("user").innerText = `Welcome: ${capitalize(
    data.username
  )}`;
}

// Homepage api button
document.getElementById("bad_button").addEventListener("click", apibuttonpress);
function apibuttonpress() {
  document.getElementById("bad_button").innerText =
    "you will pay for what youve done";
  fetch("http://127.0.0.1:5000/button_pressed");
}

// Homepage send text api
document.getElementById("text_send").addEventListener("click", apisendtext);
function apisendtext() {
  const text_data = document.getElementById("text_box").value;
  fetch("http://127.0.0.1:5000/send_text", {
    method: "POST",
    body: text_data,
  });
}
