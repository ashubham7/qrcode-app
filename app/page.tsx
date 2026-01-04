'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import Image from 'next/image';

type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export default function Home() {
  const [text, setText] = useState('https://example.com');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [colorDark, setColorDark] = useState('#000000');
  const [colorLight, setColorLight] = useState('#ffffff');
  const [size, setSize] = useState(300);
  const [errorCorrection, setErrorCorrection] = useState<ErrorCorrectionLevel>('M');

  // Generate QR code whenever dependencies change
  useEffect(() => {
    let ignore = false;

    const generate = async () => {
      if (!text) {
        if (!ignore) setQrCodeUrl('');
        return;
      }

      try {
        const url = await QRCode.toDataURL(text, {
          width: size,
          margin: 1,
          color: {
            dark: colorDark,
            light: colorLight,
          },
          errorCorrectionLevel: errorCorrection,
        });

        if (!ignore) {
          setQrCodeUrl(url);
        }
      } catch (err) {
        console.error(err);
      }
    };

    generate();

    return () => {
      ignore = true;
    };
  }, [text, colorDark, colorLight, size, errorCorrection]);

  const handleDownload = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gradient-mesh text-white font-[family-name:var(--font-geist-sans)]">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-12">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          QR Code Generator
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Built with Next.js
          </a>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 w-full max-w-6xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl p-8 rounded-2xl">
        {/* Controls Section */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Customize Your QR Code
            </h2>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Content</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text or URL"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition-colors duration-200 text-white placeholder-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Foreground Color</label>
                <div className="flex items-center space-x-2 bg-white/5 p-2 rounded-lg border border-white/10">
                  <input
                    type="color"
                    value={colorDark}
                    onChange={(e) => setColorDark(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-none p-0"
                  />
                  <span className="text-xs font-mono opacity-70">{colorDark}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Background Color</label>
                <div className="flex items-center space-x-2 bg-white/5 p-2 rounded-lg border border-white/10">
                  <input
                    type="color"
                    value={colorLight}
                    onChange={(e) => setColorLight(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-none p-0"
                  />
                  <span className="text-xs font-mono opacity-70">{colorLight}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Size: {size}px</label>
              <input
                type="range"
                min="150"
                max="500"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Error Correction Level</label>
              <div className="flex space-x-4">
                {(['L', 'M', 'Q', 'H'] as ErrorCorrectionLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setErrorCorrection(level)}
                    className={`px-4 py-2 rounded-md font-medium transition-all ${errorCorrection === level
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="flex flex-col items-center justify-center space-y-8 bg-black/20 rounded-xl p-8 border border-white/5">
          <div className="relative group">
            {qrCodeUrl ? (
              <div className="relative p-4 bg-white rounded-xl shadow-2xl transition-transform hover:scale-105 duration-300">
                <Image
                  src={qrCodeUrl}
                  alt="QR Code"
                  width={size}
                  height={size}
                  className="rounded-lg"
                  unoptimized // Since it's a data URL
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-[300px] h-[300px] bg-white/10 rounded-xl border-2 border-dashed border-white/20 text-gray-500">
                Enter text to generate
              </div>
            )}
          </div>

          <button
            onClick={handleDownload}
            disabled={!qrCodeUrl}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/30 w-full max-w-xs flex items-center justify-center space-x-2 ${!qrCodeUrl ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 9.75v10.5m0-10.5-3 3m3-3 3 3" />
            </svg>
            <span>Download PNG</span>
          </button>
        </div>
      </div>
    </main>
  );
}
