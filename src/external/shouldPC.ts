
if (
  /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(
    navigator.userAgent
  )
) {
  window.addEventListener("DOMContentLoaded", function() {
    const message = document.createElement("div")
    message.style.cssText =
      "width:100vw;height:100vh;line-height:100vh;position:fixed;left:0px;top:0px;background:white;text-align:center;z-index:999;font-size:40px;"
    message.textContent = "Mobile resolution not supported"
    document.body.append(message)
  })
}
