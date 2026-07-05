// /routes/contact.routes.ts
import { Router } from 'express'
import multer from 'multer'
import { submitContactForm } from '../controllers/contact.controller.js'
// import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken.js'

const router = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 5,
    fileSize: 10 * 1024 * 1024 // 10MB each
  }
})

router.post(
  '/submit',
  upload.array('attachments'),
  submitContactForm
)

router.get('/route/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Contact routes are working.'
  })
})

export default router