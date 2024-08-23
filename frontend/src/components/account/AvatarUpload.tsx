import React, { useRef, useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

interface AvatarUploadProps {
  avatarURL?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = () => {
  const [image, setImage] = useState<File | null>(null);
  const [avatarURL, setAvatarURL] = useState<string>(''); // Expect a single string
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref to access the file input

  useEffect(() => {
    // Fetch the current avatar URL when the component mounts
    const fetchAvatar = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/get-avatar`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch avatar');
        }

        const data = await response.json();
        setAvatarURL(data.avatarURL || ''); // Expect a single string
      } catch (error: any) {
        setError((error as Error).message);
      }
    };

    fetchAvatar();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (image) {
      const formData = new FormData();
      formData.append('avatar', image);

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/upload-avatar`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to upload avatar');
        }

        const data = await response.json();
        setAvatarURL(data.avatarURL); // Expect a single string
      } catch (error: any) {
        setError((error as Error).message);
      }
    }
  };

  // Trigger file input click programmatically
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />
      <button 
        onClick={handleButtonClick}
        className="hover:underline hover:text-gray-900 text-gray-600 px-4 py-2 rounded"
      >
        Select Image
      </button>
      <button 
        onClick={handleUpload}
        className="bg-gray-600 text-white px-4 py-2 rounded"
      >
        Change Avatar
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default AvatarUpload;
