function displayError(message) {
  let intervalId;
  if (!message) {
    return
  }
  clearInterval(intervalId);
  const body = document.querySelector('body');
  const error = document.querySelector('.error');

  if (error) {
    return;
  }

  let div = document.createElement('div');
  let p = document.createElement('p');

  div.appendChild(p);
  body.appendChild(div)

  p.innerHTML = message;
  div.classList.add('error');
  div.classList.add("error-animation");
  intervalId = setTimeout(() => {
    div.remove();
  }, 3000);
}

export default displayError;