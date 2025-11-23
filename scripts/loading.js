function isLoading(el, content = {
  loading: false,
  size: '20',
  content: ''
}) {
  if (content.loading == false) {
    let spinner = el.children.namedItem("spinner");

    if (spinner == undefined) {
      return;
    };

    spinner.remove();
    el.innerHTML = content.content ? content.content : '';
    return;
  }
  let elContent = el.innerHTML;
  el.innerHTML = '';
  const spinner = document.createElement('div');
  spinner.id = "spinner";
  let size = content.size;
  spinner.style.width = `${size}px`;
  spinner.style.height = `${size}px`;
  spinner.style.backgroundColor = 'transparent';
  spinner.style.borderRadius = '50%'
  spinner.style.border = "2px solid white";
  spinner.style.borderLeft = '2px solid transparent';
  spinner.style.borderRight = '2px solid transparent';
  spinner.style.borderBottom = '2px solid transparent';
  spinner.style.animation = "spin linear 1.2s infinite"
  el.appendChild(spinner);
  return elContent;
}

export default isLoading;