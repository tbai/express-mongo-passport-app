exports.SERVER_PORT = process.env.PORT || 3000;

exports.MONGODB_CONNECTION_STR = "mongodb://localhost/codebrowser";

exports.GIT_REPO_PATH = "/opt/git/jedifw";

// Folder paths to be scanned.
exports.SOURCE_FOLDERS = [
    "/opt/git/jedifw/Source/HP/Mfp"
    , "/opt/git/jedifw/Source/HP/Test"
    , "/opt/git/jedifw/Source/HP/Common"
    //, "/opt/git/jedifw/Source/HP/Extensibility"
    //, "/opt/git/jedifw/Source/HP/Platform"
    //, "/opt/git/jedifw/Source/HP/Product"
    //, "/opt/git/jedifw/Source/HP/Tools"
    //, "/opt/git/jedifw/Source/HP/VersionTestData" 
];

// Base path to be used in db file records. 
exports.BASE_PATH = "/opt/git/jedifw/Source/HP/";

exports.SCAN_FILES = {".json":1,".js":1,".css":1,".cs":1,".xml":1,".xsd":1,".c":1,".h":1,".cpp":1,".config":1};

exports.emailDefaultFrom = "tbai@hp.com";
exports.appTitle = "Jedi Code View";
