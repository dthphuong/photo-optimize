const fs = require('fs');

exports.getFileSize = (filename, sizeUnit) => {
    if (!fs.existsSync(filename)) {
        console.log('❗️ This file does not exist');
        return -1;
    }

    switch (sizeUnit) {
        case "KB":
        default:
            return fs.statSync(filename)["size"] / 1000; // KB
            break;
        case "MB":
            return fs.statSync(filename)["size"] / 1000000; // MB
            break;
    }
}

exports.log = (directoryPath, outputPath, file) => {
    console.log('-------------------');
    console.log(`🟠 Old size: ${file} (${this.getFileSize(`${directoryPath}/${file}`, "MB")} MB)`);
    console.log(`🟢 New size: PM_${file.replace("DUA_", "").toLowerCase()}  (${this.getFileSize(`${outputPath}/PM_${file.replace("DUA_", "").toLowerCase()}`)} KB)`);
}