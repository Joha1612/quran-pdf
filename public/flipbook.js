const form = document.getElementById("uploadForm");
const flipbook = document.getElementById("flipbook");
const controls = document.getElementById("controls");
let zoomLevel = 1;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = document.getElementById("pdfFile").files[0];
  if (!file) return alert("Please select a PDF file");

  const formData = new FormData();
  formData.append("pdf", file);

  const res = await fetch("/upload", {
    method: "POST",
    body: formData,
  });

  const html = await res.text();
  flipbook.innerHTML = html;
  flipbook.style.display = "block";
  controls.style.display = "flex";

  initFlipbook();
});

function initFlipbook() {
  $(flipbook).turn({
    width: "100%",
    height: "100%",
    autoCenter: true,
    display: "double",
    acceleration: true,
    elevation: 50,
    gradients: true,
  });

  // Navigation buttons
  document.getElementById("prevBtn").addEventListener("click", () => {
    $(flipbook).turn("previous");
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    $(flipbook).turn("next");
  });

  // Zoom controls
  document.getElementById("zoomInBtn").addEventListener("click", () => {
    zoomLevel += 0.2;
    flipbook.style.transform = `scale(${zoomLevel})`;
  });

  document.getElementById("zoomOutBtn").addEventListener("click", () => {
    zoomLevel = Math.max(1, zoomLevel - 0.2);
    flipbook.style.transform = `scale(${zoomLevel})`;
  });

  // Swipe (for mobile)
  let startX = 0;
  flipbook.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  flipbook.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) $(flipbook).turn("next");
    if (endX - startX > 50) $(flipbook).turn("previous");
  });
}
