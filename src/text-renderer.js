export default function getTextRenderer(flags) {
  if (!flags?.isEnabled('IM_5791_SVG_LABEL_RENDERING')) {
    return undefined;
  }

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? undefined : 'svg';
}
