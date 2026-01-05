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

  document.getElementById("user").innerText = `Welcome: ${capitalize(data)}`;

  const article_button_create = document.createElement("button");
  article_button_create.innerText = "Upload Article";
  article_button_create.id = "article_button";
  document.body.appendChild(article_button_create);

  document
    .getElementById("article_button")
    .addEventListener("click", upload_article);
}

// Uploading Articles
async function upload_article() {
  // making an input field to enter article links
  const article_link = document.createElement("input");
  article_link.innerText = "";
  article_link.id = "article_link";
  document.body.appendChild(article_link);

  // making a button to submit and send article data
  const article_submit = document.createElement("button");
  article_submit.innerText = "Submit";
  article_submit.id = "article_submit";
  document.body.appendChild(article_submit);

  // on clicking article_submit button we store the article link entered, and send the link along with the current logged on users name to our backend
  document
    .getElementById("article_submit")
    .addEventListener("click", async () => {
      const link = document.getElementById("article_link").value;

      // grabbing username for our article
      const response = await fetch("http://127.0.0.1:5000/current_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const username = await response.json();

      const article = {
        username: username,
        link: link,
      };

      fetch("http://127.0.0.1:5000/article_upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
      });
    });
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
