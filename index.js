/* Compiled by kdc on Sun Jul 14 2013 22:01:54 GMT+0000 (UTC) */
(function() {
/* KDAPP STARTS */
/* BLOCK STARTS: /home/fatihacet/Applications/PixlrExpress.kdapp/app/PixlrHook.coffee */
var getHookScript,
  _this = this;

getHookScript = function(SECRETKEY) {
  return "<?php\n  \n  parse_str($_SERVER['HTTP_REFERER'], $ref);\n  \n  $key=\"" + SECRETKEY + "\";\n  \n  if (array_key_exists(\"key\", $ref)  and $ref[\"key\"]  != $key) return;\n  if (array_key_exists(\"key\", $_GET) and $_GET[\"key\"] != $key) return;\n  \n  if ($_GET[\"ping\"] == \"1\") {\n    echo \"OK\";\n  }\n  else {\n    $fileName = $_GET[\"title\"] . \".\" . $_GET[\"type\"];\n    $targetPath = $ref['meta'];\n    \n    if ($fileName != $ref[\"title\"]) {\n      $exp = explode($ref[\"title\"], $targetPath);\n      $targetPath = $exp[0] . $fileName;\n    }\n    \n    touch($targetPath);\n    $fh = fopen($targetPath, 'w') or die(\"can't open file\");\n    fwrite($fh, file_get_contents($_GET[\"image\"]));\n    fclose($fh);    \n  }\n  \n?>";
};
/* BLOCK STARTS: /home/fatihacet/Applications/PixlrExpress.kdapp/app/PixlrSettings.coffee */
var PixlrSettings, appKeyword, appName, appSlug, hookSuffix, nickname;

nickname = KD.whoami().profile.nickname;

appName = "PixlrExpress";

appKeyword = "express";

appSlug = "pixlr-express";

hookSuffix = KD.utils.getRandomNumber();

PixlrSettings = {
  hookSuffix: hookSuffix,
  appName: appName,
  appSlug: appSlug,
  src: "http://pixlr.com/" + appKeyword,
  saveIcon: "https://app.koding.com/fatihacet/Pixlr%20Editor/latest/resources/default/koding16.png",
  targetPath: "http://" + (KD.getSingleton('vmController').defaultVmName) + "/.applications/" + appSlug + "/PixlrHook/PixlrHook" + hookSuffix + ".php",
  savePath: "/tmp/PixlrExpress" + hookSuffix + "/",
  saveDir: "/home/" + nickname + "/Documents/" + appName,
  relSaveDir: "~/Documents/" + appName,
  imageName: "Default",
  fileExt: "jpg"
};
/* BLOCK STARTS: /home/fatihacet/Applications/PixlrExpress.kdapp/app/PixlrAppView.coffee */
var PixlrAppView, kiteController, nickname,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

nickname = KD.whoami().profile.nickname;

kiteController = KD.getSingleton("kiteController");

PixlrAppView = (function(_super) {
  __extends(PixlrAppView, _super);

  function PixlrAppView(options) {
    var _this = this;
    if (options == null) {
      options = {};
    }
    options.cssClass = "pixlr-container";
    PixlrAppView.__super__.constructor.call(this, options);
    this.appStorage = new AppStorage(PixlrSettings.appName, "0.1");
    this.container = new KDView({
      cssClass: "pixlr-container"
    });
    this.container.addSubView(this.dropTarget = new KDView({
      cssClass: "pixlr-drop-target",
      bind: "dragstart dragend dragover drop dragenter dragleave"
    }));
    this.dropTarget.hide();
    this.appStorage.fetchStorage(function(storage) {
      var termsCheckboxLabel, termsView, warningConfirmButton;
      if (_this.appStorage.getValue("isTermsAccepted") === true) {
        return _this.init();
      } else {
        termsView = new KDView({
          cssClass: "pixlr-terms-view",
          partial: "<p class=\"pixlr-terms-header\">Warning</p>\n<p>This app can access and modify your files and also opens unencrypted connection to a third party web service, Pixlr. If you don't want to use the application you can safely close the tab.</p>\n<p class=\"confirmation\">Do you still want to use this application?</p>"
        });
        termsView.addSubView(termsCheckboxLabel = new KDLabelView({
          title: "Don't show this again",
          cssClass: "pixlr-terms-label"
        }));
        termsView.addSubView(_this.termsCheckbox = new KDInputView({
          type: "checkbox",
          cssClass: "pixlr-terms-checkbox",
          label: termsCheckboxLabel
        }));
        termsView.addSubView(warningConfirmButton = new KDButtonView({
          title: "Yes, I know the risk",
          cssClass: "clean-gray pixlr-terms-button",
          callback: function() {
            if (_this.termsCheckbox.$().is(":checked")) {
              _this.appStorage.setValue("isTermsAccepted", true);
            }
            termsView.destroy();
            return _this.init();
          }
        }));
        return _this.container.addSubView(termsView);
      }
    });
    this.dropTarget.on("drop", function(e) {
      return _this.openImage(e.originalEvent.dataTransfer.getData("Text"));
    });
  }

  PixlrAppView.prototype.init = function() {
    var dpath, healthCheck, preparation, setPermisasyon, windowController,
      _this = this;
    this.mem = "" + (Date.now()) + (KD.utils.getRandomNumber());
    this.container.setPartial(this.buildIframe());
    windowController = KD.getSingleton("windowController");
    dpath = "Web/.applications/" + PixlrSettings.appSlug + "/PixlrHook/";
    preparation = "rm -rf " + dpath + " ; mkdir -p " + dpath + " ; mkdir -p " + PixlrSettings.saveDir;
    healthCheck = "curl --silent 'http://" + (KD.getSingleton('vmController').defaultVmName) + "/.applications/" + PixlrSettings.appSlug + "/PixlrHook/PixlrHook" + PixlrSettings.hookSuffix + ".php?ping=1&key=" + this.mem + "'";
    setPermisasyon = "chmod 777 " + PixlrSettings.savePath;
    windowController.on("DragEnterOnWindow", function() {
      return _this.dropTarget.show();
    });
    windowController.on("DragExitOnWindow", function() {
      return _this.dropTarget.hide();
    });
    this.doKiteRequest("" + preparation, function() {
      var content, hookFile;
      content = getHookScript(_this.mem);
      hookFile = FSHelper.createFileFromPath("" + dpath + "PixlrHook" + PixlrSettings.hookSuffix + ".php");
      return hookFile.save(content, function(err) {
        if (err) {
          return _this.warnUser();
        }
        return _this.doKiteRequest("" + healthCheck, function(res) {
          var folder;
          if (res !== "OK") {
            _this.warnUser();
          }
          folder = FSHelper.createFileFromPath("" + PixlrSettings.savePath, "folder");
          return folder.save(function(err, res) {
            return _this.doKiteRequest("" + setPermisasyon, function(res) {
              return _this.registerFolderWatcher();
            });
          });
        });
      });
    });
    return this.appStorage.fetchStorage(function(storage) {
      var content, disableNotificationButton, modal, notificationCheckboxLabel;
      if (_this.appStorage.getValue("disableNotification") === true) {
        return;
      }
      content = new KDView({
        partial: "<div class=\"pixlr-how-to\">\n  <p><strong>How to use Pixlr Editor</strong></p>\n  <p>1- You can drag and drop an image over pixlr, and when you save it, it will overwrite the original file.</p>\n  <p>2- If you change the name, it will save it to where it came from, with the new name.</p>\n  <p>3- If you open random images, and save, you can find them at e.g. ./Documents/Pixlr/yourImage.jpg\"</p>\n  \n  <p class=\"last\">Enjoy! Please clone and make it better :)</p>\n</div>"
      });
      content.addSubView(notificationCheckboxLabel = new KDLabelView({
        title: "Don't show this again",
        cssClass: "pixlr-notification-label"
      }));
      content.addSubView(_this.notificationCheckbox = new KDInputView({
        type: "checkbox",
        cssClass: "pixlr-notification-checkbox",
        label: notificationCheckboxLabel
      }));
      content.addSubView(disableNotificationButton = new KDButtonView({
        title: "Close",
        cssClass: "clean-gray",
        callback: function() {
          if (_this.notificationCheckbox.$().is(":checked")) {
            _this.appStorage.setValue("disableNotification", true);
          }
          return modal.destroy();
        }
      }));
      modal = new KDModalView({
        title: "How to use Pixlr Editor",
        cssClass: "pixlr-how-to-modal",
        overlay: true
      });
      return modal.addSubView(content);
    });
  };

  PixlrAppView.prototype.openImage = function(path) {
    var fileExt, image, imageExtensions, timestamp, userSitesDomain,
      _this = this;
    path = FSHelper.plainPath(path);
    fileExt = this.getFileExtension(path);
    userSitesDomain = KD.config.userSitesDomain;
    imageExtensions = ["png", "gif", "jpg", "jpeg", "bmp", "svg", "tif", "tiff"];
    if (fileExt && imageExtensions.indexOf(fileExt) > -1) {
      PixlrSettings.fileExt = fileExt;
      timestamp = Date.now();
      image = "Web/.applications/" + PixlrSettings.appSlug + "/" + timestamp;
      PixlrSettings.imageName = FSHelper.getFileNameFromPath(path);
      return this.doKiteRequest("cp " + path + " " + image, function(res) {
        PixlrSettings.image = "http://" + (KD.getSingleton('vmController').defaultVmName) + "/.applications/" + PixlrSettings.appSlug + "/" + timestamp;
        _this.refreshIframe();
        return KD.utils.wait(12000, function() {
          return _this.doKiteRequest("rm " + image);
        });
      });
    } else {
      return new KDNotificationView({
        cssClass: "error",
        title: "Dropped file must be an image!"
      });
    }
  };

  PixlrAppView.prototype.buildIframeSrc = function(useEscape, isSplashView) {
    var amp, img;
    amp = useEscape ? '&amp;' : '&';
    img = isSplashView ? "" : "image=" + PixlrSettings.image;
    return "" + PixlrSettings.src + "/?" + img + "&title=" + PixlrSettings.imageName + "&target=" + PixlrSettings.targetPath + amp + "meta=" + PixlrSettings.savePath + "&icon=" + PixlrSettings.saveIcon + "&referer=Koding&type=" + PixlrSettings.fileExt + "&key=" + this.mem;
  };

  PixlrAppView.prototype.buildIframe = function() {
    return "<iframe id=\"pixlr\" type=\"text/html\" width=\"100%\" height=\"100%\" frameborder=\"0\" \n  src=\"" + (this.buildIframeSrc(true, true)) + "\"\n></iframe>";
  };

  PixlrAppView.prototype.refreshIframe = function() {
    return document.getElementById("pixlr").setAttribute("src", this.buildIframeSrc(false));
  };

  PixlrAppView.prototype.warnUser = function() {
    return new KDModalView({
      title: "Cannot save!",
      overlay: true,
      content: "<div class=\"pixlr-cannot-save\">\n  Pixlr cannot access the little php file it needs \n  to be able to save files (./Sites/your-domain/PixlrHook/PixlrHook.php)\n  You either deleted it, or made it inaccessible somehow (think .htaccess)\n  \n  Reinstalling Pixlr might fix it, but not guaranteed.\n  \n  If you want this be fixed, you should convince someone to continue developing Pixlr.kdapp :)\n</div>"
    });
  };

  PixlrAppView.prototype.getFileExtension = function(path) {
    var extension, fileName, name, _ref;
    fileName = path || "";
    _ref = fileName.split("."), name = _ref[0], extension = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
    return extension = extension.length === 0 ? "" : extension.last;
  };

  PixlrAppView.prototype.registerFolderWatcher = function() {
    var path, vmName,
      _this = this;
    vmName = KD.singletons.vmController.defaultVmName;
    path = PixlrSettings.savePath;
    return kiteController.run({
      kiteName: "os",
      method: "fs.readDirectory",
      vmName: vmName,
      withArgs: {
        path: path,
        onChange: function(change) {
          return _this.moveFile(change.file.name);
        }
      }
    });
  };

  PixlrAppView.prototype.moveFile = function(fileName) {
    var _this = this;
    return this.doKiteRequest("cp " + PixlrSettings.savePath + fileName + " " + PixlrSettings.saveDir, function(res) {
      return new KDNotificationView({
        type: "mini",
        cssClass: "success",
        title: "Your file has been saved into " + PixlrSettings.relSaveDir,
        duration: 4000
      });
    });
  };

  PixlrAppView.prototype.doKiteRequest = function(command, callback) {
    var _this = this;
    return kiteController.run(command, function(err, res) {
      if (!err) {
        return typeof callback === "function" ? callback(res) : void 0;
      } else {
        if (typeof callback === "function") {
          callback(res);
        }
        return new KDNotificationView({
          title: "An error occured while processing your request, try again please!",
          type: "mini",
          duration: 3000
        });
      }
    });
  };

  PixlrAppView.prototype.pistachio = function() {
    return "{{> this.container}}";
  };

  return PixlrAppView;

})(JView);
/* BLOCK STARTS: /home/fatihacet/Applications/PixlrExpress.kdapp/index.coffee */
(function() {
  return appView.addSubView(new PixlrAppView);
})();

/* KDAPP ENDS */
}).call();