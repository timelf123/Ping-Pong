var
    path = require('path'),
    fs = require('fs'),
    exec = require('child_process').exec,
    request = require('request'),
    es = require('event-stream'),
    async = require('async'),
    slug = require('slug'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    source = require('vinyl-source-stream'),
    buffer = require('gulp-buffer'),
    rename = require('gulp-rename'),
    del = require('del'),
    rev = require('gulp-rev'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    reactify = require('reactify'),
    uglifyify = require('uglifyify'),
    exorcist = require('exorcist'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso'),
    // Speak = require('tts-speak'),
    google_speech = require('google-speech'),
    paths = {};



paths.public = './ui/public';
paths.css = paths.public + '/css';
paths.js = paths.public + '/js';
paths.build = paths.public + '/build';
paths.versions = './versions';



gulp.task('default', ['all'], function() {
    var watcher = gulp.watch(paths.css + '/**/*.less', ['css']);
});



gulp.task('main.js', function() {

    var bundle, watch;

    bundle = browserify({ cache: {}, packageCache: {}, fullPaths: true, debug: true });
    watch = watchify(bundle);

    bundle.transform({ global: true }, 'uglifyify');

    // Add  third party libs. We don't want Browserify to parse them because they
    // aren't setup to use Browserify - we'd just be wasting time.
    bundle.add(paths.js + '/third_party/font.js', { noparse: true });

    // Add the main.js file
    bundle.add(paths.js + '/main.js');

    bundle.transform('reactify');

    watch.on('update', rebundle);

    function rebundle() {
        cleanJS(function() {
            return watch.bundle()
                .on('error', function(e) {
                    gutil.beep();
                    gutil.log(gutil.colors.red('Browserify Error'), e);
                })
                // Exorcist extracts Browserify's inline source map and moves it to an external file
                .pipe(exorcist(paths.build + '/main.js.map'))
                .pipe(source('main.js'))
                .pipe(buffer())
                .pipe(rev())
                .pipe(gulp.dest(paths.build))
                .pipe(rev.manifest())
                .pipe(rename('js.json'))
                .pipe(gulp.dest(paths.versions));
        });
    }

    return rebundle();

});



function cleanJS(cb) {
    return del([path.join(paths.build, '*.js'), path.join(paths.build, '*.js.map')], cb);
}



gulp.task('css', ['css:clean'], function() {

    var autoprefixerConfig = {
        cascade: false
    };

    return gulp.src(paths.css + '/base.less')
        .pipe(less())
        .pipe(autoprefixer(['last 2 versions', '> 1%'], autoprefixerConfig))
        .pipe(csso())
        .pipe(rev())
        .pipe(gulp.dest(paths.build))
        .pipe(rev.manifest())
        .pipe(rename('css.json'))
        .pipe(gulp.dest(paths.versions));

});



gulp.task('css:clean', function(cb) {
    return del([path.join(paths.build, '*.css')], cb);
});

// gulp.task('say', function(cb) {
//  var speak = new Speak({
//         tts: {
//             engine: {                       // The engine to use for tts
//                 name: 'voicerss',
//                 key: 'ebe126680a19408badc455097eb8b3b5',     // The API key to use
//             },
//             lang: 'en-us',                  // The voice to use
//             speed: 60,                      // Speed in %
//             format: 'mp3',                  // Output audio format
//             quality: '44khz_16bit_stereo',  // Output quality
//             cache: __dirname + '/ui/public/sounds',    // The cache directory were audio files will be stored
//             loglevel: 0,                    // TTS log level (0: trace -> 5: fatal)
//             delayAfter: 500                 // Mark a delay (ms) after each message
//         },
//         speak: {
//             volume: 80,                     // Audio player volume
//             loglevel: 0                     // Audio player log level
//         },
//         loglevel: 0                         // Wrapper log level
//     });

//     speak.once('ready', function() {

//         // Chaining
//         speak
//             .say("Hello and welcome here !")
//             .wait(1000)
//             .say({
//                 src: 'Parlez-vous français ?',
//                 lang: 'fr-fr',
//                 speed: 30
//             });

//         // Catch when all queue is complete
//         speak.once('idle', function() {
//             speak.say("Of course, with my new text to speech wrapper !");
//         });

//         // Will stop and clean all the queue
//         setTimeout(function() {
//             speak.stop();
//             speak.say('Ok, abort the last queue !')
//             return;
//         }, 1000);

//     });
// });


gulp.task('sounds', function(cb) {

    var
        Player = require('./models/Player'),
        scoreRange = [0, 40],
        announcements = [],
        downloads = [];

    announcements = [
        function(player) {
            return player + ' to serve';
        },
        function(player) {
            return 'Game point, ' + player;
        },
        function(player) {
            return player + ' won the game!';
        }
    ];

    async.parallel([

        function(cb) {
            Player.fetchAll().then(function(players) {
                console.log(players);
                async.each(players.models, function(player, cb) {
                    console.log(player.attributes);
                    fetchAnnouncements(player.get('name'), function(res) {
                        if(res.writable) {
                            downloads.push(res);
                        }
                        cb();
                    });
                }, cb);
            });
        },

        function(cb) {

            var
                i = 0,
                incomplete = function() {
                    return i < scoreRange[1];
                };

            async.whilst(incomplete, function(cb) {
                i ++;
                getTTS(i, 'en-gb', function(res) {
                    if(res.writable) {
                        downloads.push(res);
                    }
                    cb();
                });
            }, cb);

        }

    ], function() {

        var updateSprite = exec.bind(undefined, 'audiosprite --format howler --path build/ --output ui/public/build/sprite --export mp3 ui/public/sounds/*.mp3 ui/public/sounds/*.wav', cb);

        if(downloads.length > 0) {
            return es.merge.apply(undefined, downloads).on('end', function() {
                updateSprite();
            });
        }

        updateSprite();

    });

    function fetchAnnouncements(player, cb) {
        async.each(announcements, function(announcement, cb) {
            announcement = announcement(player);
            getGoogleTTS(announcement, 'en-gb', cb);
        }, cb);
    }

});



function getTTS(phrase, language, cb) {

    language = language || 'en-gb';

    var
        requestURL = 'http://translate.google.com/translate_tts?q=' + phrase + '&tl=' + language,
        fileName = slug(phrase).toLowerCase() + '.mp3',
        filePath = path.join('./ui/public/sounds/', fileName),
        res = true;

    fs.exists(filePath, function(exists) {
        if(!exists) {
            res = request(requestURL);
            res.on('response', function() {
                res.pipe(fs.createWriteStream(filePath));
            });
        }
        cb(res);
    });

}

function getGoogleTTS(phrase, language, cb) {

    language = language || 'en-gb';
    var fileName = slug(phrase).toLowerCase() + '.mp3';
    var filePath = path.join('./ui/public/sounds/', fileName);
    res = true;

    fs.exists(filePath, function(exists) {
        if(!exists) {
            google_speech.TTS({
              text: phrase,
              language: language,
              file: filePath
              }, function(){
                console.log('sound written: ', fileName);
                cb(res);
              }
            );
        }
    });

}




gulp.task('all', ['css', 'main.js', 'sounds']);
