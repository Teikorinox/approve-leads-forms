async function checkAuth() {
      try {
        // Запрос к серверу для проверки авторизации
        const response = await fetch('https://approveleads-forms-backend.onrender.com/check-auth', {
          method: 'GET',
          credentials: 'include', // Передаем куки
        });

        if (!response.ok) {
          throw new Error('Ошибка сервера при проверке авторизации');
        }

        const data = await response.json();
        const authStatus = document.getElementById('auth-status');
        const signInButton = document.getElementById('google-signin-button');
        const userRightsDiv = document.getElementById('user-rights');
        const appContainer = document.getElementById('app-container');
        const authContainer = document.getElementById('auth-container');
        const userMailDiv = document.getElementById('user-email');
        const contLabel = document.getElementById('container-label');
        

        // Проверяем данные авторизации
        if (data.isAuthenticated) {
          authStatus.innerText = ``;
          signInButton.style.display = 'none';
          appContainer.style.display = 'block';
          authContainer.style.display = 'none';

          // Отображаем права доступа, если они найдены
          if (data.rights) {
          } else {
            userRightsDiv.innerText = 'Ваши права доступа не найдены.';
            contLabel.innerText = 'Ваши права доступа не найдены.';
          }

          // Генерация кнопок для форм
          if (data.matches && data.matches.length > 0) {
            userMailDiv.innerText = data.email;
            generateButtons(data.matches, data.email);
          } else {
          }
        } else {
          authStatus.innerText = 'Вы не авторизованы. Пожалуйста, войдите:';
          signInButton.style.display = 'block';
          appContainer.style.display = 'none';
        }
      } catch (error) {
        console.error('Ошибка проверки авторизации:', error);

        const authStatus = document.getElementById('auth-status');
        authStatus.innerText = 'Произошла ошибка. Попробуйте обновить страницу.';
      }
    }

    function generateButtons(matches, userEmail) {
      var container = document.getElementById('linkContainer');
      matches.forEach(function(match) {
        var button = {
          url: `${match[1]}?email=${userEmail}`,
          name: match[0]
        };

        var div = document.createElement('div');
        div.style.marginBottom = '10px';
        var btn = document.createElement('button');
        btn.textContent = button.name;  
        btn.className = 'button';
        btn.onclick = function() {
          var newWindow = window.open('', '_blank');
          var iframeContent = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                <title>${button.name}</title>
              </head>
              <body>
                <iframe id="myIframe" src="${button.url}"
                frameborder="0" style="overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px" height="100%" width="100%"> </iframe>
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
      // Редиректим на сервер для авторизации через Google
      window.location.href = 'https://approveleads-forms-backend.onrender.com/auth/google';
    }
    checkAuth();
