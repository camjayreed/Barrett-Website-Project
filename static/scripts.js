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

  document.getElementById("user").innerText = `${capitalize(data)}`;
  document.getElementById("login").innerText = "Logout";
  document.getElementById("login").id = "logout";
  document.getElementById("logout").href = "/";
  document.getElementById("logout").addEventListener("click", logout);

  const article_button_create = document.createElement("button");
  article_button_create.innerText = "Upload Article";
  article_button_create.id = "article_button";
  const upload_location = document.getElementById("upload_articles");
  upload_location.appendChild(article_button_create);

  document
    .getElementById("article_button")
    .addEventListener("click", upload_article);

  document.getElementById("h4").removeAttribute("hidden");
  document.getElementById("article_list").removeAttribute("hidden");
}

function logout() {
  console.log("Logged Out");
  const response = fetch("http://127.0.0.1:5000/logout", {
    method: "POST",
  });
}

// Uploading Articles
async function upload_article() {
  const token = localStorage.getItem("access_token");

  // making an input field to enter article links
  const article_title = document.createElement("input");
  article_title.innerText = "Article Title";
  article_title.id = "article_title";
  document.body.appendChild(article_title);

  const article_link = document.createElement("input");
  article_link.innerText = "Article Link";
  article_link.id = "article_link";
  document.body.appendChild(article_link);

  const article_title_text = document.createElement("span");
  article_title_text.innerText = "Article Title: ";
  article_title_text.id = "article_title_text";
  document.body.appendChild(article_title_text);

  const article_link_text = document.createElement("span");
  article_link_text.innerText = "Article Link: ";
  article_link_text.id = "article_link_text";
  document.body.appendChild(article_link_text);

  document.getElementById("article_title_text").removeAttribute("hidden");
  document.getElementById("article_link_text").removeAttribute("hidden");

  // making a button to submit and send article data
  const article_submit = document.createElement("button");
  article_submit.innerText = "Submit";
  article_submit.id = "article_submit";
  document.body.appendChild(article_submit);

  // on clicking article_submit button we store the article link entered, and send the link along with the current logged on users name to our backend
  document
    .getElementById("article_submit")
    .addEventListener("click", async () => {
      const title = document.getElementById("article_title").value;
      const link = document.getElementById("article_link").value;

      // grabbing username for our article
      const response = await fetch("http://127.0.0.1:5000/current_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const username = await response.json();

      const article = {
        title: title,
        username: username,
        link: link,
      };

      const token = localStorage.getItem("access_token");
      console.log("UPLOAD token:", token);
      console.log("UPLOAD url:", "http://127.0.0.1:5000/article_upload");

      fetch("http://127.0.0.1:5000/article_upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(article),
      });
    });
}

let intervalId;
let time = 0;
// ripping our timer from tilefrenzy for reuse
function timer() {
  time -= 1;
  console.log(time)

  if (time == 0) {
    clearInterval(intervalId);
    intervalId = null;
    window.location.href = "/"
  }
}

// Homepage api button
document.getElementById("bad_button").addEventListener("click", apibuttonpress);
function apibuttonpress() {
  document.getElementById("bad_button").innerText =
    "you will pay for what youve done";

  // yes im aware this looks incredible lmao i will not be fixing it because i dont believe that i can make the gif background transparent and i just dont care
  const fake_bsod = document.createElement("img");
  fake_bsod.setAttribute("src", "/static/media/fake_bluescreen.png");
  fake_bsod.setAttribute("alt", "fake_bsod");
  fake_bsod.setAttribute("id", "fake_bsod_img");
  document.body.appendChild(fake_bsod);

  const fake_load = document.createElement("img");

  fake_load.setAttribute("src", "/static/media/fake_loading.gif"); // i have no idea what the gif flashes for text at the end, work laptops input lag timing is wild and im not waiting 10s per try
  fake_load.setAttribute("alt", "fake_load");
  fake_load.setAttribute("id", "fake_load_gif");
  document.body.appendChild(fake_load);

  // below this comment we need a timer so that when our gif is finished loading we go back to index
  time = 10
  intervalId ??= setInterval(timer, 1000);

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
// grabs the articles from our database and displays them
document.getElementById("test_button").addEventListener("click", grab_articles);
async function grab_articles() {
  const token = localStorage.getItem("access_token");
  const response = await fetch("http://127.0.0.1:5000/article_posting", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json(); // this gives us the data for our entire database
  console.log(data);

  data.forEach(([id, title, username, link]) => {
    // creating the elements
    const div = document.createElement("div");

    const span1 = document.createElement("span"); // Title
    const span2 = document.createElement("span"); // Username
    const br = document.createElement("br"); // Line Break
    const del_article = document.createElement("button"); // Delete Button
    const article_link = document.createElement("a"); // Link

    div.id = `article_${id}`;
    div.classList.add("article_div");

    span1.id = `article_${title}`;
    span1.innerText = title + " :";
    span1.classList.add("article_title");

    span2.id = `user_${username}`;
    span2.innerText = "Submitted By: " + capitalize(username);
    span2.classList.add("article_user");

    del_article.id = `article_del`;
    del_article.innerText = "Delete";
    del_article.classList.add("del_article");
    del_article.setAttribute("data-article-id", id);
    const del_button = del_article;

    // add data to our button, it holds the id of the article

    // now we can add a listener for buttons, if a button with the id article_del is pressed
    // then we pull the data from that button and then send it to the backend for deletion, also need to find a way to remove it from frontend

    article_link.href = `${link}`;
    article_link.innerHTML = `${link}`;
    article_link.classList.add("article_link");

    // show the elements
    h4.appendChild(div);

    div.appendChild(span1);
    div.appendChild(span2);
    div.appendChild(br);
    div.appendChild(del_article);
    div.appendChild(article_link);

    del_button.addEventListener("click", delete_article);

    return del_button;
  });
}

function delete_article(event) {
  const token = localStorage.getItem("access_token");
  const button = event.currentTarget; // gpt honestly had to help me get here
  const articleId = button.dataset.articleId; // i tried a bunch but i could never seem to get anything to return for my id

  console.log("delete article:", articleId);

  fetch("http://127.0.0.1:5000/article_delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(articleId),
  });

  // Source - https://stackoverflow.com/a
  // Posted by Andy E, modified by community. See post 'Timeline' for change history
  // Retrieved 2026-01-13, License - CC BY-SA 4.0
  document.querySelectorAll(`#article_${articleId}`).forEach(function (node) {
    node.remove();
    console.log("deleted");
  });
}
