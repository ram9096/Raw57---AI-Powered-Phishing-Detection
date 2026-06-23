import { groq } from "../../config/groq.js";

export const emailContextExtracter = async (unCleanedEmail)=>{
    try{

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages:[
                {
                    role:"system",
                    content: `
                        You are an OCR cleanup assistant.

                        Convert OCR-extracted email text into a structured format.

                        Return JSON:
                        {
                            "from": "",
                            "subject": "",
                            "body": ""
                        }

                        Fix obvious OCR mistakes but do not invent missing information.
                        Return only JSON. `
                },
                {
                    role:"user",
                    content:unCleanedEmail
                }
            ],
            response_format: { type: "json_object" }
        })

        return {
            success:true,
            response
        }

    }catch(err){
        console.log(err)
    }
}

export const emailAnalysis = async (emailContext) => {

    try{

        const response = await groq.chat.completions.create({

            model: "llama-3.3-70b-versatile",
            temperature: 0,
            response_format: { type: "json_object" },

            messages: [
            {
                role: "system",
                content: `

                    You are a senior cybersecurity analyst specializing in phishing detection.

                    Analyze the provided email and return ONLY valid JSON with this schema:

                    {
                    "isPhishing": boolean,
                    "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
                    "confidence": number,
                    "summary": string,
                    "indicators": [
                        {
                        "type": string,
                        "severity": "LOW" | "MEDIUM" | "HIGH",
                        "description": string
                        }
                    ],
                    "recommendedActions": [string]
                    }

                    Evaluation criteria:
                    - Sender impersonation
                    - Domain spoofing
                    - Suspicious links
                    - Urgency or pressure tactics
                    - Credential harvesting attempts
                    - Malware indicators
                    - Financial fraud indicators
                    - Grammar and formatting anomalies
                    - Social engineering techniques

                    Return only JSON.
                `
            },

            {

                role:"user",
                content:emailContext
            }

            ],
        });

        return{
            success:true,
            response
        }
        
    }catch(err){
        console.log(err)
    }

};
