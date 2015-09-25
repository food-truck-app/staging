$(document).ready(function () {
  function logout() {
    sessionStorage.clear();
    window.location = '/';
  }

  $('#logout').click(function() {
    logout();
  });
});