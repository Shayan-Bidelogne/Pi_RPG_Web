const scrollBannerContainer = document.getElementById('scroll-banner-container');

if (scrollBannerContainer) {
  const bannerUrl = new URL('../scroll-banner.html', document.currentScript?.src || window.location.href);

  fetch(bannerUrl)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to load banner: ${res.status}`);
      }
      return res.text();
    })
    .then((html) => {
      scrollBannerContainer.innerHTML = html;
    })
    .catch(() => {
      // Pages can still render without the shared banner if it is unavailable.
    });
}
