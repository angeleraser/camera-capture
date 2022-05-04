const videoEl = document.getElementById("video");
const canvasEl = document.getElementById("canvas");
const captureBtn = document.getElementById("capture-btn");
const downloadBtn = document.getElementById("download-btn");
const removeBtn = document.getElementById("remove-btn");
const grids = Array.from(document.getElementsByClassName("grid"));

const sizes = {
  width: 1280,
  height: 720,
};
let imageBlob = null;

async function requestMediaPermissions(constraints, { onSuccess, onError }) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return void onSuccess(stream);
  } catch {
    return void onError();
  }
}

const drawCanvasImage = (canvas, video) => {
  const context = canvas.getContext("2d");
  canvas.width = sizes.width;
  canvas.height = sizes.height;
  context.drawImage(video, 0, 0, sizes.width, sizes.height);
  return canvas;
};

const getImageFromCanvas = (canvas) => {
  const image = new Image();
  image.src = canvas.toDataURL("image/png");
  return image;
};

requestMediaPermissions(
  { video: { ...sizes } },
  {
    onSuccess: (mediaStream) => {
      console.log("Permissions accepted!");
      videoEl.srcObject = mediaStream;
    },

    onError: () => {
      console.error("Permissions denied");
    },
  }
);

grids.forEach((el) => {
  el.style.width = `${sizes.width * 0.5}px`;
  el.style.height = `${sizes.height * 0.5}px`;
});

captureBtn.addEventListener("click", () => {
  drawCanvasImage(canvasEl, videoEl).toBlob((file) => {
    imageBlob = file;
  });
});

downloadBtn.addEventListener("click", () => {
  if (!imageBlob) return;

  const fr = new FileReader();
  fr.readAsArrayBuffer(imageBlob);

  fr.onload = () => {
    const blob = new Blob([fr.result], { type: "image/png" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "image";
    a.click();
  };
});

removeBtn.addEventListener("click", () => {
  if (!imageBlob) return;

  imageBlob = null;
  const context = canvasEl.getContext("2d");
  context.clearRect(0, 0, sizes.width, sizes.height);
});
