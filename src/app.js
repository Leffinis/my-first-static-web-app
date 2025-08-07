const friendNames = ["Максим", "Леша", "Рапток", "Влад"];

const friendsContainer = document.getElementById("friends");
const template = document.getElementById("friend-template");

friendNames.forEach((name) => {
  const data = load(name);
  const clone = template.content.cloneNode(true);
  clone.querySelector(".name").textContent = name;

  const momentsList = clone.querySelector(".moments-list");
  data.moments.forEach((m) => addMomentDOM(momentsList, m));
  clone.querySelector(".moment-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = e.target.querySelector(".moment-text").value.trim();
    const file = e.target.querySelector(".moment-photo").files[0];
    if (!text && !file) return;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const moment = { text, photo: reader.result };
        data.moments.push(moment);
        save(name, data);
        addMomentDOM(momentsList, moment);
        e.target.reset();
      };
      reader.readAsDataURL(file);
    } else {
      const moment = { text };
      data.moments.push(moment);
      save(name, data);
      addMomentDOM(momentsList, moment);
      e.target.reset();
    }
  });

  const achievementsList = clone.querySelector(".achievements-list");
  data.achievements.forEach((a) => addAchievementDOM(achievementsList, a));
  clone
    .querySelector(".achievement-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      const text = e.target.querySelector(".achievement-text").value.trim();
      if (!text) return;
      data.achievements.push(text);
      save(name, data);
      addAchievementDOM(achievementsList, text);
      e.target.reset();
    });

  friendsContainer.appendChild(clone);
});

function load(name) {
  const json = localStorage.getItem("friend-" + name);
  return json ? JSON.parse(json) : { moments: [], achievements: [] };
}

function save(name, data) {
  localStorage.setItem("friend-" + name, JSON.stringify(data));
}

function addMomentDOM(list, moment) {
  const li = document.createElement("li");
  li.textContent = moment.text || "";
  if (moment.photo) {
    const img = document.createElement("img");
    img.src = moment.photo;
    li.appendChild(img);
  }
  list.appendChild(li);
}

function addAchievementDOM(list, text) {
  const li = document.createElement("li");
  li.textContent = text;
  list.appendChild(li);
}
