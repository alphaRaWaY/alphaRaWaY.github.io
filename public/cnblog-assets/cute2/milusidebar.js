function milusidebar(setting) {
  var c = {
    names: "alphaRaWaY",
    notice:
      "<b>\u6E29\u99A8\u63D0\u793A</b><span><a href=\"https://github.com/miluluyo/cute-cnblogs\" target=\"_blank\">cute-cnblogs</a> &nbsp;\u6837\u5F0F\u5DF2\u5F00\u6E90</span>",
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

  var $title = $("#sidebar_news .catListTitle").first();
  if ($title.length) {
    $title.text("\u4E2A\u4EBA\u4FE1\u606F");
  }

  $("#cnb-side-notice").remove();
  var noticeHtml =
    '<div id="cnb-side-notice">' +
    '<h3 class="catListTitle">\u516C\u544A</h3>' +
    '<div style="background:url(' +
    c.headerUrl +
    ');height:150px;background-size:auto 150px;background-repeat:no-repeat;background-position:center;margin-bottom:10px">' +
    '<p class="notice_title">' +
    (c.notice || "") +
    "</p></div></div>";

  if ($title.length) {
    $title.before(noticeHtml);
  }

  if (c.follow && !$("#cnb-follow-btn").length) {
    $("#profile_block").before(
      '<div id="cnb-follow-btn" class="attention" onclick="follow(\'' +
        c.follow +
        '\')"><span>+\u52A0\u5173\u6CE8</span></div>'
    );
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
        ? '<img class="icon ' +
          className +
          '" src="' +
          item.img +
          '" alt="' +
          (item.title || "") +
          '" style="width:1.5em;height:1.5em;vertical-align:middle;">'
        : '<svg class="icon ' +
          className +
          '" aria-hidden="true"><use xlink:href="' +
          (item.icon || "#icon-github1") +
          '"></use></svg>';

      if (item.click === false || !item.url) {
        sidebarInfoHtml += "<td>" + node + "</td>";
      } else {
        sidebarInfoHtml +=
          '<td><a href="' +
          item.url +
          '" target="_blank" title="' +
          (item.title || "") +
          '">' +
          node +
          "</a></td>";
      }
    }
    sidebarInfoHtml += "</tr>";
  }

  sidebarInfoHtml +=
    '</table><p class="catListTitle" style="margin-bottom:20px">' +
    (c.signature || "") +
    "</p></div>";

  $("#blog-news").append(sidebarInfoHtml);

  if (!$("#cnb-calendar-title").length) {
    $("#blog-calendar").before('<h3 id="cnb-calendar-title" class="catListTitle">\u65E5\u5386</h3>');
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
  $(".input_my_zzk").eq(0).attr("placeholder", "\u641C\u7D22\u5173\u952E\u8BCD~");
  $(".input_my_zzk").eq(1).attr("placeholder", "\u8C37\u6B4C\u5185\u641C\u7D22~");
}
