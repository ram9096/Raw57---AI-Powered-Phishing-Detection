import { groq } from "../../config/groq";

export const emailAnalysis = async (emailConext) => {

    try{

        const response = groq.chat.completions.create({

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

        console.log(response)
        
    }catch(err){

    }

};
