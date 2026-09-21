import { updateUser, updateUserLocality  } from "../firebase";


/*export const checkSubscriptionStatus = (user, setNotification) => {
  if (!user || !user.isPremium) return;

  const currentTime = new Date().getTime();
  const previousTime = new Date(user.subscription.subDate);
  const timeDifference = currentTime - previousTime;

  const timeLimits = {
    "Daily": 24 * 60 * 60 * 1000,
    "Weekly": 7 * 24 * 60 * 60 * 1000,
    "Monthly": 30 * 24 * 60 * 60 * 1000, // Simplified, adjust as needed
    "Yearly": 365 * 24 * 60 * 60 * 1000
  };

  if (timeDifference >= timeLimits[user.subscription.plan]) {
    //updateUser(user.uid, false, null, setNotification);
  }
};*/

export const checkSubscriptionStatus = async (user, setNotification, setUser) => {
  if (!user?.isPremium || !user.subscription?.subDate) return;

  const timeLimits = {
    Daily:   1  * 24 * 60 * 60 * 1000,
    Weekly:  7  * 24 * 60 * 60 * 1000,
    Monthly: 30 * 24 * 60 * 60 * 1000,
    Yearly:  365 * 24 * 60 * 60 * 1000,
  };

  const parseSubDate = (str) => {
    const [datePart, timePart = '00:00'] = str.split('T');
    const [y, m, d] = datePart.split('-').map(Number);
    const [hh, mm] = timePart.split(':').map(Number);
    return new Date(y, m - 1, d, hh || 0, mm || 0, 0);
  };

  const currentTime = Date.now();                 // ms number
  const startTime = parseSubDate(user.subscription.subDate).getTime();
  const timeDifference = currentTime - startTime;

  const plan = user.subscription.plan || user.subscription.billing;
  const limit = timeLimits[plan];

  if (limit === undefined) {
    console.warn('Unknown plan:', plan);
    return;
  }

  if (timeDifference >= limit) {
    // Use the correct doc ID — email or uid, whichever your users collection uses
    await updateUser(user.email, false, null, setNotification);

    // Update local state so UI reacts immediately
    if (setUser) {
      setUser(prev => ({ ...prev, isPremium: false, subscription: null }));
    }
  }
};


export const checkLocality = (user, locality) => {
  if (!user|| user.locality) return;

  if (!user.locality) {
    updateUserLocality(user.email, locality);
    return;
  }

}


// Device Detection
function detectDevice() {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isAndroid = /Android/.test(ua);
  const isWindows = /Windows/.test(ua);
  const isMac = /Macintosh/.test(ua);
  const isLinux = /Linux/.test(ua);
  
  return { isIOS, isAndroid, isWindows, isMac, isLinux, isMobile: isIOS || isAndroid };
}


export function getUserPlatform () {
  const device = detectDevice();

  if (device.isIOS) return 'ios';
  if (device.isAndroid) return 'android';
  if (device.isWindows) return 'windows';
  if (device.isMac) return 'mac';
  return 'pwa';
}