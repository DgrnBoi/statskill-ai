export type DeviceCapability = 'MODERN_DEVICE' | 'POTATO_DEVICE';

/**
 * Silently assesses the hardware capabilities of the user's device.
 * Used to adaptive switch between Live RAG and Local Edge Caching.
 */
export async function assessDeviceCapability(): Promise<DeviceCapability> {
  // 1. Check device memory (RAM) in GB (Not supported in all browsers, falls back to 4)
  const nav = navigator as any;
  const ram = nav.deviceMemory || 4; 
  
  // 2. Check CPU cores
  const cores = navigator.hardwareConcurrency || 2; 
  
  // 3. Run a quick execution benchmark (Math calculation loop)
  const start = performance.now();
  for (let i = 0; i < 1000000; i++) { 
    Math.sqrt(i); 
  }
  const duration = performance.now() - start;

  // 4. Check Network Connectivity (if available)
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  let isNetworkPoor = false;
  if (connection) {
    const type = connection.effectiveType;
    if (type === 'slow-2g' || type === '2g' || type === '3g' || connection.saveData) {
      isNetworkPoor = true;
    }
  } else if (!navigator.onLine) {
    isNetworkPoor = true;
  }

  // Decide if the device is offline
  if (!navigator.onLine) {
    return 'POTATO_DEVICE';
  }
  
  return 'MODERN_DEVICE';
}
