
const fs = require("fs");
const os = require("os");

const dialog = require('@electron/remote').dialog;
const shell = require('@electron/remote').shell;
const AppPath = require('@electron/remote').app.getPath('userData');
const { copyFileSync, constants, readFileSync, existsSync } = require('fs');
const storage = require("electron-json-storage");

const langdata = require("./LangData.js");

storage.setDataPath(AppPath);

const getAppInfo = require("./getAppInfo.js");
const AppInfo = getAppInfo();
const currentProgramVersion = require("./currentProgramVersion.js");
const check_update = require("./check_update.js");




let create_new_site_dialog = new bootstrap.Modal(document.getElementById('create-new-site-dialog'));
let err_dialog = new bootstrap.Modal(document.getElementById('err-dialog'));
let info_dialog = new bootstrap.Modal(document.getElementById('info-dialog'));
let language_dialog = new bootstrap.Modal(document.getElementById('language-dialog'),{
    backdrop:"static",
    keyboard:false
});



function create_new_site_dialog_show() {

    create_new_site_dialog.show();
}

function create_new_site_dialog_hide() {
    create_new_site_dialog.hide();
}

function createErrDialog(title, content) {

    err_dialog.show();
    document.getElementById("err-dialog-title").innerHTML = title;
    document.getElementById("err-dialog-content").innerHTML = content;
}

function createInfoDialog(title, content) {

    info_dialog.show();
    document.getElementById("info-dialog-title").innerHTML = title;
    document.getElementById("info-dialog-content").innerHTML = content;
}

function create_new_site_choose_root_dir() {
    let rootDir = dialog.showOpenDialogSync({
        properties: ["openDirectory"],
    });
    if (rootDir !== undefined) {
        generateNewBlog(rootDir);

    } else {
        //用户放鸽子的情况
    }
}


function open_site() {
    let rootDir = dialog.showOpenDialogSync({
        properties: ["openDirectory"],
    });
    if (rootDir !== undefined) {

        manageSiteByRootDir(rootDir);


    }
}


function generateNewBlog(rootDir) {

    try {

        fs.mkdirSync(rootDir + "/data");
        fs.mkdirSync(rootDir + "/data/articles");
        fs.mkdirSync(rootDir + "/data/pages");

        copyFileSync(__dirname + "/blog_source/index.html", rootDir + "/index.html", constants.COPYFILE_EXCL);

        if(lang_name === "English"){
            copyFileSync(__dirname + "/blog_source/data/articles/first.english.md", rootDir + "/data/articles/first.md", constants.COPYFILE_EXCL);

            copyFileSync(__dirname + "/blog_source/data/index.english.json", rootDir + "/data/index.json", constants.COPYFILE_EXCL);
            copyFileSync(__dirname + "/blog_source/data/pages/about.english.md", rootDir + "/data/pages/about.md", constants.COPYFILE_EXCL);
    
        }

        if(lang_name === "简体中文"){
            copyFileSync(__dirname + "/blog_source/data/articles/first.zhcn.md", rootDir + "/data/articles/first.md", constants.COPYFILE_EXCL);

            copyFileSync(__dirname + "/blog_source/data/index.zhcn.json", rootDir + "/data/index.json", constants.COPYFILE_EXCL);
            copyFileSync(__dirname + "/blog_source/data/pages/about.zhcn.md", rootDir + "/data/pages/about.md", constants.COPYFILE_EXCL);
    
        }



        window.alert("博客站点初始化成功！接下来将进入博客设置页。");

        window.location.href = "./blog_settings.html?rootdir=" + rootDir;



    } catch (error) {
        create_new_site_dialog_hide();
        createErrDialog("博客站点初始化错误（ERR_CANNOT_INIT）", "未能正确的初始化博客站点。<br />请确保你选择的文件夹是一个空目录，并且你有足够的访问权限，否则可能无法正常初始化。<br />已中止初始化操作，没有任何已有文件被覆盖。<br />以下是错误日志，请将此信息报告给开发者：<br /><br />" + error);
    }


}

