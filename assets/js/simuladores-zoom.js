document.querySelectorAll('.zoom-instrumento').forEach(section => {
  const viewport = section.querySelector('.escala-ventana');
  const canvas = viewport.querySelector('canvas');
  const output = section.querySelector('.zoom-nivel');
  const track = section.querySelector('.zoom-recorrido');
  const range = track.querySelector('input');
  const less = section.querySelector('[data-zoom="menos"]');
  const more = section.querySelector('[data-zoom="mas"]');
  let zoom = 1;

  function syncScroll() {
    const limit = viewport.scrollWidth - viewport.clientWidth;
    range.value = limit > 0 ? viewport.scrollLeft / limit * 100 : 0;
  }

  function setZoom(next) {
    // Keep the same part of the scale in the middle of the viewport.
    const center = (viewport.scrollLeft + viewport.clientWidth / 2) / canvas.offsetWidth;
    zoom = Math.max(1, Math.min(4, next));
    canvas.style.width = `${zoom * 100}%`;
    viewport.scrollLeft = zoom === 1 ? 0 : center * canvas.offsetWidth - viewport.clientWidth / 2;
    output.textContent = `${Math.round(zoom * 100)} %`;
    less.disabled = zoom === 1;
    more.disabled = zoom === 4;
    track.hidden = zoom === 1;
    syncScroll();
  }

  less.addEventListener('click', () => setZoom(zoom - .5));
  more.addEventListener('click', () => setZoom(zoom + .5));
  section.querySelector('[data-zoom="restablecer"]').addEventListener('click', () => setZoom(1));
  range.addEventListener('input', () => {
    viewport.scrollLeft = Number(range.value) / 100 * (viewport.scrollWidth - viewport.clientWidth);
  });
  viewport.addEventListener('keydown', event => {
    if (event.target !== viewport) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      viewport.scrollLeft += (event.key === 'ArrowRight' ? 1 : -1) * viewport.clientWidth / 4;
      syncScroll();
    }
  });
  viewport.addEventListener('scroll', syncScroll, { passive: true });
  window.addEventListener('resize', syncScroll);
  setZoom(1);
});
