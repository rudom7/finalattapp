// Create a Node.js script to update the file with regexp
const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'client/src/pages/claims.tsx');
const fileContent = fs.readFileSync(filePath, 'utf8');

// Replace each occurrence of the documents rendering section
const updatedContent = fileContent.replace(
  /<div className="space-y-1">\s*{\(\s*claim\.documents as { name: string }\[\]\s*\)\.map\(\(doc, index\) => \(\s*<div\s*key={index}\s*className="text-sm text-gray-600 flex items-center"\s*>\s*<Upload className="w-4 h-4 mr-2" \/>\s*{doc\.name}\s*<\/div>\s*\)\)}<\/div>/g,
  '<DocumentViewer documents={claim.documents as any[]} />'
);

// Check if any replacements were made
if (fileContent !== updatedContent) {
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log('Successfully updated claims.tsx');
} else {
  console.log('No changes were made to claims.tsx');
}
