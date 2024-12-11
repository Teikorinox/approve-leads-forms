// script.js
async function checkAuth() {
  try {
    const response = await fetch(`${BASE_URL}/check-auth`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Ошибка сервера при проверке авторизации');
    }

    const data = await response.json();
    const authStatus = document.getElementById('auth-status');
    const signInButton = document.getElementById('google-signin-button');
    const appContainer = document.getElementById('app-container');
    const authContainer = document.getElementById('auth-container');

    if (data.isAuthenticated) {
      authStatus.innerText = ``;
      signInButton.style.display = 'none';
      appContainer.style.display = 'block';
      authContainer.style.display = 'none';

      if (data.matches && data.matches.length > 0) {
        generateButtons(data.matches, data.email);
      }
    } else {
      authStatus.innerText = 'Вы не авторизованы. Пожалуйста, войдите:';
      signInButton.style.display = 'block';
      appContainer.style.display = 'none';
    }
  } catch (error) {
    console.error('Ошибка проверки авторизации:', error);
    document.getElementById('auth-status').innerText = 'Произошла ошибка. Попробуйте обновить страницу.';
  }
}

function generateButtons(matches, userEmail) {
  const container = document.getElementById('linkContainer');
  matches.forEach((match) => {
    const button = {
      url: `${match[1]}?email=${userEmail}`,
      name: match[0],
    };

    const div = document.createElement('div');
    div.style.marginBottom = '10px';
    const btn = document.createElement('button');
    btn.textContent = button.name;
    btn.className = 'button';
    btn.onclick = function () {
      const newWindow = window.open('', '_blank');
      const iframeContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
		      <meta name="viewport" content="width=device-width, initial-scale=1.0">
	      	<meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>${button.name}</title>
        </head>
        <body>
          <iframe src="${button.url}" frameborder="0" style="overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px" height="100%" width="100%"> </iframe>
        </body>
        </html>`;
      newWindow.document.write(iframeContent);
      newWindow.document.close();
    };
    div.appendChild(btn);
    container.appendChild(div);
  });
}

function redirectToGoogle() {
  window.location.href = `${BASE_URL}/auth/google`;
}

// Проверяем статус авторизации при загрузке
window.onload = checkAuth;

