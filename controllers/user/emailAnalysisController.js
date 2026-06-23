import sharp from "sharp"
import { logger } from "../../utils/logger.js";
import Tesseract from "tesseract.js";
import { emailAnalysis, emailContextExtracter } from "../../services/user/emailAnalysisService.js";


export const analyzeEmailScreenshot = async (req,res)=>{

    try{

        const processedImage = await sharp(req.file.buffer)
            .grayscale()
            .sharpen()
            .toBuffer()
        const { data } = await Tesseract.recognize(processedImage,'eng')
        
        const emailTextExtracter = await emailContextExtracter(data.text)
        const emailAnalysing = await emailAnalysis(emailTextExtracter.response.choices[0].message.content)
        console.log(emailAnalysing.response.choices[0].message.content)

        return res.json({
            success:true
        })

    }catch(err){

        logger.error("IMAGE_UPLOAD_ERROR", {
            message: err.message,
            stack: process.env.NODE_ENV === "development"? err.stack : undefined,
            route: req.originalUrl,
            method: req.method,
            time: new Date().toISOString()
        });
    }
    
}

