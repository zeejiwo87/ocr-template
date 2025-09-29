"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";

type IdType = "idcard" | "passport" | "license";

export default function Page() {
  const [idType, setIdType] = useState<IdType>("passport");
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieBlob, setSelfieBlob] = useState<Blob | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const [identifier, setIdentifier] = useState(""); // ⬅️ simpan ID number user
  // Dark-green palette
  const bg = "#0e2a24";
  const surface = "#11342c";
  const surfaceAlt = "#0f2f28";
  const accent = "#23D49B";
  const dashed = "#2e6a59";
  const textSecondary = "#a0c3b7";

  const shortIdLabel = useMemo(() => {
    switch (idType) {
      case "idcard":
        return "ID card";
      case "passport":
        return "Passport";
      case "license":
        return "License";
    }
  }, [idType]);



  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idFile) {
      alert("Please upload ID file first");
      return;
    }

    if (!identifier) {
      alert("Please enter your ID number");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(",")[1];

      const response = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: identifier, // ⬅️ sekarang pakai ID number
          imageBase64: base64,
        }),
      });

      const result = await response.json();
      console.log("OCR Result:", result);
      alert(JSON.stringify(result, null, 2));
    };

    reader.readAsDataURL(idFile);
  };
  return (
    <main
      className="min-h-screen text-white flex items-center justify-center p-4"
      style={{ backgroundColor: bg }}
    >
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 opacity-90">
          <div className="text-2xl font-semibold">Gunung Semeru</div>
          <div className="flex items-center gap-1 text-xs">
            <span role="img" aria-label="US flag">
              🇺🇸
            </span>
            <span>EN</span>
          </div>
        </div>

        {/* Card */}
        <form
          onSubmit={onSubmit}
          className="rounded-2xl shadow-lg p-5 space-y-5 border border-white/5"
          style={{ backgroundColor: surface }}
        >
          <header>
            <h1 className="text-2xl font-bold">Proof of identity</h1>
            <p
              className="mt-1 text-sm leading-relaxed"
              style={{ color: textSecondary }}
            >
              In order to complete your registration, please upload a copy of
              your identity with a clear selfie photo to prove the document
              holder.
            </p>
          </header>

          {/* Basic form (under title) */}
          <section
            className="rounded-xl p-4 grid gap-3 border"
            style={{
              backgroundColor: surfaceAlt,
              borderColor: "rgba(255,255,255,0.06)",
            }}
          >
            <Field label="ID">
              <input
                required
                name="identifier"
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g., A123456789"
                className="w-full rounded-lg px-3 py-2 bg-transparent border outline-none focus:ring-2"
                style={{
                  borderColor: "rgba(255,255,255,0.12)",
                  color: "#E9EDEF",
                }}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="First name">
                <input
                  required
                  name="firstName"
                  placeholder="Jaenal"
                  className="w-full rounded-lg px-3 py-2 bg-transparent border outline-none focus:ring-2"
                  style={{
                    borderColor: "rgba(255,255,255,0.12)",
                    color: "#E9EDEF",
                  }}
                />
              </Field>
              <Field label="Last name">
                <input
                  required
                  name="lastName"
                  placeholder="Arifin"
                  className="w-full rounded-lg px-3 py-2 bg-transparent border outline-none focus:ring-2"
                  style={{
                    borderColor: "rgba(255,255,255,0.12)",
                    color: "#E9EDEF",
                  }}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Place of birth">
                <input
                  required
                  name="pob"
                  placeholder="City, Country"
                  className="w-full rounded-lg px-3 py-2 bg-transparent border outline-none focus:ring-2"
                  style={{
                    borderColor: "rgba(255,255,255,0.12)",
                    color: "#E9EDEF",
                  }}
                />
              </Field>
              <Field label="Date of birth">
                <input
                  required
                  type="date"
                  name="dob"
                  className="w-full rounded-lg px-3 py-2 bg-transparent border outline-none focus:ring-2 [color-scheme:dark]"
                  style={{
                    borderColor: "rgba(255,255,255,0.12)",
                    color: "#E9EDEF",
                  }}
                />
              </Field>
            </div>
          </section>

          {/* Choose ID type */}
          <section className="space-y-2">
            <p className="text-sm font-medium" style={{ color: textSecondary }}>
              Choose your identity type
            </p>
            <div className="flex items-center justify-between">
              <RadioOption
                label="ID card"
                checked={idType === "idcard"}
                onChange={() => setIdType("idcard")}
                color={accent}
              />
              <RadioOption
                label="Passport"
                checked={idType === "passport"}
                onChange={() => setIdType("passport")}
                color={accent}
              />
              <RadioOption
                label="Driving license"
                checked={idType === "license"}
                onChange={() => setIdType("license")}
                color={accent}
              />
            </div>
          </section>

          {/* Upload Proof Identity – dashed card */}
          <DashedCard
            title="Upload Proof Identity"
            subtitle="We accept only ID card, Driving license, Passport"
            dashedColor={dashed}
            surfaceColor={surfaceAlt}
          >
            <div className="flex items-center gap-3">
              <IdCardIcon />
              <div className="flex-1">
                <label
                  className="block"
                  title={`Choose ${shortIdLabel} file`}
                >
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setIdFile(e.target.files?.[0] ?? null)}
                    className="sr-only"
                  />
                  <span
                    className="inline-flex items-center justify-center w-full rounded-lg font-medium py-2 px-3 cursor-pointer transition bg-white text-[#0f2f28] hover:opacity-95 whitespace-nowrap overflow-hidden text-ellipsis truncate"
                    style={{ maxWidth: "100%" }}
                  >
                    {idFile
                      ? `Selected: ${idFile.name}`
                      : `Choose ${shortIdLabel} file`}
                  </span>
                </label>
              </div>
            </div>
          </DashedCard>

          {/* Selfie with ID – camera, not file upload */}
          <DashedCard
            title="Take selfie with identity"
            subtitle="Please note: Screenshots, mobile phone edits, and insurance are NOT accepted for verification."
            dashedColor={dashed}
            surfaceColor={surfaceAlt}
          >
            <div className="flex items-center gap-3">
              <SelfieIcon />
              <div className="flex-1 grid gap-2">
                {selfieBlob ? (
                  <div className="flex items-center gap-3">
                    <Image
                      src={URL.createObjectURL(selfieBlob)}
                      alt="Selfie preview"
                      width={80}
                      height={80}
                      unoptimized
                      className="w-20 h-20 rounded-lg object-cover border border-white/10"
                    />
                    <div className="grid gap-2">
                      <button
                        type="button"
                        onClick={() => setCameraOpen(true)}
                        className="rounded-lg py-2 px-3 font-medium bg-white text-[#0f2f28] hover:opacity-95"
                      >
                        Retake selfie
                      </button>
                      <span className="text-xs" style={{ color: textSecondary }}>
                        Make sure your ID details are clearly visible.
                      </span>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCameraOpen(true)}
                    className="rounded-lg py-2 px-3 font-medium bg-white text-[#0f2f28] hover:opacity-95 w-full"
                  >
                    Open camera
                  </button>
                )}
              </div>
            </div>
          </DashedCard>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-xl font-bold py-3 tracking-wide hover:opacity-95 active:scale-[.99] transition"
            style={{ backgroundColor: accent, color: "#0B2A1B" }}
          >
            NEXT
          </button>
          <p
            className="text-center text-[10px]"
            style={{ color: textSecondary }}
          >
            By continuing, you agree to our Terms & Privacy Policy.
          </p>
        </form>

        {cameraOpen && (
          <CameraModal
            onClose={() => setCameraOpen(false)}
            onCapture={(blob) => {
              setSelfieBlob(blob);
              setCameraOpen(false);
            }}
            bg={bg}
          />
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="text-sm grid gap-1">
      <span className="text-xs" style={{ color: "#cfe4dc" }}>
        {label}
      </span>
      {children}
    </label>
  );
}

