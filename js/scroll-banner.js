fetch('scroll-banner.html')
  .then(res => res.text())
  .then(html => {
      document.getElementById('scroll-banner-container').innerHTML = html;
  });