// Redimensiona (lado maior até `ladoMax`) e recomprime em JPEG antes do upload.
export async function comprimirImagem(arq: File, ladoMax = 1920): Promise<Blob> {
  const img = await createImageBitmap(arq);
  const escala = Math.min(1, ladoMax / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * escala);
  canvas.height = Math.round(img.height * escala);
  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
  img.close();
  const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/jpeg", 0.82));
  return blob && blob.size < arq.size ? blob : arq;
}

// Caminho do arquivo dentro do bucket "imoveis", a partir da URL pública.
export function caminhoNoBucket(url: string) {
  const marca = "/imoveis/";
  const i = url.indexOf(marca);
  return i >= 0 ? decodeURIComponent(url.slice(i + marca.length)) : null;
}