function RadioOption({
  label,
  checked,
  onChange,
  color,
}: {
  label: string;
  checked?: boolean;
  onChange?: () => void;
  color: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex items-center gap-2 text-sm select-none"
      aria-pressed={checked}
    >
      <span
        className="inline-flex items-center justify-center w-4 h-4 rounded-full border"
        style={{
          borderColor: checked ? color : "#a8cabb",
          boxShadow: checked ? `0 0 0 2px rgba(35, 212, 155, 0.25)` : "none",
          backgroundColor: checked ? color : "transparent",
        }}
      >
        {checked && <span className="block w-1.5 h-1.5 rounded-full bg-white" />}
      </span>
      <span
        className="whitespace-nowrap"
        style={{ color: checked ? "#E9EDEF" : "#cfe4dc" }}
      >
        {label}
      </span>
    </button>
  );
}

function DashedCard({
  title,
  subtitle,
  children,
  dashedColor,
  surfaceColor,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  dashedColor: string;
  surfaceColor: string;
}) {
  return (
    <section
      className="rounded-xl p-4"
      style={{ backgroundColor: surfaceColor }}
    >
      <div
        className="rounded-xl border-2 border-dashed p-4"
        style={{ borderColor: dashedColor }}
      >
        <h2 className="font-semibold">{title}</h2>
        {subtitle && (
          <p className="text-xs mt-1" style={{ color: "#a0c3b7" }}>
            {subtitle}
          </p>
        )}
        <div className="mt-3">{children}</div>
      </div>
    </section>
  );
}

