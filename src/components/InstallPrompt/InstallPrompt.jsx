import { useEffect, useState } from 'react';
import { IoClose, IoDownloadOutline } from 'react-icons/io5';
import './InstallPrompt.scss';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('pwa-install-dismissed') === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!dismissed) setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [dismissed]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted' || outcome === 'dismissed') {
      setVisible(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
    try {
      sessionStorage.setItem('pwa-install-dismissed', '1');
    } catch {}
  };

  if (!visible) return null;

  return (
    <div className="install-prompt">
      <div className="install-content">
        <div className="install-icon">
          <IoDownloadOutline />
        </div>
        <div className="install-text">
          <strong>Install FLASH TIPS</strong>
          <span>Quick access to VIP predictions & live tips</span>
        </div>
        <button type="button" className="install-btn" onClick={handleInstall}>
          Install
        </button>
        <button type="button" className="install-close" onClick={handleDismiss} aria-label="Dismiss">
          <IoClose />
        </button>
      </div>
    </div>
  );
}
