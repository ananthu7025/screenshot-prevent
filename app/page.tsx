/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

// Image data - Images from public folder
const imageDocuments = [
  {
    id: 1,
    title: 'PLANE & PROP – Page 1',
    url: '/PLANE%20%26%20PROP%20%E2%80%93%20PLATFORM%20REQUIREMENTS%20DOCUMENT%20(Web%20%2B%20Student%20Portal%20%2B%20Admin%20Console)_page-0001.jpg',
    description: 'Platform Requirements Document - Page 1'
  },
  {
    id: 2,
    title: 'PLANE & PROP – Page 2',
    url: '/PLANE%20%26%20PROP%20%E2%80%93%20PLATFORM%20REQUIREMENTS%20DOCUMENT%20(Web%20%2B%20Student%20Portal%20%2B%20Admin%20Console)_page-0002.jpg',
    description: 'Platform Requirements Document - Page 2'
  },
];

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<{ id: number; title: string; url: string } | null>(null);
  const [email, setEmail] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userIP, setUserIP] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setIsAuthenticated(true);

      // Fetch user's IP address
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setUserIP(data.ip);
        initializeProtection(email, data.ip);
      } catch (error) {
        console.error('Failed to fetch IP:', error);
        initializeProtection(email, 'Unknown');
      }
    } else {
      alert('Please enter a valid email address');
    }
  };

  const initializeProtection = (userEmail: string, userIPAddress: string) => {
    // Ultra-aggressive Win+Shift+S / PrintScreen blocker
    (function () {
      let overlay: HTMLDivElement | null = null;
      let isBlocked = false;

      const createOverlay = () => {
        if (overlay) return overlay;

        overlay = document.createElement('div');
        overlay.style.cssText =
          'position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: black !important; color: red !important; z-index: 2147483647 !important; display: none !important; align-items: center !important; justify-content: center !important; font-family: Arial, sans-serif !important; font-size: 32px !important; font-weight: bold !important; text-align: center !important;';

        const timestamp = new Date().toLocaleString();

        overlay.innerHTML =
          `<div>
            <div style="font-size: 80px; margin-bottom: 30px;">🚫</div>
            <div>SCREENSHOT ATTEMPT BLOCKED</div>
            <div style="font-size: 20px; margin-top: 20px; color: yellow;">Win+Shift+S Prevented</div>
            <div style="font-size: 16px; margin-top: 25px; color: #ccc;">This activity was recorded and will be reported</div>
            <div style="font-size: 18px; margin-top: 30px; color: #ff4444; border: 2px solid #ff4444; padding: 20px; border-radius: 10px; display: inline-block; background: rgba(255, 68, 68, 0.1);">
              <div style="margin-bottom: 10px;">📧 Email: ${userEmail}</div>
              <div style="margin-bottom: 10px;">🌐 IP Address: ${userIPAddress}</div>
              <div>⏰ Time: ${timestamp}</div>
            </div>
            <div style="font-size: 14px; margin-top: 15px; color: #888;">Click to acknowledge</div>
          </div>`;

        overlay.addEventListener('click', () => {
          if (overlay) overlay.style.display = 'none';
          isBlocked = false;
        });

        return overlay;
      };

      const instantBlock = () => {
        if (isBlocked) return;
        isBlocked = true;

        const overlayEl = createOverlay();
        if (overlayEl && !overlayEl.parentNode) {
          document.body.appendChild(overlayEl);
        }
        if (overlayEl) overlayEl.style.display = 'flex';

        const timestamp = new Date().toLocaleString();
        console.error('========================================');
        console.error('🚨 SCREENSHOT ATTEMPT DETECTED 🚨');
        console.error('========================================');
        console.error('Email:', userEmail);
        console.error('IP Address:', userIPAddress);
        console.error('Time:', timestamp);
        console.error('Action: WIN+SHIFT+S PREVENTED FROM REACHING WINDOWS');
        console.error('========================================');

        // You can also send this to your backend API for logging
        // fetch('/api/log-screenshot-attempt', {
        //   method: 'POST',
        //   body: JSON.stringify({ email: userEmail, ip: userIPAddress, timestamp })
        // });

        setTimeout(() => {
          if (isBlocked && overlayEl) {
            overlayEl.style.display = 'none';
            isBlocked = false;
          }
        }, 8000);
      };

      const preventWinShiftS = (e: KeyboardEvent) => {
        const isWinShiftS =
          (e.metaKey &&
            e.shiftKey &&
            (e.key === 's' || e.key === 'S' || e.code === 'KeyS')) ||
          (e.getModifierState &&
            e.getModifierState('Meta') &&
            e.getModifierState('Shift') &&
            (e.key === 's' || e.key === 'S')) ||
          (e.ctrlKey && e.shiftKey && (e.key === 's' || e.key === 'S')) ||
          (e.keyCode === 83 && e.metaKey && e.shiftKey) ||
          (e.which === 83 && e.metaKey && e.shiftKey);

        if (isWinShiftS) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          if ((e as any).returnValue !== undefined) (e as any).returnValue = false;
          if ((e as any).cancel !== undefined) (e as any).cancel = true;
          if ((e as any).cancelBubble !== undefined) (e as any).cancelBubble = true;

          instantBlock();
          return false;
        }

        if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          instantBlock();
          return false;
        }
      };

      const attachMaximumHandlers = () => {
        document.addEventListener('keydown', preventWinShiftS as any, { capture: true, passive: false });
        document.addEventListener('keydown', preventWinShiftS as any, { capture: false, passive: false });
        document.addEventListener('keyup', preventWinShiftS as any, { capture: true, passive: false });
        document.addEventListener('keypress', preventWinShiftS as any, { capture: true, passive: false });

        window.addEventListener('keydown', preventWinShiftS as any, { capture: true, passive: false });
        window.addEventListener('keydown', preventWinShiftS as any, { capture: false, passive: false });
        window.addEventListener('keyup', preventWinShiftS as any, { capture: true, passive: false });
        window.addEventListener('keypress', preventWinShiftS as any, { capture: true, passive: false });

        if (document.documentElement) {
          document.documentElement.addEventListener('keydown', preventWinShiftS as any, { capture: true, passive: false });
          document.documentElement.addEventListener('keyup', preventWinShiftS as any, { capture: true, passive: false });
        }

        if (document.body) {
          document.body.addEventListener('keydown', preventWinShiftS as any, { capture: true, passive: false });
          document.body.addEventListener('keyup', preventWinShiftS as any, { capture: true, passive: false });
        }
      };

      let lastFocusTime = Date.now();
      const monitorFocus = () => {
        const now = Date.now();
        if (!document.hasFocus() && now - lastFocusTime < 50) {
          instantBlock();
        }
        lastFocusTime = now;
      };

      const startUltraMonitoring = () => {
        setInterval(monitorFocus, 1);
        setInterval(attachMaximumHandlers, 100);

        setInterval(() => {
          if (!document.hasFocus() && Date.now() - lastFocusTime < 200) {
            instantBlock();
          }
          if (document.hidden) {
            instantBlock();
          }
        }, 10);
      };

      const initMaxAggression = () => {
        createOverlay();
        attachMaximumHandlers();
        startUltraMonitoring();

        document.addEventListener('visibilitychange', () => {
          if (document.hidden) instantBlock();
        });

        window.addEventListener('blur', () => {
          instantBlock();
        });

        document.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          instantBlock();
        });

        window.addEventListener('beforeprint', (e) => {
          e.preventDefault();
          instantBlock();
        });
      };

      initMaxAggression();

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMaxAggression);
      }

      setTimeout(initMaxAggression, 10);
      setTimeout(initMaxAggression, 50);
      setTimeout(initMaxAggression, 100);

      (window as any).ultraFastBlock = instantBlock;
    })();
  };

  return (
    <>
      <Script
        src="https://unpkg.com/screenshot-privacy-protect/dist/privacy-protect.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          // Enable privacy protect library
          if ((window as any).PrivacyProtect) {
            (window as any).PrivacyProtect.enable({
              feedback: true,
              blockPrint: true,
              watermarkText: 'Confidential Document',
            });
          }
        }}
      />

      <style jsx global>{`
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          margin: 0;
          padding: 0;
          background: #0f172a;
          color: #e5e7eb;
        }

        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .image-card {
          background: #020617;
          border-radius: 16px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid rgba(148, 163, 184, 0.15);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .image-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
          border-color: rgba(165, 180, 252, 0.3);
        }

        .image-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .image-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #e5e7eb;
        }

        .image-description {
          font-size: 0.875rem;
          color: #9ca3af;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }

        .modal-content {
          background: #020617;
          border-radius: 16px;
          width: 100%;
          max-width: 1200px;
          height: 90vh;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(148, 163, 184, 0.2);
        }

        .modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(148, 163, 184, 0.15);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #e5e7eb;
        }

        .close-button {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .close-button:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.5);
        }

        .modal-body {
          flex: 1;
          padding: 1.5rem;
          overflow: auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .protected-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 8px;
          user-select: none;
          -webkit-user-drag: none;
          pointer-events: none;
        }

        .page-header {
          text-align: center;
          padding: 3rem 2rem 2rem;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.3);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #a5b4fc;
          background: rgba(59, 130, 246, 0.06);
          margin-bottom: 1rem;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #e5e7eb;
        }

        .page-subtitle {
          font-size: 1rem;
          color: #9ca3af;
        }

        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .auth-card {
          background: #020617;
          border-radius: 16px;
          padding: 3rem;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(148, 163, 184, 0.15);
        }

        .auth-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #e5e7eb;
          text-align: center;
        }

        .auth-subtitle {
          font-size: 1rem;
          color: #9ca3af;
          text-align: center;
          margin-bottom: 2rem;
        }

        .email-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-label {
          font-size: 0.875rem;
          color: #e5e7eb;
          font-weight: 500;
        }

        .email-input {
          padding: 0.875rem 1rem;
          border-radius: 8px;
          border: 1px solid rgba(148, 163, 184, 0.3);
          background: #0f172a;
          color: #e5e7eb;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .email-input:focus {
          outline: none;
          border-color: rgba(165, 180, 252, 0.5);
          box-shadow: 0 0 0 3px rgba(165, 180, 252, 0.1);
        }

        .submit-button {
          padding: 0.875rem 1.5rem;
          border-radius: 8px;
          border: none;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
        }

        .lock-icon {
          font-size: 3rem;
          text-align: center;
          margin-bottom: 1rem;
        }
      `}</style>

      <div>
        {!isAuthenticated ? (
          <div className="auth-container">
            <div className="auth-card">
              <div className="lock-icon">🔐</div>
              <div className="badge" style={{ display: 'block', textAlign: 'center', marginBottom: '1rem' }}>
                🔒 Secure Access
              </div>
              <h1 className="auth-title">Protected Image Viewer</h1>
              <p className="auth-subtitle">
                Please enter your email to access the protected documents
              </p>

              <form onSubmit={handleEmailSubmit} className="email-form">
                <div className="input-group">
                  <label htmlFor="email" className="input-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="email-input"
                    required
                  />
                </div>

                <button type="submit" className="submit-button">
                  Access Documents →
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            <div className="page-header">
              <div className="badge">🔒 Screenshot Guard Active</div>
              <h1 className="page-title">Protected Image Viewer</h1>
              <p className="page-subtitle">
                Click any image to view. Screenshot protection is enabled.
              </p>
            </div>

            <div className="image-grid">
              {imageDocuments.map((image) => (
                <div
                  key={image.id}
                  className="image-card"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="image-icon">🖼️</div>
                  <h3 className="image-title">{image.title}</h3>
                  <p className="image-description">{image.description}</p>
                </div>
              ))}
            </div>

            {selectedImage && (
              <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2 className="modal-title">{selectedImage.title}</h2>
                    <button
                      className="close-button"
                      onClick={() => setSelectedImage(null)}
                    >
                      Close ✕
                    </button>
                  </div>
                  <div className="modal-body">
                    <img
                      src={selectedImage.url}
                      alt={selectedImage.title}
                      className="protected-image"
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
