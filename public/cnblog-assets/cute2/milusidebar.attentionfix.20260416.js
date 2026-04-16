function milusidebar(setting) {
  var c = {
    names: "alphaRaWaY",
    notice:
      '<b>欢迎回家！</b><span>不来玩玩<a href="https://osu.ppy.sh/" target="_blank">osu!</a>吗，一款棒到不行的音乐节奏游戏❤❤❤</span>',
    headerUrl: "https://images.cnblogs.com/cnblogs_com/miluluyo/1765646/o_200519075219notice5.png",
    follow: "",
    sidebarInfo: [[{ icon: "#icon-github1", url: "https://github.com", title: "GitHub" }]],
    signature: "",
    popper_weixin: "",
    portrait: ""
  };

  if (window.jQuery && window.jQuery.extend) {
    window.jQuery.extend(c, setting || {});
  } else {
    var s = setting || {};
    for (var k in s) {
      if (Object.prototype.hasOwnProperty.call(s, k)) c[k] = s[k];
    }
  }

  sidebar(c);
}

function sidebar(c) {
  var $ = window.jQuery;
  if (!$) return;

  // Hard cut suspected legacy mojibake sources.
  $("#p_b_follow").hide();
  $("#profile_block").hide();

  var $title = $("#sidebar_news .catListTitle").first();
  if ($title.length) {
    $title.text("个人信息");
  }

  $("#cnb-side-notice").remove();
  var noticeHtml =
    '<div id="cnb-side-notice">' +
    '<h3 class="catListTitle">公告</h3>' +
    '<div style="background:url(' +
    c.headerUrl +
    ');height:150px;background-size:auto 150px;background-repeat:no-repeat;background-position:center;margin-bottom:10px">' +
    '<p class="notice_title">' +
    (c.notice || "") +
    "</p></div></div>";

  if ($title.length) {
    $title.before(noticeHtml);
  }

  function removeBrokenSpanText() {
    var targets = ["#blog-news", "#sidebar_news", "#sideBarMain", "#profile_block", "#info_table"];
    targets.forEach(function (selector) {
      var $root = $(selector);
      if (!$root.length) return;
      $root
        .find("*")
        .addBack()
        .contents()
        .filter(function () {
          return this.nodeType === 3 && /\/span>/i.test((this.nodeValue || "").trim());
        })
        .remove();
    });
  }

  if (c.follow && !$("#cnb-follow-btn").length) {
    var $btn = $("<div id=\"cnb-follow-btn\" class=\"attention\"></div>");
    var $label = $("<span></span>");
    $label.text("+加关注");
    $btn.append($label);
    $btn.on("click", function () {
      if (typeof follow === "function") {
        follow(c.follow);
      }
    });
    $("#profile_block").before($btn);
  }

  $("#cnb-side-info").remove();
  var sidebarInfoHtml =
    '<div id="cnb-side-info"><p class="catListTitle" style="font-weight:500;margin-top:10px;">' +
    (c.names || "") +
    '</p><table id="info_table">';

  var groups = Array.isArray(c.sidebarInfo) ? c.sidebarInfo : [];
  for (var i = 0; i < groups.length; i++) {
    sidebarInfoHtml += "<tr>";
    var row = groups[i] || [];
    for (var j = 0; j < row.length; j++) {
      var item = row[j] || {};
      var className = item.classname || "";
      var node = item.img
        ? '<img class="icon ' + className + '" src="' + item.img + '" alt="' + (item.title || "") + '" style="width:1.5em;height:1.5em;vertical-align:middle;">'
        : '<svg class="icon ' + className + '" aria-hidden="true"><use xlink:href="' + (item.icon || "#icon-github1") + '"></use></svg>';

      if (item.click === false || !item.url) {
        sidebarInfoHtml += "<td>" + node + "</td>";
      } else {
        sidebarInfoHtml +=
          '<td><a href="' + item.url + '" target="_blank" title="' + (item.title || "") + '">' + node + "</a></td>";
      }
    }
    sidebarInfoHtml += "</tr>";
  }

  sidebarInfoHtml += '</table><p class="catListTitle" style="margin-bottom:20px">' + (c.signature || "") + "</p></div>";

  $("#blog-news").append(sidebarInfoHtml);
  removeBrokenSpanText();
  setTimeout(removeBrokenSpanText, 200);
  setTimeout(removeBrokenSpanText, 1000);
  $("#cnb-portrait, #portrait").off("mouseenter.cleanBrokenSpan").on("mouseenter.cleanBrokenSpan", removeBrokenSpanText);

  if (!$("#cnb-calendar-title").length) {
    $("#blog-calendar").before('<h3 id="cnb-calendar-title" class="catListTitle">日历</h3>');
  }

  if (typeof window.tippy === "function" && c.popper_weixin) {
    window.tippy(".popper_weixin", {
      content: c.popper_weixin,
      theme: "tomato",
      allowHTML: true,
      animation: "scale",
      duration: 500,
      arrow: true,
      hideOnClick: "false",
      interactive: true
    });
  }

  if (c.portrait) {
    $("#cnb-portrait").remove();
    $("#profile_block").before('<div id="cnb-portrait"><div id="portrait"><img src="' + c.portrait + '" /></div></div>');
  }

  var search = '<svg class="icon search_icon" aria-hidden="true" onclick="zzk_go()"><use xlink:href="#icon-sousuo"></use></svg>';
  $(".input_my_zzk").each(function () {
    var $input = $(this);
    if (!$input.next(".search_icon").length) {
      $input.after(search);
    }
  });

  $(".input_my_zzk").eq(1).parent().find("svg").attr("onclick", "google_go()");
  $(".input_my_zzk").eq(0).attr("placeholder", "搜索关键词~");
  $(".input_my_zzk").eq(1).attr("placeholder", "谷歌内搜索~");
}

