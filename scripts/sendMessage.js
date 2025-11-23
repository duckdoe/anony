import isLoading from "./utils/loading.js";
import displayError from "./utils/displayError.js";

const submitBtn = document.querySelector('.js-submit-btn');

let previousContent = document.querySelector('.content').innerHTML;
submitBtn.addEventListener('click', async () => {
  const message = document.querySelector('#message');

  if (submitBtn.innerHTML == "Send Another") {
    document.querySelector('.content').innerHTML = previousContent;
    submitBtn.innerHTML = "Send";
    return;
  };

  let payload = {
    message: message.value
  }

  message.value = '';

  let content = isLoading(submitBtn, {
    loading: true,
    size: '20'
  });

  isLoading(document.querySelector('.content'), {
    size: "30",
  })

  try {

    const res = await fetch(`https://anony-backend-hawkf.onrender.com/send-message${window.location.search}`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: new Headers({
        "Content-Type": "application/json"
      })
    });


    const data = await res.json();

    if (res.status != 200 && res.status != 201) {
      displayError(data.error);
      isLoading(submitBtn, {
        loading: false,
        size: '20',
        content: content,
      });
      return;
    }

    isLoading(submitBtn, {
      loading: false,
      content: "Send Another",
    });

    isLoading(document.querySelector('.content'), {
      loading: false,
    })


    document.querySelector('.content').innerHTML = '<p>Message sent successfully!</p>';
  } catch (err) {
    const error = err.split(' ').splice(1).join(' ');
    displayError(error);
  }

})