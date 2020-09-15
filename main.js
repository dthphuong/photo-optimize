const { argv } = require('yargs');
const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const async = require('async');
const sharp = require('sharp');
const utils = require('./utils');

// Initialize variables and Read argument variables
var directoryPath = _.isUndefined(argv.src) ? path.join(__dirname, 'images') : argv.src,
    outputPath = _.isUndefined(argv.out) ? path.join(__dirname, 'output') : argv.out,
    sigma = _.isUndefined(argv.sigma) ? 0 : parseFloat(argv.sigma),
    stdSize = _.isUndefined(argv.size) ? 1280 : parseInt(argv.size),
    stdQuality = _.isUndefined(argv.quality) ? 80 : parseInt(argv.quality);

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath)
}

// Get list of files in `images` folder
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }

    files = _.reject(files, (file) => { return file == ".DS_Store" })

    // Resize and Compress images
    async.each(files, (file, callback) => {
        console.log(`🛠 Optimizing file ${file} . . . `);

        let image = sharp(`${directoryPath}/${file}`);
        image
            .metadata()
            .then((metadata) => {
                if (metadata.width < metadata.height) {
                    image
                        .resize({ height: stdSize })
                        .sharpen()
                        // .blur(sigma)
                        .jpeg({
                            quality: stdQuality,
                            optimizeCoding: true
                        })
                        .withMetadata()
                        .toFile(`${outputPath}/PM_${file.replace("DUA_", "").toLowerCase()}`, (err, info) => {
                            if (err) {
                                callback(err)
                            } else {
                                utils.log(directoryPath, outputPath, file)
                                callback()
                            }
                        });
                } else {
                    image
                        .resize({ width: stdSize })
                        .sharpen()
                        // .blur(sigma)
                        .jpeg({
                            quality: stdQuality,
                            optimizeCoding: true
                        })
                        .withMetadata()
                        .toFile(`${outputPath}/PM_${file.replace("DUA_", "").toLowerCase()}`, (err, info) => {
                            if (err) {
                                callback(err)
                            } else {
                                utils.log(directoryPath, outputPath, file)
                                callback()
                            }
                        });
                }
            })

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

