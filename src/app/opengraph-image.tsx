import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const alt = "Dhairya | Video Editor, Cameraman & Content Creator";

export default async function Image() {
  // Read static brand avatar from disk and embed as Base64 data URI
  const avatarPath = path.join(
    process.cwd(),
    "public",
    "assets",
    "brand",
    "avatar-static.png"
  );
  const avatarBuffer = fs.readFileSync(avatarPath);
  const avatarBase64 = `data:image/png;base64,${avatarBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "70px 80px",
          backgroundColor: "#020308",
          backgroundImage:
            "linear-gradient(145deg, #020308 0%, #04081E 50%, #081438 100%)",
          color: "#FFFFFF",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle decorative glass border frame inside safe area */}
        <div
          style={{
            position: "absolute",
            inset: "24px",
            border: "1px solid rgba(34, 211, 238, 0.15)",
            borderRadius: "28px",
            pointerEvents: "none",
          }}
        />

        {/* Left Column: Avatar with Accent Border */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "260px",
            height: "260px",
            borderRadius: "9999px",
            border: "4px solid #22D3EE",
            backgroundColor: "#050B2E",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarBase64}
            alt="Dhairya"
            width={260}
            height={260}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Right Column: Information & Branding */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginLeft: "60px",
            flex: 1,
          }}
        >
          {/* Status Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "6px 14px",
                borderRadius: "9999px",
                backgroundColor: "rgba(34, 211, 238, 0.1)",
                border: "1px solid rgba(34, 211, 238, 0.28)",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "9999px",
                  backgroundColor: "#22D3EE",
                  marginRight: "8px",
                }}
              />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#5CF0FF",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Official Portfolio
              </span>
            </div>
          </div>

          {/* Headline Name */}
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Dhairya
          </h1>

          {/* Subtitle / Role */}
          <p
            style={{
              fontSize: "26px",
              fontWeight: 600,
              color: "#22D3EE",
              margin: "12px 0 0 0",
              lineHeight: 1.3,
            }}
          >
            Video Editor, Cameraman & Content Creator
          </p>

          {/* Metrics & Highlights */}
          <p
            style={{
              fontSize: "19px",
              fontWeight: 400,
              color: "#94A3B8",
              margin: "12px 0 0 0",
              lineHeight: 1.4,
            }}
          >
            2+ years · 40+ brands · Nagpur, India
          </p>

          {/* Domain Footer Pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "28px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 16px",
                borderRadius: "10px",
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#E2E8F0",
                  letterSpacing: "0.02em",
                }}
              >
                dhairya-portfolio-tan.vercel.app
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
