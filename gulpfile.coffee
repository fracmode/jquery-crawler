gulp = require 'gulp'
source = require 'vinyl-source-stream'
browserify = require 'browserify'

sass = require 'gulp-sass'

gulp.task 'sass', ->
	gulp.src('sass/**/*sass')
		.pipe( sass() )
		.pipe( gulp.dest( './css' ) )

gulp.task 'build', ->
	browserify
			entries: ['./src/main.coffee']
			extensions: ['.coffee', '.js']
		.transform 'coffeeify'
		.bundle()
		.pipe source 'main.js'
		.pipe gulp.dest 'build'

gulp.task 'default', ['build']