function manageSiteByRootDir(rootDir) {
    try {
        JSON.parse(readFileSync(rootDir + "/data/index.json", "utf8"));
        window.location.href = "./article_manager.html?rootdir=" + rootDir;
    } catch (error) {
        createErrDialog("此站点不是有效的博客站点（ERR_CANNOT_PARSE_DATA）", "博客数据文件解析失败。<br />请确保你打开了正确的博客根目录，并且博客数据文件没有损坏。<br />以下是错误日志，请将此信息报告给开发者：<br /><br />" + error);
    }
}


function openStaffDialog(){

    let staff_string = "";
    staff_string+=`<h3>${langdata["ICON_DESIGN"][lang_name]}</h3>`;
    for(let i=0;i<AppInfo.contributers["图标设计"].length;i++){
        staff_string += `<p><a href="#" onclick="shell.openExternal('${AppInfo.contributers["图标设计"][i][1]}')">${AppInfo.contributers["图标设计"][i][0]}</a></p>`
    }

    staff_string+=`<h3>${langdata["DEVELOPER"][lang_name]}</h3>`;
    for(let i=0;i<AppInfo.contributers["开发"].length;i++){
        staff_string += `<p><a href="#" onclick="shell.openExternal('${AppInfo.contributers["开发"][i][1]}')">${AppInfo.contributers["开发"][i][0]}</a></p>`
    }

    staff_string+=`<h3>${langdata["PACKAGER"][lang_name]}</h3>`;
    for(let i=0;i<AppInfo.contributers["打包"].length;i++){
        staff_string += `<p><a href="#" onclick="shell.openExternal('${AppInfo.contributers["打包"][i][1]}')">${AppInfo.contributers["打包"][i][0]}</a></p>`
    }

    staff_string+=`<h3>${langdata["TESTER"][lang_name]}</h3>`;
    for(let i=0;i<AppInfo.contributers["参与测试人员"].length;i++){
        staff_string += `<p><a href="#" onclick="shell.openExternal('${AppInfo.contributers["参与测试人员"][i][1]}')">${AppInfo.contributers["参与测试人员"][i][0]}</a></p>`
    }

    createInfoDialog(langdata["VIEW_STAFF"][lang_name],staff_string)
}

function openGroupDialog(){
    createInfoDialog(langdata["JOIN_OUR_GROUP"][lang_name],`
    
    <p>${langdata["QQ_GROUP_NUMBER"][lang_name]}</p>
    <p>${langdata["QQ_GROUP_DESCRIPTION"][lang_name]}</p>
    `);
}

