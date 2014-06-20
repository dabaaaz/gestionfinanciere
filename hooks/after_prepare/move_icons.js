#!/usr/bin/env node


//
// This hook copies various resource files from our version control system directories into the appropriate platform specific location
//


// configure all the files to copy.  Key of object is the source file, value is the destination location.  It's fine to put all platforms' icons and splash screen files here, even if we don't build for all platforms on each developer's box.
var filestocopy = [

/*

Android icons :

LDPI- icon-32x32

MDPI- icon-48x48

HDPI- icon 72x72

XHDPI- icon-96x96

*/

{
    "config/android/res/drawable-hdpi/icon.png": "platforms/android/res/drawable-hdpi/icon.png"
}, {
    "config/android/res/drawable-ldpi/icon.png": "platforms/android/res/drawable-ldpi/icon.png"
}, {
    "config/android/res/drawable-mdpi/icon.png": "platforms/android/res/drawable-mdpi/icon.png"
}, {
    "config/android/res/drawable-xhdpi/icon.png": "platforms/android/res/drawable-xhdpi/icon.png"
},

/*

Android splashes :

ldpi : 320*426
mdpi : 320*470
hdpi : 480*640
xhdpi : 720*960

 */

/* {
    "config/android/res/drawable/splash.png": "platforms/android/res/drawable/splash.png"
},*/ {
    "config/android/res/drawable-hdpi/splash.png": "platforms/android/res/drawable-hdpi/splash.png"
}, {
    "config/android/res/drawable-ldpi/splash.png": "platforms/android/res/drawable-ldpi/splash.png"
}, {
    "config/android/res/drawable-mdpi/splash.png": "platforms/android/res/drawable-mdpi/splash.png"
}, {
    "config/android/res/drawable-xhdpi/splash.png": "platforms/android/res/drawable-xhdpi/splash.png"
},

/*

iOS icons :

REDO : 57 + 57@2x + 50 + 50@2x

*/

{
    "config/ios/Resources/icons/icon-small@2x.png": "platforms/ios/HelloCordova/Resources/icons/icon-small@2x.png"
}, {
    "config/ios/Resources/icons/icon-small.png": "platforms/ios/HelloCordova/Resources/icons/icon-small.png"
}, {
    "config/ios/Resources/icons/icon-40@2x.png": "platforms/ios/HelloCordova/Resources/icons/icon-40@2x.png"
}, {
    "config/ios/Resources/icons/icon-40.png": "platforms/ios/HelloCordova/Resources/icons/icon-40.png"
}, {
    "config/ios/Resources/icons/icon-50@2x.png": "platforms/ios/HelloCordova/Resources/icons/icon-50@2x.png"
}, {
    "config/ios/Resources/icons/icon-50.png": "platforms/ios/HelloCordova/Resources/icons/icon-50.png"
}, {
    "config/ios/Resources/icons/icon@2x.png": "platforms/ios/HelloCordova/Resources/icons/icon@2x.png"
}, {
    "config/ios/Resources/icons/icon.png": "platforms/ios/HelloCordova/Resources/icons/icon.png"
}, {
    "config/ios/Resources/icons/icon-60@2x.png": "platforms/ios/HelloCordova/Resources/icons/icon-60@2x.png"
}, {
    "config/ios/Resources/icons/icon-60.png": "platforms/ios/HelloCordova/Resources/icons/icon-60.png"
}, {
    "config/ios/Resources/icons/icon-72@2x.png": "platforms/ios/HelloCordova/Resources/icons/icon-72@2x.png"
}, {
    "config/ios/Resources/icons/icon-72.png": "platforms/ios/HelloCordova/Resources/icons/icon-72.png"
}, {
    "config/ios/Resources/icons/icon-76@2x.png": "platforms/ios/HelloCordova/Resources/icons/icon-76@2x.png"
}, {
    "config/ios/Resources/icons/icon-76.png": "platforms/ios/HelloCordova/Resources/icons/icon-76.png"
}, 

/*

iOS splashes :

OK : Default-568h@2x~iphone (640*1136) + 640*960 + 320*480
KO : iPad ones

*/

{
    "config/ios/Resources/splash/Default-568h@2x~iphone.png": "platforms/ios/HelloCordova/Resources/splash/Default-568h@2x~iphone.png"
}, { 
    "config/ios/Resources/splash/Default~iphone.png": "platforms/ios/HelloCordova/Resources/splash/Default~iphone.png"
}, {
    "config/ios/Resources/splash/Default@2x~iphone.png": "platforms/ios/HelloCordova/Resources/splash/Default@2x~iphone.png"
}/*, {
    "config/ios/Resources/splash/Default-568h@2x~iphone.png": "platforms/ios/HelloCordova/Resources/splash/Default-568h@2x~iphone.png"
}, {
    "config/ios/Resources/splash/Default~iphone.png": "platforms/ios/HelloCordova/Resources/splash/Default~iphone.png"
}, {
    "config/ios/Resources/splash/Default-Portrait~ipad.png": "platforms/ios/HelloCordova/Resources/splash/Default-Portrait~ipad.png"
}, {
    "config/ios/Resources/splash/Default-Portrait@2x~ipad.png": "platforms/ios/HelloCordova/Resources/splash/Default-Portrait@2x~ipad.png"
},*/ ];

var fs = require('fs');
var path = require('path');

// no need to configure below
var rootdir = process.argv[2];

filestocopy.forEach(function(obj) {
    Object.keys(obj).forEach(function(key) {
        console.log("hook copy");
        var val = obj[key];
        var srcfile = path.join(rootdir, key);
        var destfile = path.join(rootdir, val);
        //console.log("copying "+srcfile+" to "+destfile);
        var destdir = path.dirname(destfile);
        if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
            fs.createReadStream(srcfile).pipe(fs.createWriteStream(destfile));
        }
    });
});