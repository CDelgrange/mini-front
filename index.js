(() => {
  const makeRequest = async () => {
    fetch('http://localhost:3000/users')
      .then((response) => response.json())
      .then((data) => alert(JSON.stringify(data, null, 2)));
  }

  document.getElementById("ajaxButton").addEventListener('click', makeRequest);
})();