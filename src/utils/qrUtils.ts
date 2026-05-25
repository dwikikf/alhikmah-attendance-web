/**
 * Utility for QR Code operations
 */

export function downloadQRCode(canvasId: string, filename: string = "qrcode.png") {
  let element = document.getElementById(canvasId);
  if (!element) {
    console.error(`Element with id ${canvasId} not found`);
    return;
  }
  
  let canvas = element as HTMLCanvasElement;
  if (canvas.tagName !== "CANVAS") {
    const innerCanvas = element.querySelector("canvas");
    if (innerCanvas) {
      canvas = innerCanvas;
    } else {
      console.error("Canvas element not found inside wrapper");
      return;
    }
  }

  canvas.toBlob((blob) => {
    if (!blob) {
      console.error("Failed to generate blob from canvas");
      return;
    }
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  }, "image/png");
}
