export const GTM_ID = 'GTM-NPC98QHL';

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export const pageview = (url: string): void => {
  window.dataLayer?.push({
    event: 'pageview',
    page: url,
  });
};
