import { ImageResponse } from "next/og";
import {
  PROJECT_TITLE,
  PROJECT_DESCRIPTION,
  PROJECT_AVATAR_URL,
} from "~/lib/constants";

export const alt = PROJECT_TITLE;
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#1a1a1a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 3D road gradient background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(180deg, #2D1B69 0%, #8A63D2 30%, #1E90FF 60%, #00D4AA 100%)",
            opacity: 0.95,
          }}
        />

        {/* Perspective road lines for 3D effect */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.1) 22%, rgba(255,255,255,0.1) 23%, transparent 25%),
              linear-gradient(90deg, transparent 75%, rgba(255,255,255,0.1) 77%, rgba(255,255,255,0.1) 78%, transparent 80%),
              linear-gradient(0deg, transparent 70%, rgba(255,255,255,0.05) 80%, transparent 90%)
            `,
          }}
        />

        {/* Main content container - centered in safe zone */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: "60px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* 3D collectible cards floating effect */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "40px",
              position: "relative",
              gap: "24px",
            }}
          >
            {/* Card 1 - rotated left */}
            <div
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                border: "3px solid rgba(255, 255, 255, 0.4)",
                borderRadius: "16px",
                transform: "rotateY(-25deg) rotateX(10deg)",
                boxShadow: "0 12px 24px rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(8px)",
              }}
            />
            {/* Main avatar with holographic effect */}
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "20px",
                overflow: "hidden",
                border: "4px solid rgba(255, 255, 255, 0.6)",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                boxShadow: "0 16px 40px rgba(0, 0, 0, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.2)",
                transform: "translateZ(20px)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PROJECT_AVATAR_URL}
                alt="Creator avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            {/* Card 2 - rotated right */}
            <div
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                border: "3px solid rgba(255, 255, 255, 0.4)",
                borderRadius: "16px",
                transform: "rotateY(25deg) rotateX(10deg)",
                boxShadow: "0 12px 24px rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(8px)",
              }}
            />
          </div>

          {/* Project title with 3D text effect */}
          <h1
            style={{
              fontSize: "84px",
              fontWeight: "900",
              color: "#ffffff",
              textAlign: "center",
              marginBottom: "32px",
              lineHeight: 1.0,
              letterSpacing: "-3px",
              textShadow: "0 8px 32px rgba(0, 0, 0, 0.6), 0 4px 16px rgba(138, 99, 210, 0.8)",
              maxWidth: "1100px",
              fontFamily: "system-ui, -apple-system, sans-serif",
              background: "linear-gradient(180deg, #ffffff 0%, #E0E7FF 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              transform: "perspective(800px) rotateX(15deg)",
            }}
          >
            {PROJECT_TITLE}
          </h1>

          {/* Project description */}
          <p
            style={{
              fontSize: "42px",
              fontWeight: "600",
              color: "rgba(255, 255, 255, 0.92)",
              textAlign: "center",
              marginBottom: "48px",
              lineHeight: 1.2,
              textShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
              maxWidth: "900px",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {PROJECT_DESCRIPTION}
          </p>

          {/* 3D Navigation hint */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              padding: "24px 48px",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              borderRadius: "60px",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3), inset 0 2px 8px rgba(255, 255, 255, 0.1)",
              transform: "perspective(400px) rotateX(5deg)",
            }}
          >
            {/* 3D cube icon */}
            <div
              style={{
                width: "36px",
                height: "36px",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "2px solid rgba(255, 255, 255, 0.6)",
                borderRadius: "8px",
                transform: "rotateY(25deg) rotateX(15deg)",
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.4)",
              }}
            />
            <span
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: "-0.8px",
                textShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
              }}
            >
              Navigate Forward & Backward
            </span>
            {/* Arrow indicators */}
            <div
              style={{
                display: "flex",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: "900",
                  color: "#2D1B69",
                  transform: "rotateY(-15deg)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
              >
                ←
              </div>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: "900",
                  color: "#2D1B69",
                  transform: "rotateY(15deg)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
              >
                →
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade for depth */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "200px",
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 100%)",
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
