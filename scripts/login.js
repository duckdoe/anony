import isLoading from "./loading.js";
import displayError from "./displayError.js";

const submitBtn = document.querySelector('.js-submit-btn');
const regex = /[\d]/;

submitBtn.addEventListener('click', async (e) => {
  e.preventDefault()
  const username = document.querySelector('.js-username');
  const password = document.querySelector('.js-password');


  if (!username.value || !password.value) {
    displayError("Seems like you forgot to fill something");
    return;
  };


  let payload = {
    username: username.value,
    password: password.value,
  }

  if (submitBtn.innerHTML == "Sign up") {
    const containsNumber = password.value.search(regex);


    if (password.value.length < 8) {
      displayError("Password must be atleast 8 characters");
      return;
    };

    if (containsNumber == -1) {
      displayError("Password must contain atleast one number");
      return;
    }

    let content = isLoading(document.querySelector('.js-submit-btn'), {
      loading: true,
      size: '20'
    });

    try {
      const res = await fetch('https://anony-backend-1-je2e.onrender.com/signup', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: new Headers({
          "Content-Type": "application/json",

        }),
        credentials: "include",
      });

      const data = await res.json();
      if (res.status != 200 && res.status != 201) {
        let message = data.error;
        message = message[0].toUpperCase() + message.slice(1);
        displayError(message);
        isLoading(document.querySelector('.js-submit-btn'), {
          loading: false,
          content: content,
        });
      };

      isLoading(document.querySelector('.js-submit-btn'), {
        loading: false,
        content: content,
      });
    } catch (err) {
      const errMessage = String(err).split(' ').splice(1).join(' ');
      displayError(errMessage);
      isLoading(document.querySelector('.js-submit-btn'), {
        loading: false,
        content: content,
      });
    }
    return;
  }
  let content = isLoading(document.querySelector('.js-submit-btn'), {
    loading: true,
    size: '20'
  })


  username.value = '';
  password.value = '';

  try {
    const res = await fetch('https://anony-backend-1-je2e.onrender.com/login', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: new Headers({
        "Content-Type": "application/json",

      }),
      credentials: "include",
    });

    const data = await res.json();
    if (res.status != 200) {
      let message = data.error;
      message = message[0].toUpperCase() + message.slice(1);
      displayError(message);
      isLoading(document.querySelector('.js-submit-btn'), {
        loading: false,
        content: content,
      });
      return;
    };

    localStorage.setItem("token", `Bearer ${data.token}`);
    isLoading(document.querySelector('.js-submit-btn'), {
      loading: false,
      content: content
    });

    const url = new URL(`${window.location}${data.redirect}`);
    const searchParams = url.search;

    window.location.href = `${window.origin}/anony/messages.html${searchParams}`;
  } catch (err) {
    const errMessage = String(err).split(' ').splice(1).join(' ');
    displayError(errMessage);
    isLoading(document.querySelector('.js-submit-btn'), {
      loading: false,
      content: content,
    });
  }
});
const formInputs = document.querySelectorAll('form input');

formInputs.forEach((inputs) => {
  inputs.addEventListener('focus', (e) => {
    const inputWrapper = inputs.parentElement;
    inputWrapper.classList.add('in-focus');
  });

  inputs.addEventListener('blur', (e) => {
    const inputWrapper = inputs.parentElement;
    inputWrapper.classList.remove('in-focus');
  });
})

const authFlow = document.querySelectorAll('.auth-flow');
authFlow.forEach(flow => {
  flow.addEventListener('click', (e) => {
    authFlow.forEach(item => {
      item.classList.remove('active');
    });
    e.target.classList.add('active');

    const authType = e.target.dataset.authType;

    if (authType == 'signup') {
      document.querySelector('.submit-btn').innerHTML = 'Sign up';
      document.querySelector('header h1').innerHTML = "Create an account";
    } else if (authType == 'login') {
      document.querySelector('.submit-btn').innerHTML = 'Login';
      document.querySelector('header h1').innerHTML = "Welcome Back";
    }
  })
})