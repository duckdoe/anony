import displayError from "./displayError.js";
import isLoading from "./loading.js";

async function loadMessages() {
  const searchParams = new URLSearchParams(window.location.search);
  const username = searchParams.get("username");

  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = `${window.origin}/anony/login.html`;
    return;
  }

  const content = isLoading(document.getElementById('message-container'), {
    loading: true,
    size: '30',
  });

  const res = await fetch(`https://anony-backend-1-je2e.onrender.com/messages${window.location.search}`, {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
      "Authorization": token,
    })
  });

  if (res.status == 400) {
    window.location.href = `${window.origin}/login.html`;
  }

  const data = await res.json()
  let messages = data.messages;

  const shareLink = `${window.origin}/anony/send-message?id=${data.user_id}`;
  document.getElementById('share-link-input').value = shareLink;
  console.log(shareLink);

  function copyToClipBoard() {
    const textArea = document.createElement('textarea');
    textArea.value = shareLink;
    textArea.style.position = 'fixed';
    textArea.style.opacity = 0;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      displayError("Copied");
    } catch (err) {
      displayError("Failed to copy text");
      console.error("Failed to copy text", err);
    }

    document.body.removeChild(textArea);
  };

  if (res.status == 404) {
    isLoading(document.getElementById('message-container'), {
      loading: false,
    });
    document.getElementById('message-container').innerHTML = '<p id="not-found-message">No messages found</p>';
  }

  function formatTimeAgo(date) {
    if (!date) return "Just now";
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + 'y ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + 'm ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + 'd ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + 'h ago';
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + 'min ago';
    return Math.floor(seconds) + 's ago';
  }

  document.getElementById('btn-copy-link').addEventListener('click', copyToClipBoard)
  isLoading(document.getElementById('message-container'), {
    loading: false,
  })

  messages = messages.reverse();
  messages.forEach(message => {
    const date = new Date(message.created_at);
    let html = `
     <li class="py-3">
        <p class="text-medium px-6 py-2">${message.message}</p>
        <span class="text-sm text-gray-400 px-6">${formatTimeAgo(date)}</span>
      </li>
    `
    document.getElementById('message-container').innerHTML += html;
  });
}

loadMessages();

document.getElementById('btn-logout').addEventListener('click', () => {
  localStorage.removeItem("token");
  window.location.href = `${window.origin}/anony/login.html`;
})