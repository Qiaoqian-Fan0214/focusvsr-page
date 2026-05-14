document.documentElement.classList.add("ready");

document.querySelectorAll("[data-image-slider]").forEach((slider) => {
  const input = slider.querySelector('input[type="range"]');
  if (!input) return;

  const update = () => {
    slider.style.setProperty("--split", `${input.value}%`);
  };

  input.addEventListener("input", update);
  update();
});

document.querySelectorAll("[data-sync-group]").forEach((group) => {
  const videos = Array.from(group.querySelectorAll("[data-sync-video]"));

  videos.forEach((video) => {
    video.addEventListener("play", () => {
      videos.forEach((peer) => {
        if (peer === video) return;
        if (Math.abs(peer.currentTime - video.currentTime) > 0.35) {
          peer.currentTime = video.currentTime;
        }
        peer.play().catch(() => {});
      });
    });

    video.addEventListener("pause", () => {
      videos.forEach((peer) => {
        if (peer !== video) peer.pause();
      });
    });

    video.addEventListener("seeked", () => {
      videos.forEach((peer) => {
        if (peer !== video && Math.abs(peer.currentTime - video.currentTime) > 0.35) {
          peer.currentTime = video.currentTime;
        }
      });
    });
  });
});

document.querySelectorAll("[data-video-slot]").forEach(async (slot) => {
  const src = slot.dataset.videoSrc;
  if (!src) return;

  const title = slot.dataset.title || "SR result";
  slot.classList.add("is-ready");
  slot.innerHTML = `
    <figure>
      <video controls muted playsinline preload="metadata">
        <source src="${src}" type="video/mp4">
      </video>
      <figcaption>${title}</figcaption>
    </figure>
  `;
});
