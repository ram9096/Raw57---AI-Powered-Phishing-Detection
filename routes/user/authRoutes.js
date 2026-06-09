import express from "express"
import { getHomePage } from "../../controllers/user/authController.js"
import { analyzeEmailScreenshot } from "../../controllers/user/emailAnalysisController.js"
import { upload } from "../../config/multer.js"

let router = express.Router()

router.get("/home",getHomePage)
router.post("/analyze",upload.single("image"),analyzeEmailScreenshot)

export default router