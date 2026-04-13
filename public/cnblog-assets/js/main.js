;(function () {
  function initReadingProgressBar() {
    if (document.getElementById("reading-progress-bar")) return

    const bar = document.createElement("div")
    bar.id = "reading-progress-bar"
    document.body.appendChild(bar)

    const update = function () {
      const total = document.documentElement.scrollHeight - window.innerHeight
      const current = window.scrollY || window.pageYOffset || 0
      const percent = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0
      bar.style.width = percent + "%"
    }

    bar.style.opacity = "1"
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
  }

  function initClickWords() {
    const words = ["欢迎回来", "今天也要加油", "愿你顺利", "保持热爱", "继续前进"]
    const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"]
    let index = 0
    let lastTs = 0

    document.body.addEventListener("click", function (event) {
      const now = Date.now()
      if (now - lastTs < 220) return
      lastTs = now

      const word = document.createElement("span")
      word.className = "cnblog-click-word"
      word.textContent = words[index]
      word.style.left = event.pageX + "px"
      word.style.top = event.pageY + "px"
      word.style.color = colors[Math.floor(Math.random() * colors.length)]
      document.body.appendChild(word)

      index = (index + 1) % words.length
      requestAnimationFrame(function () {
        word.classList.add("is-rising")
      })

      window.setTimeout(function () {
        word.remove()
      }, 1000)
    })
  }

  function boot() {
    initReadingProgressBar()
    initClickWords()
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot)
  } else {
    boot()
  }
})()
