const express = require('express')
const multer = require('multer')
const { v2: cloudinary } = require('cloudinary')
const { Readable } = require('stream')
const { execFile } = require('child_process')
const fs = require('fs')
const path = require('path')
const os = require('os')

const router = express.Router()

const uploadImages = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Apenas imagens são permitidas'))
    }
    cb(null, true)
  },
})

const uploadPdf = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Apenas PDFs são permitidos'))
    }
    cb(null, true)
  },
})

function verifyApiKey(req, res, next) {
  if (req.headers['x-api-key'] !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Não autorizado' })
  }
  next()
}

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'yuri-imoveis', resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error)
        resolve(result.secure_url)
      }
    )
    Readable.from(buffer).pipe(stream)
  })
}

function extractPdfPages(pdfPath, outputDir) {
  return new Promise((resolve, reject) => {
    const outputPrefix = path.join(outputDir, 'page')
    execFile(
      'pdftoppm',
      ['-png', '-r', '150', pdfPath, outputPrefix],
      (err) => {
        if (err) return reject(err)
        const files = fs.readdirSync(outputDir)
          .filter(f => f.endsWith('.png'))
          .sort()
          .map(f => path.join(outputDir, f))
        resolve(files)
      }
    )
  })
}

// POST /api/upload — recebe até 10 imagens e envia para o Cloudinary
router.post('/', verifyApiKey, uploadImages.array('images', 10), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'Nenhuma imagem enviada' })
  }
  try {
    const urls = await Promise.all(req.files.map(f => uploadToCloudinary(f.buffer)))
    res.json({ urls })
  } catch (err) {
    console.error('Cloudinary upload error:', err)
    res.status(500).json({ error: 'Erro ao fazer upload das imagens' })
  }
})

// POST /api/upload/pdf — recebe um PDF, extrai páginas como PNG e sobe para o Cloudinary
router.post('/pdf', verifyApiKey, uploadPdf.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum PDF enviado' })
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdf-'))
  const pdfPath = path.join(tmpDir, 'input.pdf')

  try {
    fs.writeFileSync(pdfPath, req.file.buffer)

    const pagePaths = await extractPdfPages(pdfPath, tmpDir)

    if (pagePaths.length === 0) {
      return res.status(422).json({ error: 'Nenhuma página encontrada no PDF' })
    }

    const urls = await Promise.all(
      pagePaths.map(p => uploadToCloudinary(fs.readFileSync(p)))
    )

    res.json({ urls, total: urls.length })
  } catch (err) {
    console.error('PDF extraction error:', err)
    res.status(500).json({ error: 'Erro ao processar o PDF' })
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }
})

module.exports = router
