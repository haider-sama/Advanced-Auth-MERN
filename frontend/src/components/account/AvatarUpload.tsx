import React, { useState } from 'react';
import { uploadAvatar } from '../../api/auth';


interface AvatarUploadProps {
  avatarURL?: string; // Expect a single string
  onAvatarUpdate: (newAvatarURL: string) => void; // Callback to notify parent of avatar change
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ avatarURL, onAvatarUpdate }) => {
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (image) {
      setLoading(true);
      try {
        const response = await uploadAvatar(image);

        if (!response.ok) {
          throw new Error('Failed to upload avatar');
        }

        const data = await response.json();
        onAvatarUpdate(data.avatarURL); // Notify parent of new avatar URL
      } catch (error: any) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please select an image to upload');
    }
  };

  return (
    <div className="flex flex-col items-center">
      {avatarURL ? (
        <img src={avatarURL} width="128" height="128" alt="Avatar" />
      ) : (
        <div
          className="flex justify-center items-center bg-gray-300 text-gray-700"
          style={{ width: '128px', height: '128px' }}
        >
          Avatar
        </div>
      )}
      <input
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        className="mb-2"
      />
      <button 
        onClick={handleUpload}
        className="bg-gray-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Uploading...' : 'Change Avatar'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default AvatarUpload;
