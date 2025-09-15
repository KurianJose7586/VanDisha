import { useState } from 'react';
import UploadBox from '@/client/components/UploadBox';
import { Button } from '@/client/components/ui/button';
import { toast } from 'react-hot-toast';
import { uploadDocument } from '@/client/lib/api';
import { useStore } from '@/client/store';
import { Link } from 'react-router-dom';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadKey, setUploadKey] = useState(0); // <-- NEW: Key for resetting component
  const fetchClaims = useStore((state) => state.fetchClaims);

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload.');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Uploading and processing document...');

    try {
      const result = await uploadDocument(file);
      toast.success(`Successfully ingested claim #${result.claim_id}!`, { id: toastId });
      
      // Refresh the claims on the map after a successful upload
      fetchClaims();
      
      // Clear the file input and reset the UploadBox component
      setFile(null);
      setUploadKey(prevKey => prevKey + 1); // <-- NEW: Change key to force re-render

    } catch (error) {
      toast.error((error as Error).message || 'An unknown error occurred.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Ingest New Claim Document</h1>
          <p className="text-gray-500 mt-2">Upload a PDF of the FRA claim form to digitize it.</p>
        </div>
        
        {/* --- NEW: Pass the key to the component --- */}
        <UploadBox key={uploadKey} onFileSelect={setFile} />

        <div className="flex items-center justify-between pt-4">
          <Link to="/map">
            <Button variant="outline">Back to Map</Button>
          </Link>
          <Button onClick={handleUpload} disabled={isLoading || !file}>
            {isLoading ? 'Processing...' : 'Upload and Digitize'}
          </Button>
        </div>
      </div>
    </div>
  );
}