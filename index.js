const apiUrl = 'http://localhost:3000';
const authUrl = `${apiUrl}/auth`;
const userUrl = `${apiUrl}/users`;
const lolUrl = `${apiUrl}/lol`;

const lastChampSelected = '';

(async () => {
  const getJwt = async () => {
    const tokenObj = await fetch(`${authUrl}/login`, {
      method: 'POST',
      body: JSON.stringify({ firstName: 'Charlely', password: 'password' }),
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => response.json());

    return tokenObj.token;
  }

  const jwt = await getJwt();

  document.getElementById('get-champ-list').addEventListener('click', async () => {
    const champNames = await fetch(`${lolUrl}/champion-names`, { headers: { Authorization: `Bearer ${jwt}` }}).then((response) => response.json());

    const ul = document.getElementById('champ-name-list');
    for (const name of champNames) {
      const li = document.createElement('li');
      li.appendChild(document.createTextNode(name));
      ul.appendChild(li);
    }

    document.getElementById('champ-names').style.display = 'block';
  });

  document.getElementById('champ-name-list').addEventListener('click', async (event) => {
    const champName = event.target.innerHTML;

    // Image handling
    const champImgContainer = document.getElementById('champ-img');
    champImgContainer.innerHTML = '';

    const img = document.createElement('img');
    img.src = `${apiUrl}/assets/${champName}_0.jpg`;
    img.onload = () => champImgContainer.append(img)
    img.onerror = () => {
      const span = document.createElement('span');
      span.innerText = 'Failed to load the champ image';
      champImgContainer.append(span);
    }

    // Champ lore handling
    const champLoreDiv = document.getElementById('champ-lore');
    const champLoreContainer = champLoreDiv.querySelector('span');
    const champLoreResponse = await fetch(
      `${lolUrl}/champion-lore/${champName}`,
      { headers: { Authorization: `Bearer ${jwt}` }}
    );

    let loreText = 'Lore not found';
    if (champLoreResponse.status === 200) {
      const jsonResponse = await champLoreResponse.json();
      loreText = jsonResponse.champLore;
    }

    champLoreContainer.innerText = loreText;
    champLoreDiv.style.display = 'block';
  })
})();