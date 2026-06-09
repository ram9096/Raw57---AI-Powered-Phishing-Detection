
iziToast.settings({
  timeout: 3000,
  position: "topRight",
  transitionIn: "fadeInDown",
  transitionOut: "fadeOutUp",
  progressBar: true,
  close: true
});

window.showError = function (message) {
  iziToast.error({
    title: "Login Failed",
    message: message||"Something went wrong",
    position: "topRight",
    timeout: 3000,

   
    backgroundColor: "#15171d",
    titleColor: "#ff4d4f",
    messageColor: "#d1d5db",


    iconColor: "#ff4d4f",
    progressBarColor: "#ff4d4f",

  
    closeOnClick: true,
    pauseOnHover: true,

    
    transitionIn: "fadeInDown",
    transitionOut: "fadeOutUp"
  });
};

window.showSuccess = function (message) {
  iziToast.success({
    title: "Success",
    message: message,
    position: "topRight",
    timeout: 2500,

    backgroundColor: "#15171d",
    titleColor: "#1fbc55",
    messageColor: "#d1d5db",

    iconColor: "#1fbc55",
    progressBarColor: "#1fbc55",

    closeOnClick: true,
    pauseOnHover: true
  });
};