const multer = require('multer')
const upload = multer({ dest: 'upload/' })
const multiUpload = upload.fields([
  { name: 'image', maxCount: 4 },
])
module.exports = {
  upload,
  multiUpload,
}
