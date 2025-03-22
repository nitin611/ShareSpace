import axios from 'axios';
import fs from 'fs';
import { ENV } from './loadEnv.js';

const GEMINI_API_KEY = ENV.GEMINI_API_KEY;
// Use Gemini 1.5 Flash for both text and image validation for consistency
const TEXT_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
const VISION_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';

// Enhanced simple validation for when API key is missing or as a first-pass filter
const simpleValidation = (name, description) => {
  // Expanded list of prohibited terms in English
  const prohibitedTermsEnglish = [
    'illegal', 'drugs', 'weapon', 'gun', 'knife', 'explosive', 'porn', 'pornography',
    'adult content', 'gambling', 'counterfeit', 'fake', 'stolen', 'pirated',
    'sex', 'sexual', 'nude', 'naked', 'xxx', 'adult', 'obscene', 'explicit',
    'pussy', 'dick', 'cock', 'penis', 'vagina', 'ass', 'boobs', 'tits',
    'weed', 'cocaine', 'heroin', 'meth', 'marijuana', 'cannabis',
    'rifle', 'pistol', 'ammunition', 'bomb', 'terrorist', 'hack', 'cracked'
  ];
  
  // Hindi prohibited terms
  const prohibitedTermsHindi = [
    'चूत', 'लंड', 'गांड', 'लौड़ा', 'भोसड़ी', 'भोसड़ा', 'मादरचोद', 'बहनचोद',
    'रंडी', 'चुदाई', 'चोदना', 'सेक्स', 'नंगा', 'नंगी', 'कामुक', 'अश्लील',
    'गोली', 'बंदूक', 'चाकू', 'हथियार', 'ड्रग्स', 'नशा', 'गांजा', 'चरस'
  ];
  
  const allProhibitedTerms = [...prohibitedTermsEnglish, ...prohibitedTermsHindi];
  
  const lowercaseName = name.toLowerCase();
  const lowercaseDesc = description.toLowerCase();
  
  // Strict regex pattern for explicit content in English
  const explicitPattern = /\b(sex|porn|xxx|nude|naked|pussy|dick|cock|penis|vagina|ass|boobs|tits)\b/i;
  
  if (explicitPattern.test(lowercaseName) || explicitPattern.test(lowercaseDesc)) {
    return {
      isValid: false,
      textReason: `Contains explicit prohibited terms`,
      imageReason: "Image not validated (explicit text detected)",
      concerns: ["Contains sexually explicit or adult content"]
    };
  }
  
  // Check for any prohibited terms in any language
  const foundTerms = allProhibitedTerms.filter(term => 
    lowercaseName.includes(term.toLowerCase()) || lowercaseDesc.includes(term.toLowerCase())
  );
  
  if (foundTerms.length > 0) {
    return {
      isValid: false,
      textReason: `Contains prohibited terms: ${foundTerms.join(', ')}`,
      imageReason: "Image not validated (prohibited text detected)",
      concerns: foundTerms.map(term => `Contains prohibited term: ${term}`)
    };
  }
  
  // If the name or description is too short, we'll still let Gemini check it
  return {
    isValid: true,
    textReason: "Basic text validation passed",
    imageReason: "Image not validated yet",
    concerns: []
  };
};

