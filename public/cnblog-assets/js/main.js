;(function () {
  var config = window.CNBLOG_THEME_CONFIG || {}
  var words = []
  var wordIndex = 0

  function getJsBaseUrl() {
    var script = document.currentScript
    if (!script || !script.src) return ""
    return script.src.replace(/\/main\.js(\?.*)?$/, "")
  }

  function getAssetRootUrl() {
    var jsBase = getJsBaseUrl()
    return jsBase ? jsBase.replace(/\/js$/, "") : ""
  }

  function getWordsUrl() {
    if (config.wordsUrl) return resolvePublicUrl(config.wordsUrl)
    var assetRoot = getAssetRootUrl()
    if (!assetRoot) return "/words.txt"
    return assetRoot.replace(/\/cnblog-assets$/, "") + "/words.txt"
  }

  function isAbsoluteUrl(url) {
    return /^(https?:)?\/\//i.test(url) || /^data:/i.test(url)
  }

  function resolvePublicUrl(url) {
    if (!url) return ""
    if (isAbsoluteUrl(url)) return url

    var assetRoot = getAssetRootUrl()
    if (!assetRoot) return url

    var publicRoot = assetRoot.replace(/\/cnblog-assets$/, "")
    if (url.charAt(0) === "/") return publicRoot + url
    return publicRoot + "/" + url
  }

  function randomRgb() {
    return (
      "rgb(" +
      ~~(255 * Math.random()) +
      "," +
      ~~(255 * Math.random()) +
      "," +
      ~~(255 * Math.random()) +
      ")"
    )
  }

  function loadWords() {
    var url = getWordsUrl()
    return fetch(url, { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) throw new Error("Load words failed")
        return response.text()
      })
      .then(function (text) {
        return text
          .split(/\r?\n/)
          .map(function (line) {
            return line.trim()
          })
          .filter(Boolean)
      })
      .catch(function () {
        return []
      })
  }

  function initReadingProgressBar() {
    if (document.getElementById("reading-progress-bar")) return

    var bar = document.createElement("div")
    bar.id = "reading-progress-bar"
    document.body.appendChild(bar)

    setTimeout(function () {
      bar.style.opacity = "1"
    }, 50)

    var update = function () {
      var total = document.documentElement.scrollHeight - window.innerHeight
      var current = window.scrollY || window.pageYOffset || 0
      var percent = total > 0 ? Math.round((current / total) * 100) : 0
      bar.style.width = percent + "%"
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
  }

  function initLoadingAnimation() {
    window.addEventListener(
      "load",
      function () {
        var loadingBox = document.getElementById("loading-box")
        if (loadingBox) {
          loadingBox.className = "loaded"
        }

        var bg = document.getElementById("bg")
        if (bg) {
          bg.style.cssText = "transform: scale(1); filter: blur(0px); transition: ease 1.5s;"
        }

        var covers = document.querySelectorAll(".cover")
        covers.forEach(function (cover) {
          cover.style.cssText = "opacity: 1; transition: ease 1.5s;"
        })

        var section = document.getElementById("section")
        if (section) {
          section.style.cssText =
            "transform: scale(1) !important; opacity: 1 !important; filter: blur(0px) !important"
        }

        setTimeout(function () {
          initReadingProgressBar()
        }, 1500)
      },
      false
    )
  }

  function initClickWords() {
    document.body.addEventListener("click", function (event) {
      if (!words.length) return

      var word = document.createElement("span")
      word.className = "cnblog-click-word"
      word.textContent = words[wordIndex]
      wordIndex = (wordIndex + 1) % words.length

      var x = event.pageX
      var y = event.pageY
      word.style.left = x + "px"
      word.style.top = y - 20 + "px"
      word.style.color = randomRgb()

      document.body.appendChild(word)

      requestAnimationFrame(function () {
        word.style.top = y - 180 + "px"
        word.style.opacity = "0"
      })

      setTimeout(function () {
        word.remove()
      }, 1500)
    })
  }

  function isDesktopMusicEnabled() {
    var isDesktop = window.matchMedia("(min-width: 1000px)").matches
    var allowMusic = config.enableMusic !== false
    return isDesktop && allowMusic
  }

  function appendCss(href) {
    if (document.querySelector('link[data-cnblog-theme="' + href + '"]')) return
    var link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = href
    link.setAttribute("data-cnblog-theme", href)
    document.head.appendChild(link)
  }

  function appendScript(src, onload) {
    if (document.querySelector('script[data-cnblog-theme="' + src + '"]')) {
      if (onload) onload()
      return
    }
    var script = document.createElement("script")
    script.src = src
    script.setAttribute("data-cnblog-theme", src)
    script.onload = function () {
      if (onload) onload()
    }
    document.body.appendChild(script)
  }

  function initMusicPlayer() {
    if (!isDesktopMusicEnabled()) return

    var assetRoot = getAssetRootUrl()
    var jsBase = getJsBaseUrl()
    if (!assetRoot || !jsBase) return

    appendCss(assetRoot + "/css/APlayer.min.css")

    if (!document.getElementById("player")) {
      var player = document.createElement("div")
      player.id = "player"
      player.className = "aplayer aplayer-withlist aplayer-fixed"
      player.setAttribute("data-id", config.neteasePlaylistId || "17737608590")
      player.setAttribute("data-server", "netease")
      player.setAttribute("data-type", "playlist")
      player.setAttribute("data-order", "random")
      player.setAttribute("data-fixed", "true")
      player.setAttribute("data-listfolded", "true")
      player.setAttribute("data-theme", config.playerTheme || "#2D8CF0")
      document.body.appendChild(player)
    }

    appendScript(jsBase + "/APlayer.min.js", function () {
      appendScript(jsBase + "/Meting.min.js", function () {
        var ref = setInterval(function () {
          var playBtn = document.querySelector(".aplayer-play")
          if (playBtn) {
            playBtn.click()
            clearInterval(ref)
          }
        }, 2000)
      })
    })
  }

  function createNoticeCardHtml(notice) {
    var links = Array.isArray(notice.links)
      ? notice.links
          .slice(0, 3)
          .map(function (item) {
            if (!item || !item.href || !item.text) return ""
            return (
              '<a class="cnb-notice-link" href="' +
              item.href +
              '" target="_blank" rel="noreferrer">' +
              item.text +
              "</a>"
            )
          })
          .join("")
      : ""

    var coverUrl = resolvePublicUrl(notice.coverImage || "")
    var avatarUrl = resolvePublicUrl(notice.avatarImage || "")
    var qrcodeUrl = resolvePublicUrl(notice.qrcodeImage || "")

    var cover = coverUrl ? ' style="background-image:url(\'' + coverUrl + '\')"' : ""
    var avatar = avatarUrl
      ? '<img class="cnb-notice-avatar" src="' +
        avatarUrl +
        '" alt="avatar" referrerpolicy="no-referrer" crossorigin="anonymous">'
      : ""
    var qrcode = qrcodeUrl
      ? '<img class="cnb-notice-qrcode" src="' +
        qrcodeUrl +
        '" alt="qrcode" referrerpolicy="no-referrer" crossorigin="anonymous">'
      : ""

    return (
      '<div id="cnb-notice-card" class="cnb-notice-card">' +
      '<div class="cnb-notice-cover"' +
      cover +
      "></div>" +
      '<div class="cnb-notice-main">' +
      avatar +
      '<div class="cnb-notice-name">' +
      (notice.name || "我的博客") +
      "</div>" +
      '<div class="cnb-notice-desc">' +
      (notice.desc || "") +
      "</div>" +
      '<div class="cnb-notice-links">' +
      links +
      "</div>" +
      qrcode +
      "</div>" +
      "</div>"
    )
  }

  function initSidebarNotice() {
    var notice = (config.notice || {})
    if (notice.enabled === false) return
    if (document.getElementById("cnb-notice-card")) return

    var host =
      document.getElementById("blog-news") ||
      document.getElementById("sidebar_news") ||
      document.querySelector("#sideBarMain")

    if (!host) return

    var wrapper = document.createElement("div")
    wrapper.innerHTML = createNoticeCardHtml(notice)
    var card = wrapper.firstElementChild
    if (!card) return

    host.insertAdjacentElement("afterbegin", card)
  }

  function boot() {
    initLoadingAnimation()
    initMusicPlayer()
    initSidebarNotice()

    loadWords().then(function (list) {
      words = list
      initClickWords()
    })
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot)
  } else {
    boot()
  }
})()
