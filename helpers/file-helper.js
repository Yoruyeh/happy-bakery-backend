const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const imgurFileHandler = async (files) => {
  const images = []
  console.log(files)

  for (const file of files.image) {
    const { path, originalname } = file
    try {
      const img = await imgur.uploadFile(path)
      console.log(img)
      const image = { id: img.id, name: originalname, link: img.link }
      images.push(image)
    } catch (error) {
      console.error('Error uploading image:', error.message)
    }
  }

  return images.length > 0 ? images : null
}

module.exports = {
  imgurFileHandler
}
