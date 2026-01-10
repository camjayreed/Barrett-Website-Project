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

// Uploading Articles
async function upload_article() {
  // making an input field to enter article links
  const article_title = document.createElement("input");
  article_title.innerText = "Article Title";
  article_title.id = "article_title";
  document.body.appendChild(article_title);

  const article_link = document.createElement("input");
  article_link.innerText = "Article Link";
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
// grabs the articles from our database and displays them
document.getElementById("test_button").addEventListener("click", grab_articles);
async function grab_articles() {
  const response = await fetch("http://127.0.0.1:5000/article_posting", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json(); // this gives us the data for our entire database
  console.log(data);

  data.forEach(([id, title, username, link]) => {
    // creating the elements
    const div = document.createElement("div");

    const span1 = document.createElement("span"); // Title
    const span2 = document.createElement("span"); // Username
    const article_link = document.createElement("a"); // Link

    div.id = `article_${id}`;

    span1.id = `article_${title}`;
    span1.innerText = title;

    span2.id = `user_${username}`;
    span2.innerText = username;

    article_link.href = `${link}`;
    article_link.innerHTML = `${link}`;

    // styling

    // show the elements
    h4.appendChild(div);

    div.appendChild(span1);
    div.appendChild(span2);
    div.appendChild(article_link);
  });

  // basically create our html objects with our data, and then ++ to our id to do the next data
  // loop through database 1 at a time, if id of entry is ever == to 0 then we know it ran through them all so we break

  // dynamically apply css to every item, attach the username to the top right, a darkblue background to standout, possibly a border
}

// store data here, with this we just need to create the actual articles
//  const articles = document.createElement("article");
//  articles.innerText = "data["link"]";
//  articles.innerText = "data["username"];
//  articles.id = "data["link"]"
//  document.body.appendChild(articles);
//}