storage.has("language", function (error, hasKey) {
    if (hasKey) {
        storage.get("language", function (error, data) {
           lang_name = data["name"];
           document.getElementById("info-dialog-ok").innerHTML = langdata["OK"][lang_name];
           document.getElementById("create-new-site-dialog-title").innerHTML = langdata["CREATE_NEW_SITE"][lang_name];

           document.getElementById("create-new-site-dialog-content").innerHTML = `
           
           <p>${langdata["CREATE_NEW_SITE_DESCRIPTION"][0][lang_name]}</p>
           <p><b>${langdata["CREATE_NEW_SITE_DESCRIPTION"][1][lang_name]}</b></p>
           <button type="button" class="fluentbtn fluentbtn-blue"
             onclick="create_new_site_choose_root_dir();">${langdata["SELECT_SITE_ROOT_DIRECTORY"][lang_name]}</button>
           
           `
           
           document.getElementById("create-new-site-dialog-footer").innerHTML = `
           
           <button type="button" class="fluentbtn" data-bs-dismiss="modal">${langdata["CANCEL"][lang_name]}</button>
           `;

           document.getElementsByTagName("title")[0].innerHTML = `${langdata["STARTPAGE_TITLE"][lang_name]}`;

           document.getElementById("interface_firstpart").innerHTML = `
           <h1>${langdata["STARTPAGE_TITLE"][lang_name]}</h1><br />
           <p>${langdata["STARTPAGE_DESCRIPTION"][0][lang_name]}</p>
           <p>${langdata["STARTPAGE_DESCRIPTION"][1][lang_name]}</p>

           <br />
        <p>
          <a href="#" class="fluentbtn fluentbtn-blue" id="open_site_btn" onclick="open_site()"><i class="fa fa-folder-open-o"></i> ${langdata["OPEN_EXISTING_SITE"][lang_name]}</a>
          <a href="#" class="fluentbtn fluentbtn-blue" id="create_site_btn" onclick="create_new_site_dialog_show()"><i class="fa fa-plus"></i> ${langdata["CREATE_NEW_SITE"][lang_name]}</a>
  
        </p>

           `

           document.getElementById("last_managed_site_link").innerHTML=`
           ${langdata["LAST_MANAGED_SITE"][lang_name]}<span style="font-weight: bold;"  id="last_managed_site_title"></span>`
   
            document.getElementById("bbg_settings").innerHTML = `
            <h2>${langdata["BBG_SETTINGS"][lang_name]}</h2>
        <br />
        <div id="check_update_interface">
        <i class="fa fa-smile-o"></i> ${langdata["SOFTWARE_VERSION"][lang_name]}<b><span id="current_program_version"></span></b> <a href="#" class="fluentbtn fluentbtn-blue id="check_update_btn" onclick="check_update()">${langdata["CHECK_UPDATE"][lang_name]}</a><br />
        </div>
        <br />
        <span>${langdata["UNLICENSED"][lang_name]}</span><br />
        <br />
        <button class="fluentbtn fluentbtn-blue" onclick="language_dialog.show();">Language Settings / 语言设定</button>

        <br /><br />
        <button class="fluentbtn" onclick="openStaffDialog()">${langdata["VIEW_STAFF"][lang_name]}</button>
        <button class="fluentbtn" onclick="openGroupDialog()">${langdata["JOIN_OUR_GROUP"][lang_name]}</button>
        <br /><hr />
        
            
            `

           document.getElementById("current_program_version").innerHTML = `${currentProgramVersion}`;
   
           storage.has("last_managed_site", function (error, hasKey) {
               if (hasKey) {
                   storage.get("last_managed_site", function (error, data) {
                       document.getElementById("last_managed_site").setAttribute("style", "display:block");
                       document.getElementById("last_managed_site_title").innerHTML = data["title"];
                       document.getElementById("last_managed_site").setAttribute("onclick", `manageSiteByRootDir('${data["rootdir"].replace(/\\/g, "/")}')`);
                   });
           
               } else {
           
               }
           });

           if(os.platform() === "linux"){
            if(existsSync("/usr/share/bbg/bbgvertype")){
                
                bbgvertype = readFileSync("/usr/share/bbg/bbgvertype", "utf8").replace("\n","");
                switch (bbgvertype) {
                    case "aur-bbg-git-misaka13514":
                        document.getElementById("check_update_interface").innerHTML = `
                        <h5>版本信息</h5>
                        安装通道：AUR（bbg-git）<br />
                        打包者：Misaka13514<br />
                        内部版本号：${currentProgramVersion}<br />

                        `;
                        break;
                    case "aur-bbg-zzjzxq33-misaka13514":
                        document.getElementById("check_update_interface").innerHTML = `
                        <h5>版本信息</h5>
                        安装通道：AUR（bbg）<br />
                        打包者：zzjzxq33 和 Misaka13514<br />
                        内部版本号：${currentProgramVersion}<br />

                        `;
                        break;
                    case "debpkg-mzwing":
                        document.getElementById("check_update_interface").innerHTML = `
                        <h5>版本信息</h5>
                        安装通道：DEB 包<br />
                        打包者：mzwing<br />
                        内部版本号：${currentProgramVersion}<br />

                        `;
                        break;
                    default:
                        break;
                }
            }
        }

        });


        

    } else {
        language_dialog.show();
    }
});

function select_language(language_name){
    storage.set("language", { name: language_name }, function (err) {
        window.location.reload();
    });
}