// Validate product text (name and description)
export const validateProductText = async (name, description) => {
  // Always perform simple validation first
  const quickCheck = simpleValidation(name, description);
  if (!quickCheck.isValid) {
    console.log(`Quick validation failed for "${name}": ${quickCheck.textReason}`);
    return quickCheck;
  }
  
  if (!GEMINI_API_KEY) {
    console.log('Using simple validation for text (API key missing)');
    return quickCheck;
  }
  
  try {
    console.log('Validating product text with Gemini...');
    const prompt = `
    You are a content moderator for a marketplace called ShareSpace.
    
    Please analyze the following product listing and determine if it contains any inappropriate content.
    
    Product Name: ${name}
    Product Description: ${description}
    
    Our guidelines strictly prohibit:
    1. Illegal items (drugs, weapons, counterfeit goods, etc.)
    2. Adult content or pornography
    3. Hate speech or discriminatory content
    4. Dangerous or harmful items
    5. Vulgar or profane language in any language (including Hindi, English, etc.)
    6. Any sexually suggestive content
    
    IMPORTANT INSTRUCTIONS:
    - Do NOT reject a product just because the description is short or lacks details
    - Do NOT reject a product just because it doesn't have specifications
    - ONLY reject products that contain inappropriate content as listed above
    - Brief descriptions like "Used laptop" or "Old mattress" are perfectly acceptable
    - Focus ONLY on detecting prohibited content, not on the quality of the listing
    
    Respond with a JSON object with the following structure:
    {
      "isAppropriate": boolean,
      "reason": "detailed explanation if inappropriate, otherwise just say 'No prohibited content detected'",
      "concerns": ["list", "of", "specific", "concerns", "only if inappropriate"]
    }
    `;
    
    const response = await axios.post(
      `${TEXT_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1 }
      }
    );
    
    const textContent = response.data.candidates[0].content.parts[0].text;
    const jsonStart = textContent.indexOf('{');
    const jsonEnd = textContent.lastIndexOf('}') + 1;
    const jsonString = textContent.substring(jsonStart, jsonEnd);
    
    try {
      const result = JSON.parse(jsonString);
      
      return {
        isValid: result.isAppropriate,
        textReason: result.reason || "Text validation passed",
        concerns: result.concerns || []
      };
    } catch (jsonError) {
      console.error('Error parsing Gemini API response:', jsonError);
      console.log('Raw API response:', textContent);
      // Be conservative - if we can't parse the response, use the simple validation
      return quickCheck;
    }
  } catch (error) {
    console.error('Error validating product text:', error.message);
    // Be conservative - if the API call fails, use the simple validation
    return quickCheck;
  }
};

// Validate product image
export const validateProductImage = async (imagePath) => {
  if (!GEMINI_API_KEY) {
    console.log('Skipping image validation (API key missing)');
    return {
      isValid: true,
      imageReason: "Image not validated (API key missing)",
      concerns: []
    };
  }
  
  try {
    console.log('Validating product image with Gemini...');
    // Read image as base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    const prompt = `
    You are a content moderator for a marketplace called ShareSpace.
    
    Please analyze this product image and determine if it contains any inappropriate content.
    
    Our guidelines strictly prohibit:
    1. Adult content or pornography
    2. Violent or graphic content
    3. Illegal items (drugs, weapons, etc.)
    4. Hate symbols or offensive imagery
    
    IMPORTANT INSTRUCTIONS:
    - ONLY reject the image if it contains inappropriate content as listed above
    - Regular product photos like electronics, furniture, books, clothing, etc. are all acceptable
    - The quality of the photo doesn't matter, only the content
    - Focus ONLY on detecting prohibited content
    
    Respond with a JSON object with the following structure:
    {
      "isAppropriate": boolean,
      "reason": "detailed explanation if inappropriate, otherwise just say 'No prohibited content detected'",
      "concerns": ["list", "of", "specific", "concerns", "only if inappropriate"]
    }
    `;
    
    // Use Gemini for image analysis
    const response = await axios.post(
      `${VISION_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }],
        generationConfig: { temperature: 0.1 }
      }
    );
    
    const textContent = response.data.candidates[0].content.parts[0].text;
    const jsonStart = textContent.indexOf('{');
    const jsonEnd = textContent.lastIndexOf('}') + 1;
    const jsonString = textContent.substring(jsonStart, jsonEnd);
    
    try {
      const result = JSON.parse(jsonString);
      
      return {
        isValid: result.isAppropriate,
        imageReason: result.reason || "Image validation passed",
        concerns: result.concerns || []
      };
    } catch (jsonError) {
      console.error('Error parsing Gemini API image response:', jsonError);
      console.log('Raw API image response:', textContent);
      // If we can't parse the response, assume the image is valid
      return {
        isValid: true,
        imageReason: "Image validation passed (parsing error fallback)",
        concerns: []
      };
    }
  } catch (error) {
    console.error('Error validating product image:', error.message);
    // If the API call fails, assume the image is valid
    return {
      isValid: true,
      imageReason: "Image validation passed (API error fallback)",
      concerns: []
    };
  }
};

// Combined validation for product (text + image)
export const validateProduct = async (name, description, imagePath) => {
  console.log(`Starting validation for product: ${name}`);
  
  // First do a quick check with simple validation
  const quickCheck = simpleValidation(name, description);
  if (!quickCheck.isValid) {
    console.log(`Quick validation failed for "${name}": ${quickCheck.textReason}`);
    return quickCheck;
  }
  
  try {
    // Run text and image validation in parallel for efficiency
    const [textResult, imageResult] = await Promise.all([
      validateProductText(name, description),
      validateProductImage(imagePath)
    ]);
    
    console.log('Text validation result:', textResult);
    console.log('Image validation result:', imageResult);
    
    // Combine results
    return {
      isValid: textResult.isValid && imageResult.isValid,
      textReason: textResult.textReason,
      imageReason: imageResult.imageReason,
      concerns: [...(textResult.concerns || []), ...(imageResult.concerns || [])]
    };
  } catch (error) {
    console.error('Error in product validation:', error);
    // If there's an error in the validation process, use the simple validation result
    return quickCheck;
  }
};
