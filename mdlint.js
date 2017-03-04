const glob = require('glob')
const markdownlint = require('markdownlint')

const config = {
  'default': true,
  'line_length': false,
  'no-emphasis-as-header': false,
}

const files = glob.sync('**/*.md', { ignore: '**/node_modules/**' })

markdownlint({ files, config }, (err, result) => {
  if (!err) {
    const resultString = result.toString()
    console.log('== Linting Markdown Files...')
    if (resultString) {
      console.log(resultString)
      process.exit(1)
    } else {
      console.log('== OK!')
    }
  }
})
