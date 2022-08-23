
module.exports = function () {
  document.getElementById("container").innerHTML += getUiFileContent("blog_settings_ui.html");

  if (blog["全局评论设置"]["启用valine评论"] === true)
    document.getElementById("blog_settings_is_valine_enabled").checked = true;

  if (blog["不使用全站内容授权协议"] === true)
    document.getElementById("blog_content_license_enabled").checked = true;

  if (blog["全局主题设置"]["是否使用第三方主题"] === true) {
    if (blog["全局主题设置"]["若使用第三方主题，是否来自本地文件"] === true) {
      document.getElementById("isUsingThirdPartyTheme").innerHTML = `
    ${langdata.USING_3RD_PARTY_THEME_FROM_LOCAL_FILE_DESCRIPTION[lang_name]}
  
  `;
    }

    if (blog["全局主题设置"]["若使用第三方主题，是否来自本地文件"] === false) {
      document.getElementById("isUsingThirdPartyTheme").innerHTML = `
      ${langdata.CURRENTLY_USING_3RD_PARTY_THEME[lang_name]}${blog["全局主题设置"]["若使用来自主题商店的第三方主题，则主题名为"]} (${blog["全局主题设置"]["若使用来自主题商店的第三方主题，则主题的更新发布日期为"]})。<br /><br />
      <button class="fluentbtn" onclick="check_thirdparty_theme_update();"><i class="fa fa-refresh"></i> ${langdata["CHECK_UPDATE"][lang_name]}: ${blog["全局主题设置"]["若使用来自主题商店的第三方主题，则主题名为"]}</button>
    </b>
  
  `;
    }

    document.getElementById("isUsingThirdPartyTheme").innerHTML += `
    <button class="fluentbtn" onclick="config_third_party_theme();"><i class="fa fa-cogs"></i> 编辑主题配置文件</button>
    `;

  } else {
    document.getElementById("isUsingThirdPartyTheme").innerHTML = `
  ${langdata.STATUS_USING_OFFICIAL_THEME[lang_name]}
  
  `;
  }

  if (blog["全局主题设置"]["是否使用背景图像"] && blog["全局主题设置"]["若使用背景图像，设置为"]["使用随机二次元图片作为背景图像（浅色背景）"])
    document.getElementById("blog_settings_is_using_acg_bg").checked = true;

  if (blog["全局评论设置"]["valine设置"]["是否使用bbg公共评论服务"]) {
    document.getElementById("leancloud_settings_detail").innerHTML = `${langdata.HINT_USING_PUBLIC_COMMENT_SERVICE[lang_name]}<a href="javascript:void(0)" onclick="disable_puclic_comment_service()">${langdata.LINK_ABANDON_PUBLIC_COMMENT_SERVICE[lang_name]}</a>`;
    document.getElementById("hint_of_use_public_comment_service").innerHTML = "";
  }

  if (blog["网站语言"] === "简体中文")
    document.getElementById("sitelang_simplified_chinese").selected = true;

  if (blog["网站语言"] === "English")
    document.getElementById("sitelang_english").selected = true;

  if (blog["启用网站公告"] === true)
    document.getElementById("website_announcement_enabled").checked = true;

  if (blog["网站公告仅在首页显示"] === true)
    document.getElementById("website_announcement_indexonly").checked = true;

  if (blog["启用自定义CSS"] === true)
    document.getElementById("blog_settings_enable_custom_css").checked = true;

  if (blog["启用自定义JS"] === true)
    document.getElementById("blog_settings_enable_custom_js").checked = true;

  if (blog["文章页面显示上一篇下一篇文章导航按钮"] === true)
    document.getElementById("enable_article_bottom_nav").checked = true;

  if (blog["提供文章文件下载"] === true)
    document.getElementById("enable_article_file_download").checked = true;

  if (blog["提供复制全文到剪贴板的选项"] === true)
    document.getElementById("enable_copy_full_article_to_clipboard").checked = true;

  document.getElementById("auto_rss_enabled").checked = blog["在对文章列表进行修改后触发rss生成"];
  document.getElementById("auto_sitemap_enabled").checked = blog["在对文章或页面列表进行修改后触发sitemap.txt生成"];

  if (blog["CDN选择"] === 1) {
    // 从列表中选择cdn地址
    document.getElementById("cdn_cho_1").checked = true;
    if (document.getElementById("cdn_cho_1").checked === true) {
      document.getElementById("cdn_cho").style.display = "block";
      document.getElementById("cdn_manual").style.display = "none";
      document.getElementById("blog_setting_cdn_frm_1").value = blog["CDN路径"];
    } else {
      document.getElementById("cdn_cho").style.display = "none";
      document.getElementById("cdn_manual").style.display = "block";
    }
  } else {
    // 手动输入cdn路径
    document.getElementById("cdn_cho_2").checked = true;
    document.getElementById("blog_setting_cdn_frm_2").value = blog["CDN路径"];
    if (document.getElementById("cdn_cho_1").checked === true) {
      document.getElementById("cdn_cho").style.display = "block";
      document.getElementById("cdn_manual").style.display = "none";
    } else {
      document.getElementById("cdn_cho").style.display = "none";
      document.getElementById("cdn_manual").style.display = "block";
    }
  }

  document.getElementById("cdn_cho_1").onchange = function () {
    if (document.getElementById("cdn_cho_1").checked === true) {
      document.getElementById("cdn_cho").style.display = "block";
      document.getElementById("cdn_manual").style.display = "none";
    } else {
      document.getElementById("cdn_cho").style.display = "none";
      document.getElementById("cdn_manual").style.display = "block";
    }
  };

  document.getElementById("cdn_cho_2").onchange = function () {
    if (document.getElementById("cdn_cho_1").checked === true) {
      document.getElementById("cdn_cho").style.display = "block";
      document.getElementById("cdn_manual").style.display = "none";
    } else {
      document.getElementById("cdn_cho").style.display = "none";
      document.getElementById("cdn_manual").style.display = "block";
    }
  };

  document.getElementById("nav_to_blog_settings").classList.add("active");
};
