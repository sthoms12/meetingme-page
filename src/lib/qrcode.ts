let qrcodeModulePromise: Promise<typeof import("qrcode")> | null = null;

const loadQRCode = () => {
  if (!qrcodeModulePromise) {
    qrcodeModulePromise = import("qrcode");
  }

  return qrcodeModulePromise;
};

export const generateQrCodeDataUrl = async (url: string) => {
  const QRCode = await loadQRCode();

  return QRCode.toDataURL(url, {
    width: 600,
    margin: 2,
    color: {
      dark: "#0f172a",
      light: "#ffffff",
    },
  });
};
