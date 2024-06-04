const dashboard_elements = document.querySelectorAll(
  '.dashboard_right_content'
);
const access_links = document.querySelectorAll('.access_link');

access_links.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href').substring(1);

    dashboard_elements.forEach((dashboard) => {
      if (dashboard.id === targetId) {
        dashboard.classList.add('dispaly');
        dashboard.style.display = 'block';
      } else {
        dashboard.classList.remove('display');
        dashboard.style.display = 'none';
      }
    });
  });
});
