const fs = require('fs')

module.exports = {
  delete_file
}

function delete_file(pathname) {
  fs.unlink(pathname, function (err) {
    if (err) {
      throw err
    } else {
      console.log('Successfully deleted the file.', pathname)
    }
  })
}
