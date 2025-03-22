import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ES module fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the root directory (one level up from utils)
const rootDir = path.join(__dirname, '..');
const envPath = path.join(rootDir, '.env');

// Check if .env file exists
if (fs.existsSync(envPath)) {
    console.log(`Found .env file at: ${envPath}`);
    
    // Read the .env file content for debugging
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envLines = envContent.split('\n');
    
    // Log the number of lines and check for GEMINI_API_KEY
    console.log(`Env file has ${envLines.length} lines`);
    
    // Print each line (with sensitive data masked)
    console.log('Env file contents:');
    envLines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
            const parts = trimmedLine.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                // Mask sensitive values
                const value = key.includes('KEY') || key.includes('SECRET') || key.includes('PASS') 
                    ? '[MASKED]' 
                    : parts.slice(1).join('=');
                console.log(`Line ${index + 1}: ${key}=${value}`);
            } else {
                console.log(`Line ${index + 1}: ${trimmedLine} (possibly malformed)`);
            }
        } else if (trimmedLine.startsWith('#')) {
            console.log(`Line ${index + 1}: # (comment)`);
        } else {
            console.log(`Line ${index + 1}: (empty line)`);
        }
    });
    
    // Load the environment variables
    const result = dotenv.config({ path: envPath });
    
    if (result.error) {
        console.error('Error loading .env file:', result.error);
    } else {
        console.log('Environment variables loaded successfully');
    }
} else {
    console.error(`Error: .env file not found at ${envPath}`);
}

// Export the loaded environment variables
export const ENV = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    EMAIL_PASS: process.env.EMAIL_PASS,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    SKIP_VALIDATION: process.env.SKIP_VALIDATION
};

// Log the loaded environment variables
console.log('Loaded Environment Variables:', {
    PORT: ENV.PORT ? 'Present' : 'Missing',
    MONGO_URL: ENV.MONGO_URL ? 'Present' : 'Missing',
    JWT_SECRET: ENV.JWT_SECRET ? 'Present' : 'Missing',
    EMAIL_PASS: ENV.EMAIL_PASS ? 'Present' : 'Missing',
    GEMINI_API_KEY: ENV.GEMINI_API_KEY ? 'Present' : 'Missing',
    SKIP_VALIDATION: ENV.SKIP_VALIDATION || 'false'
});
