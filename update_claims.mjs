// Create a Node.js script to update the file with regexp
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'client/src/pages/claims.tsx');
console.log(`Trying to update file at: ${filePath}`);

try {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Create a pattern that might match the document sections
  const pattern = /<div className="space-y-1">[\s\S]*?claim\.documents as { name: string }\[\][\s\S]*?<\/div>[\s\S]*?<\/div>/g;
  
  // Replace with our DocumentViewer component
  const updatedContent = fileContent.replace(pattern, (match) => {
    console.log('Found a match!');
    return '<DocumentViewer documents={claim.documents as any[]} />';
  });
  
  // Check if any replacements were made
  if (fileContent !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log('Successfully updated claims.tsx');
  } else {
    console.log('No changes were made to claims.tsx');
  }
} catch (error) {
  console.error('Error updating file:', error);
}
