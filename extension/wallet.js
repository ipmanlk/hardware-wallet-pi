const handleAutoFill = () => {
  if (window.location.href.includes("lms.tech.sjp.ac.lk")) {
    document.querySelector("#username").value = "username";
    document.querySelector("#password").value = "password";
  }
};

window.addEventListener("DOMContentLoaded", () => {
  handleAutoFill().catch(console.error);
});
