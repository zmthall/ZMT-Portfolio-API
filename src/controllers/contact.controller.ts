// /controllers/contact.controller.ts
import type { Request, Response } from 'express'
import * as ContactService from '../services/contact.service.js'

export const submitContactForm = async (req: Request, res: Response) => {
  try {
    const form = req.body
    const files = req.files as Express.Multer.File[] | undefined

    const result = await ContactService.submitContactForm({
      ...form,
      files: files ?? []
    })

    if (!result.success) {
      return res.status(400).json(result)
    }

    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: (error as Error).message
    })
  }
}