/** Simple SVG placeholders (you can swap with PNGs via Image if needed) */
function IdCardIcon() {
  return (
    <svg
      width="56"
      height="40"
      viewBox="0 0 56 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <rect
        x="1"
        y="5"
        width="54"
        height="30"
        rx="6"
        stroke="#23D49B"
        strokeWidth="2"
        fill="rgba(35,212,155,0.08)"
      />
      <circle cx="18" cy="20" r="6" fill="#23D49B" />
      <rect x="30" y="14" width="18" height="4" rx="2" fill="#23D49B" />
      <rect x="30" y="22" width="14" height="4" rx="2" fill="#23D49B" />
    </svg>
  );
}

function SelfieIcon() {
  return (
    <svg
      width="56"
      height="40"
      viewBox="0 0 56 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <rect
        x="1"
        y="5"
        width="54"
        height="30"
        rx="6"
        stroke="#23D49B"
        strokeWidth="2"
        fill="rgba(35,212,155,0.08)"
      />
      <circle cx="28" cy="20" r="7" stroke="#23D49B" strokeWidth="2" />
      <rect x="22" y="14" width="12" height="4" rx="2" fill="#23D49B" />
    </svg>
  );
}

/** Camera (optional; leave as-is even if you don't need photo right now) */
function CameraModal({
  onClose,
  onCapture,
  bg,
}: {
  onClose: () => void;
  onCapture: (blob: Blob) => void;
  bg: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream;
    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch {
        setError(
          "Camera access is blocked or unavailable. Please allow camera permissions."
        );
      }
    };
    start();
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    canvas.toBlob((blob) => {
      if (blob) onCapture(blob);
    }, "image/jpeg", 0.9);
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      style={{ background: "rgba(0,0,0,.6)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-xl border border-white/10"
        style={{ backgroundColor: bg }}
      >
        <div className="flex items-center justify-between p-3">
          <h3 className="font-semibold">Camera</h3>
          <button onClick={onClose} className="text-sm opacity-80 hover:opacity-100">
            Close
          </button>
        </div>
        <div className="p-3 grid gap-3">
          {error ? (
            <p className="text-sm text-red-300">{error}</p>
          ) : (
            <div className="rounded-xl overflow-hidden bg-black aspect-[3/4]">
              <video ref={videoRef} playsInline className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex items-center gap-3">
            <button
              onClick={capture}
              className="flex-1 rounded-xl py-3 font-semibold bg-white text-[#0f2f28] hover:opacity-95 disabled:opacity-50"
              disabled={!!error}
            >
              Capture
            </button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );
}
