function milusidebar(setting) {
  var defaults = {
    names: '个人信息',
    notice: '<b>欢迎回家！</b>',
    headerUrl: 'https://images.cnblogs.com/cnblogs_com/miluluyo/1765646/o_200519075219notice5.png',
    follow: '',
    sidebarInfo: [],
    signature: '',
    popper_weixin: '',
    portrait: ''
  };

  var c = $.extend({}, defaults, setting || {});
  sidebar(c);
}

function sidebar(c) {
  $('#sidebar_news .catListTitle').text('个人信息');
  $('#sidebar_news .catListTitle').before(
    '<h3 class="catListTitle">公告</h3>' +
      '<div style="background:url(' + c.headerUrl + ');height:150px;background-size:auto 150px;background-repeat:no-repeat;background-position:center;margin-bottom:10px">' +
      '<p class="notice_title">' + c.notice + '</p>' +
      '</div>'
  );

  if (c.follow) {
    $('#profile_block').before(
      '<div class="attention" onclick="follow(\'' + c.follow + '\')"><span>+加关注</span></div>'
    );
  }

  var sidebarInfoHtml =
    '<p class="catListTitle" style="font-weight:500;margin-top:10px;">' +
    c.names +
    '</p><table id="info_table" style="">';

  var sidebarInfo = Array.isArray(c.sidebarInfo) ? c.sidebarInfo : [];
  for (var i = 0; i < sidebarInfo.length; i++) {
    sidebarInfoHtml += '<tr>';
    for (var j = 0; j < sidebarInfo[i].length; j++) {
      var item = sidebarInfo[i][j] || {};
      var className = item.classname ? item.classname : '';
      var node = item.img
        ? '<img class="icon ' + className + '" src="' + item.img + '" alt="' + (item.title || '') + '" style="width:1.5em;height:1.5em;vertical-align:middle;">'
        : '<svg class="icon ' + className + '" aria-hidden="true"><use xlink:href="' + (item.icon || '') + '"></use></svg>';

      if (item.click === false) {
        sidebarInfoHtml += '<td>' + node + '</td>';
      } else {
        sidebarInfoHtml +=
          '<td><a href="' + (item.url || '#') + '" target="_blank" title="' + (item.title || '') + '">' +
          node +
          '</a></td>';
      }
    }
    sidebarInfoHtml += '</tr>';
  }

  sidebarInfoHtml +=
    '</table><p class="catListTitle" style="margin-bottom:20px">' +
    (c.signature || '') +
    '</p>';

  $('#blog-news').append(sidebarInfoHtml);
  $('#blog-calendar').before('<h3 class="catListTitle">日历</h3>');

  if (typeof tippy === 'function' && c.popper_weixin) {
    tippy('.popper_weixin', {
      content: c.popper_weixin,
      theme: 'tomato',
      allowHTML: true,
      animation: 'scale',
      duration: 500,
      arrow: true,
      hideOnClick: 'false',
      interactive: true
    });
  }

  if (c.portrait) {
    var portrait = '<div id="portrait"><img src="' + c.portrait + '" /></div>';
    $('#profile_block').before(portrait);
  }

  var search =
    '<svg class="icon search_icon" aria-hidden="true" onclick="zzk_go()"><use xlink:href="#icon-sousuo"></use></svg>';
  $('.input_my_zzk').after(search);
  $('.input_my_zzk').eq(1).parent().find('svg').attr('onclick', 'google_go()');
  $('.input_my_zzk').eq(0).attr('placeholder', '搜索关键词~');
  $('.input_my_zzk').eq(1).attr('placeholder', '谷歌内搜索~');
}