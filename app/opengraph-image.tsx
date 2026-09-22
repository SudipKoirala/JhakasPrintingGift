import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
        background: "#FFF9F2",
        color: "#292624",
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 700, color: "#E87852" }}>
        Jhakash Printing Gift
      </div>
      <div
        style={{
          fontSize: 72,
          fontWeight: 800,
          letterSpacing: -2,
          lineHeight: 1.05,
          marginTop: 16,
        }}
      >
        Put Your Design On It.
      </div>
      <div style={{ fontSize: 28, marginTop: 24, color: "#5c5754" }}>
        Upload · Customize · Send on WhatsApp. No account required.
      </div>
    </div>,
    { ...size },
  );
}
