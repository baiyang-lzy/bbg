const { readFileSync,writeFileSync } = require("fs");
const { dialog } = require("@electron/remote");
const marked = require("marked");

module.exports = function () {
  let path = getUrlArgs("path");
  let filename = path.replaceAll("/data/articles/", "").replaceAll("/data/pages/", "");
  let title,type;
  let original_content = readFileSync(rootDir + path, "utf-8");
  var editor_status = 0;
  if (path.indexOf("/data/articles/") !== -1) {
    // article
    type = "article";
    for (let i = 0; i < blog["文章列表"].length; i++) {
      if (blog["文章列表"][i]["文件名"] === filename) {
        title = blog["文章列表"][i]["文章标题"];
      }
    }
  } else {
    // page
    type = "page";
    for (let i = 0; i < blog["页面列表"].length; i++) {
      if (blog["页面列表"][i]["文件名"] === filename) {
        title = blog["页面列表"][i]["页面标题"];
      }
    }
  }
  document.getElementById("container").insertAdjacentHTML("beforeend",getUiFileContent(
    "markdown_editor_title_ui.html",
  ));
  document.getElementById("markdown_filename").innerHTML=`  <button id="btn_exit" class="btn btn-outline-primary">
  <i class="fa fa-arrow-left"></i>
</button>
${langdata["CURRENTLY_EDITING"][lang_name]}“${title}”`+document.getElementById("markdown_filename").innerHTML;


  /*

  // 为了获得更好的可定制性，不再使用markdown-palettes

  document.getElementById("container").insertAdjacentHTML("beforeend", `
  <div id="editor-container" style="position:fixed;height:70%;width:90%">
    <div id="editor"></div>
  </div>
  `);

  var markdownEditor = new MarkdownPalettes("#editor");
  markdownEditor.content = original_content;
  // 监听markdown预览区域的变化情况
  // 如果图片的相对路径错误则进行修复
  // 如果编辑区有更改则记录
  let MutationObserver = window.MutationObserver;
  let observer = new MutationObserver(function () {
    for (let i = 0; i < document.getElementsByTagName("img").length; i++) {
      let original_src = document.getElementsByTagName("img")[i].getAttribute("src");
      if (original_src.includes(`${rootDir}/data/${type}s/`) === false) {
        // 已经修复过的相对路径
        if (original_src.includes("http://") === false && original_src.includes("https://") === false) {
          // 来自网络的图片不属于相对路径
          let src = `${rootDir}/data/${type}s/${original_src}`;
          document.getElementsByTagName("img")[i].setAttribute("src", src);
        }
      }
    }
    editor_status=1;
  });
  observer.observe(document.getElementsByClassName("mp-preview-area")[0], { characterData: true, subtree: true, childList: true });
  setTimeout(function(){
    editor_status=0;
  },500);

  */

  // 以下为新的实现方式

  document.getElementById("container").insertAdjacentHTML("beforeend", `
  <div id="editor-container" style="position:fixed;height:70%;width:35%">
    <textarea id="editor_textarea" placeholder="Input markdown source code here" class="form-control" style="width:110%;height:100%;font-family: monospace">
    </textarea>
  </div>
  <div id="preview-section-container" style="position:fixed;height:70%;width:35%;margin-left:40%">
  
  </div>
  `);

  function render_hint_tags(){
    const langdata = {
      "INFO": {
        "简体中文": "提示",
        "English": "Hint",
        "日本語": "Hint"
      },
      "WARNING": {
        "简体中文": "注意",
        "English": "Warning",
        "日本語": "Warning"
      },
      "SUCCESS": {
        "简体中文": "成功",
        "English": "Success",
        "日本語": "Success"
      },
      "DANGER": {
        "简体中文": "危险",
        "English": "Danger",
        "日本語": "Danger"
      }
    };
    for(let i = 0; i < document.getElementsByTagName("info-hint").length; i++){
      document.getElementsByTagName("info-hint")[i].innerHTML = `<span class="hint-heading"><i class="fa fa-info-circle"></i> ${langdata["INFO"][lang_name]} </span><br />` + document.getElementsByTagName("info-hint")[i].innerHTML;
    }
    for(let i = 0; i < document.getElementsByTagName("warning-hint").length; i++){
      document.getElementsByTagName("warning-hint")[i].innerHTML = `<span class="hint-heading"><i class="fa fa-exclamation-circle"></i> ${langdata["WARNING"][lang_name]} </span><br />` + document.getElementsByTagName("warning-hint")[i].innerHTML;
    }
    for(let i = 0; i < document.getElementsByTagName("danger-hint").length; i++){
      document.getElementsByTagName("danger-hint")[i].innerHTML = `<span class="hint-heading"><i class="fa fa-exclamation-triangle"></i> ${langdata["DANGER"][lang_name]} </span><br />` + document.getElementsByTagName("danger-hint")[i].innerHTML;
    }
    for(let i = 0; i < document.getElementsByTagName("success-hint").length; i++){
      document.getElementsByTagName("success-hint")[i].innerHTML = `<span class="hint-heading"><i class="fa fa-check-circle-o"></i> ${langdata["SUCCESS"][lang_name]} </span><br />` + document.getElementsByTagName("success-hint")[i].innerHTML;
    }
  }

  function render_ref_tags(){
    const langdata = {"REFERENCE": {
      "简体中文": "参考",
      "English": "References",
      "日本語": "References"
    }};
    let ref_tags = [];
    let current_number = 1;
    for(let i = 0; i < document.getElementsByTagName("ref").length; i++){
      let ref = document.getElementsByTagName("ref")[i];
      ref_tags.push({
        "ref_name": ref.innerText,
        "ref_id": current_number,
        "ref_has_target": ref.getAttribute("url")!==undefined&&ref.getAttribute("url")!==null&&ref.getAttribute("url")!==""
      });
      document.getElementsByTagName("ref")[i].innerHTML = `<sup style="font-size: 14px;"><a href="#reference_list_id_${current_number}">[${current_number}]</a></sup>`;
      document.getElementsByTagName("ref")[i].setAttribute("style","display:inline");
      document.getElementsByTagName("ref")[i].setAttribute("id",`reference_id_${current_number}`);
      if(ref_tags[ref_tags.length-1].ref_has_target === true){
        ref_tags[ref_tags.length-1].ref_target = ref.getAttribute("url");
      }
      current_number += 1;
    }

    if(ref_tags.length !== 0){
      let ref_html = `<div id="content_reference_list"><h3>${langdata.REFERENCE[lang_name]}</h3><hr />`;
      for(const ref of ref_tags){
        ref_html += `<div id="reference_list_id_${ref.ref_id}"><b>${ref.ref_id}.<a href="#reference_id_${ref.ref_id}">^</a></b>&nbsp;  ${ref.ref_has_target === false?ref.ref_name:`<a href="javascript:void(0)">${ref.ref_name}</a>`} </div>`;
      }
      ref_html += "</div>";
      document.getElementById("preview-section-container").innerHTML += ref_html;
    }
  }

  const preview_markdown_content = () => {
    const markdown_content = document.getElementById("editor_textarea").value;
    const html_content = marked.marked(markdown_content, { baseUrl: `${rootDir}/data/${type}s}` });
    document.getElementById("preview-section-container").innerHTML = html_content;
    render_hint_tags();
    render_ref_tags();
  };

  document.getElementById("editor_textarea").onkeyup = ()=>{
    preview_markdown_content();
    editor_status = 1;
  };

  document.getElementById("editor_textarea").value = original_content;

  preview_markdown_content();

  document.getElementById("btn_help").onclick=function(){
    let text=langdata["MARKDOWN_EDITOR_USAGE_DETAIL"][lang_name];
    dialog.showMessageBoxSync({message: text});
  };

  const exit_markdown_editor=function(){
    if(editor_status === 0){
      window.location.href=`./${type}_manager.html?rootdir=${rootDir}`;
    }else if(dialog.showMessageBoxSync({buttons: [langdata["OK"][lang_name],langdata["CANCEL"][lang_name]],message:langdata["WARN_UNSAVED_CHANGES"][lang_name]}) === 0){
      window.location.href=`./${type}_manager.html?rootdir=${rootDir}`;
    }
  };
  document.getElementById("btn_exit").onclick=exit_markdown_editor;

  const markdown_editor_save_changes=function(){
    writeFileSync(`${rootDir}/${path}`,document.getElementById("editor_textarea").value);
    document.getElementById("btn_save_changes").innerHTML="<i class=\"fa fa-check\"></i> "+langdata["ALREADY_SAVED"][lang_name];
    editor_status=0;
    setTimeout(function(){
      document.getElementById("btn_save_changes").innerHTML="<i class=\"fa fa-check\"></i> "+langdata["SAVE_CHANGES_CTRL_S"][lang_name];
    },1200);
  };

  document.getElementById("btn_save_changes").onclick=markdown_editor_save_changes;

  document.getElementById("btn_change_to_default_editor").onclick=function(){
    if(editor_status === 1){
      if(dialog.showMessageBoxSync({buttons: [langdata["OK"][lang_name],langdata["CANCEL"][lang_name]],message:langdata["WARN_UNSAVED_CHANGES_BEFORE_SWITCHING_TO_SYSTEM_DEFAULT_EDITOR"][lang_name]}) === 0){
        shell.openPath(`${rootDir}/${path}`);
        window.location.href=`./article_manager.html?rootdir=${rootDir}`;
      }
    }else{
      shell.openPath(`${rootDir}/${path}`);
      window.location.href=`./article_manager.html?rootdir=${rootDir}`;
    }
  };

  document.onkeydown = function(event){
    let toReturn = true;
    if(event.ctrlKey || event.metaKey){  // detect ctrl or cmd
      if(event.which == 83){
        markdown_editor_save_changes();
        toReturn = false;
      }
    }
  
    return toReturn;
  };

  for(let i=0;i<document.getElementsByClassName("list-group-item").length;i++){
    let original_event = document.getElementsByClassName("list-group-item")[i].getAttribute("onclick");
    document.getElementsByClassName("list-group-item")[i].setAttribute("onclick","void(0)");
    document.getElementsByClassName("list-group-item")[i].onclick=function(){
      if(editor_status === 0){
        eval(original_event);
      }else{
        if(dialog.showMessageBoxSync({buttons: [langdata["OK"][lang_name],langdata["CANCEL"][lang_name]],message:langdata["WARN_UNSAVED_CHANGES"][lang_name]}) === 0){
          eval(original_event);
        }
      }
    };
  }

};