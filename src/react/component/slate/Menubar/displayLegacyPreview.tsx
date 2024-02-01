export function displayLegacyPreview(html: string) {
  const previewWindow = window.open(
    formURL<TQueryPath>('contentmanager/DisplayQuestion.do', true),
    'previewWindow',
    'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=960,height=800',
  )
  if (previewWindow)
    previewWindow.window.onload = () => {
      const configURL =
        'https://cdn.mobius.cloud/third-party/locked/MathEditor/1381409/MathEditor/../../../../740fc47/mathjax-config/0.0.0/MathJaxConfig.js'
      const configScript =
        'config_options = {"MathJaxCDN":"https://cdn.mobius.cloud/third-party/locked/mathjax/2.7.2/"}'
      const sources = [
        'https://cdn.mobius.cloud/third-party/locked/mathjax/2.7.2/MathJax.js?config=TeX-AMS-MML_HTMLorMML',
        'https://cdn.mobius.cloud/third-party/locked/MathEditor/1381409/MathEditor/../../../../740fc47/mathjax-config/0.0.0/MathJaxConfig.js&delayStartupUntil=configured',
      ]

      previewWindow.window.document.body.innerHTML = html
      typesetMathJax(sources, configScript, configURL, previewWindow)
    }
}
