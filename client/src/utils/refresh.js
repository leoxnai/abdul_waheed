// Trigger frontend data refresh so admin changes show immediately on the public site
export function refreshSite() {
  if (typeof window.__refetchSiteData === 'function') {
    window.__refetchSiteData()
  }
}
