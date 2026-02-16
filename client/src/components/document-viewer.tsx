import React from 'react';
import { FileText, Upload, File, Image } from 'lucide-react';

interface DocumentDisplayProps {
  documents: Array<{
    path: string;
    originalName: string;
    mimeType: string;
    size: number;
  }>;
}

export function DocumentViewer({ documents }: DocumentDisplayProps) {
  if (!documents || documents.length === 0) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">No documents attached</p>;
  }
  
  // Automatically use the component when imported without replacing existing code
  console.log("DocumentViewer rendering", documents.length, "documents");

  const getDocumentIcon = (mimeType: string) => {
    if (!mimeType) return <FileText className="w-4 h-4 mr-2" />;
    
    if (mimeType.startsWith('image/')) {
      return <Image className="w-4 h-4 mr-2" />;
    } else if (mimeType === 'application/pdf') {
      return <File className="w-4 h-4 mr-2" />;
    } else {
      return <FileText className="w-4 h-4 mr-2" />;
    }
  };

  return (
    <div className="space-y-1">
      {documents.map((doc, index) => {
        // Handle legacy documents format
        if ('name' in doc && !('path' in doc)) {
          const legacyDoc = doc as any; // Type assertion for legacy format
          return (
            <div key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              <span>{legacyDoc.name}</span>
            </div>
          );
        }
        
        // Handle new document format with paths
        return (
          <div key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
            {getDocumentIcon(doc.mimeType)}
            {doc.path ? (
              <a 
                href={doc.path} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline text-blue-600 dark:text-blue-400"
              >
                {doc.originalName || doc.path.split('/').pop() || 'Document'}
              </a>
            ) : (
              <span>{doc.originalName || 'Document'}</span>
            )}
            {doc.size && (
              <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">
                ({Math.round(doc.size / 1024)}KB)
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}