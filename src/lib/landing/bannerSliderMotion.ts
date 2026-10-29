/** Scroll-driven hero banner motion (pinned scrub). */

export type BannerSliderMetrics = {
  sectionHeight: number;
  overlayContentHeight: number;
};

export function measureBannerSliderMetrics(
  sectionEl: HTMLElement,
  overlayContentEl: HTMLElement,
  overlayEl: HTMLElement,
): BannerSliderMetrics {
  const sectionHeight = sectionEl.getBoundingClientRect().height;
  let overlayContentHeight = overlayContentEl.getBoundingClientRect().height;
  const overlayHalf = overlayEl.getBoundingClientRect().height / 2;
  if (overlayContentHeight < overlayHalf) {
    overlayContentHeight = overlayHalf;
  }
  return { sectionHeight, overlayContentHeight };
}

export function bannerSliderFrame(
  progress: number,
  { sectionHeight, overlayContentHeight }: BannerSliderMetrics,
) {
  const p = Math.min(1, Math.max(0, progress));
  const lift = overlayContentHeight / 2;
  const overlayY = sectionHeight + (-lift - sectionHeight) * p;

  return {
    progress: p,
    overlayY,
    overlayContentHeightPx: overlayContentHeight,
    overlayStop: `${Math.round(p * 100)}%`,
    marqueeXPercent: -15 * p,
    introOpacity: 1 - 0.9 * p,
  };
}
