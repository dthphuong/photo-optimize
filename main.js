const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const async = require('async');

const directoryPath = path.join(__dirname, 'images');
const outputPath = path.join(__dirname, 'output');
const stdWidth = 1280, stdHeight = 853;


// Get list of files in `images` folder
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }

    files = _.reject(files, (file) => { return file == ".DS_Store" })

    async.each(files, (file, callback) => {
        sharp(`${directoryPath}/${file}`)
            .resize(stdWidth, stdHeight)
            .toFile(`${outputPath}/${file}`, (err, info) => {
                if (err) {
                    callback(err)
                } else {
                    console.log(`--> Optimized ${file}`);
                    callback()
                }
            });
    }, (error) => {
        // if any of the file processing produced an error, err would equal that error
        if (err) {
            // One of the iterations produced an error.
            // All processing will now stop.
            console.log('A file failed to optimize');
        } else {
            console.log('All files have been optimized successfully');
        }
    })
});

