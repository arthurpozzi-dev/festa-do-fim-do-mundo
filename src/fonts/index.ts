import localFont from "next/font/local";

export const helvetica = localFont({
  src: [
    { path: "./Helvetica.ttf", weight: "400", style: "normal" },
    { path: "./Helvetica-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--ff-helvetica",
  display: "swap",
});

export const kremlin = localFont({
  src: "./KremlinOrthodoxChurch.ttf",
  variable: "--ff-kremlin",
  display: "swap",
});

export const sloop = localFont({
  src: "./Sloop-ScriptThree.ttf",
  variable: "--ff-sloop",
  display: "swap",
});

export const gothicPixels = localFont({
  src: "./GothicPixels.ttf",
  variable: "--ff-gothic-pixels",
  display: "swap",
});

export const acid = localFont({
  src: "./AcidTM.ttf",
  variable: "--ff-acid",
  display: "swap",
});

export const oldLondon = localFont({
  src: "./OldLondon.ttf",
  variable: "--ff-old-london",
  display: "swap",
});
