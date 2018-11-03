import gulp from 'gulp'

import { copy } from './tasks/copy'
import { compileCSS, lintCSS, watchCSS } from './tasks/css'
import { compileES6, compileES5, lintJS, watchJS } from './tasks/js'
import { svg } from './tasks/svg'

export { copy, svg, compileCSS, lintCSS, watchCSS, compileES6, compileES5, lintJS, watchJS }

const lintTask = gulp.parallel(lintCSS, lintJS)
const watchTask = gulp.parallel(watchCSS, watchJS)
const jsTask = gulp.series(compileES6, compileES5)

const defaultTasks = gulp.parallel(copy, svg, compileCSS, jsTask)

const devTasks = gulp.series(lintTask, defaultTasks, watchTask)
const prodTasks = gulp.series(defaultTasks)
const tinkerTasks = gulp.series(defaultTasks, watchTask)

export { devTasks as dev, prodTasks as prod, tinkerTasks as tinker }

export default defaultTasks
