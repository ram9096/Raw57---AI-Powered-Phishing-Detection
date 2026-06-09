import sharp from "sharp"
import { logger } from "../../utils/logger.js";
import Tesseract from "tesseract.js";


export const analyzeEmailScreenshot = async (req,res)=>{

    try{

        const processedImage = await sharp(req.file.buffer)
            .grayscale()
            .sharpen()
            .toBuffer()
        const { data } = await Tesseract.recognize(processedImage,'eng')
        
        const formatText = formatContext(data.text)
        console.log(parseEmail(formatText))

        return res.json({
            success:true
        })

    }catch(error){

        logger.error("IMAGE_UPLOAD_ERROR", {
            message: error.message,
            stack: process.env.NODE_ENV === "development"? error.stack : undefined,
            route: req.originalUrl,
            method: req.method,
            time: new Date().toISOString()
        });
    }
    
}

const formatContext = (text)=>{
    const lines = text
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

    const removePatterns = [
        /Why is this message in spam/i,
        /Report as not spam/i,
        /^\+$/,
        /^Yr$/i,
        /^tome$/i
    ];

    return lines
        .filter(line =>
        !removePatterns.some(pattern => pattern.test(line))
        )
        .join("\n");
}
const parseEmail = (text)=>{
  const senderMatch = text.match(
    /^(.+?)\s+\[([^\]]+)\]/m
  );

  const sender = senderMatch
    ? senderMatch[1].trim()
    : null;

  const email = senderMatch
    ? senderMatch[2].replace("mailto:", "")
    : null;
  

  return {
    sender,
    email,
    body: text
  }
}