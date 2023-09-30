const CLIENT_ID = "Iv1.b7d448bd3fc4d84e";
const loginWithGithub = function () {
  console.log("Hello");
  window.location.assign(
    `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`
  );
};
document.addEventListener("DOMContentLoaded", function () {
  const myButton = document.getElementById("butt");
  if (myButton) {
    myButton.addEventListener("click", loginWithGithub);
  }
});
