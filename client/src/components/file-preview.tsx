import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

export function FilePreview({ file, onRemove }: FilePreviewProps) {
  const isImage = file.type.startsWith('image/');
  const isPdf = file.type === 'application/pdf';
  
  // Convert file size to readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Create a preview URL for the file
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Only create URL for images
    if (isImage) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Clean up the URL when component unmounts
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file, isImage]);

  return (
    <div className="relative border dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-700">
      <div className="flex items-start gap-3">
        {isImage && previewUrl ? (
          <div className="w-12 h-12 overflow-hidden rounded">
            <img 
              src={previewUrl} 
              alt={file.name} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-600 rounded">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-300">
              {isPdf ? 'PDF' : file.type.split('/')[1]?.toUpperCase() || 'FILE'}
            </span>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate" title={file.name}>
            {file.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatFileSize(file.size)}
          </p>
        </div>
        
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-8 w-8 p-0 rounded-full" 
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Remove</span>
        </Button>
      </div>
    </div>
  );
}