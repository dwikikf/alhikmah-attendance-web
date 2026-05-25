/**
 * Utility for printing elements
 */

export function printElement(elementId: string, title: string = "Cetak Kartu Absensi") {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  // Clone the element to safely mutate it
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Convert all canvases to images in the clone
  const originalCanvases = element.getElementsByTagName("canvas");
  const clonedCanvases = clone.getElementsByTagName("canvas");
  for (let i = 0; i < originalCanvases.length; i++) {
    const dataUrl = originalCanvases[i].toDataURL("image/png");
    const img = document.createElement("img");
    img.src = dataUrl;
    img.className = originalCanvases[i].className;
    img.style.cssText = originalCanvases[i].style.cssText;
    img.width = originalCanvases[i].width;
    img.height = originalCanvases[i].height;
    
    if (clonedCanvases[i] && clonedCanvases[i].parentNode) {
      clonedCanvases[i].parentNode?.replaceChild(img, clonedCanvases[i]);
    }
  }

  // Create a temporary print container
  const printContainer = document.createElement("div");
  printContainer.id = "print-container-temp";
  printContainer.style.position = "absolute";
  printContainer.style.top = "0";
  printContainer.style.left = "0";
  printContainer.style.width = "100%";
  printContainer.style.minHeight = "100vh";
  printContainer.style.backgroundColor = "white";
  printContainer.style.zIndex = "999999";
  printContainer.appendChild(clone);

  // Add styles to hide everything else during print
  const style = document.createElement("style");
  style.innerHTML = `
    @media print {
      body > *:not(#print-container-temp) {
        display: none !important;
      }
      #print-container-temp {
        display: block !important;
      }
      @page { margin: 0; }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(printContainer);

  // Set title temporarily
  const originalTitle = document.title;
  document.title = title;

  // Print and clean up
  setTimeout(() => {
    window.print();
    document.title = originalTitle;
    document.body.removeChild(printContainer);
    document.head.removeChild(style);
  }, 200);
}
