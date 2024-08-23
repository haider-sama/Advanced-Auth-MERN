import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchUserProfile, updateUserProfile } from '../../api/auth';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { UserType } from '../../../../backend/src/shared/types';

const ProfilePage = () => {
  const { isLoggedIn, userId } = useAppContext();
  const queryClient = useQueryClient();

  const [user, setUser] = useState<UserType | null>(null);
  const [editFields, setEditFields] = useState<Partial<UserType>>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    city: '',
    country: '',
  });

  const { isError, isLoading } = useQuery(
    ['userProfile', userId],
    () => {
      if (!userId) {
        throw new Error('User ID is not defined');
      }
      return fetchUserProfile(userId);
    },
    {
      enabled: isLoggedIn && !!userId,
      retry: false,
      onSuccess: (data) => {
        setUser(data);
        setEditFields({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phoneNumber: data.phoneNumber || '',
          address: data.address || '',
          city: data.city || '',
          country: data.country || '',
        });
      },
      onError: (error: any) => {
        toast.error('Error loading profile data.', error);
      },
    }
  );
  
  const mutation = useMutation(
    (updatedData: Partial<UserType>) => {
      if (!userId) {
        throw new Error('User ID is not defined');
      }
      return updateUserProfile(userId, updatedData);
    },
    {
      onSuccess: () => {
        toast.success('Profile updated successfully!');
        queryClient.invalidateQueries(['userProfile', userId]);
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to update profile.');
      },
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!userId) {
      toast.error('User ID is not available.');
      return;
    }
    console.log('Updating with fields:', editFields);
    mutation.mutate(editFields);
  };

  const isFormChanged = user && Object.keys(editFields).some(
    (key) => editFields[key as keyof UserType] !== (user as any)[key]
  );

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading profile.</p>;

  return (
    <div className="flex justify-center items-center p-4">
      <div className="flex flex-col items-center bg-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mt-2 mb-16">Account</h1>
        {user ? (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0">
                {/* <AvatarUpload /> */}
              </div>
              <div className="text-gray-900">
                <label className="block mb-2">
                  <strong>First Name:</strong>
                  <input
                    type="text"
                    name="firstName"
                    value={editFields.firstName || ''}
                    onChange={handleChange}
                    className="border rounded w-full py-2 px-2"
                  />
                </label>
                <label className="block mb-2">
                  <strong>Last Name:</strong>
                  <input
                    type="text"
                    name="lastName"
                    value={editFields.lastName || ''}
                    onChange={handleChange}
                    className="border rounded w-full py-2 px-2"
                  />
                </label>
                <label className="block mb-2">
                  <strong>Email:</strong>
                  <p>{user.email}</p>
                </label>
              </div>
            </div>
            <div className="flex flex-col space-y-4 mt-4">
              <label className="block">
                <strong>Phone:</strong>
                <input
                  type="text"
                  name="phoneNumber"
                  value={editFields.phoneNumber || ''}
                  onChange={handleChange}
                  className="border rounded w-full py-2 px-2"
                />
              </label>
              <label className="block">
                <strong>Address:</strong>
                <input
                  type="text"
                  name="address"
                  value={editFields.address || ''}
                  onChange={handleChange}
                  className="border rounded w-full py-2 px-2"
                />
              </label>
              <label className="block">
                <strong>City:</strong>
                <input
                  type="text"
                  name="city"
                  value={editFields.city || ''}
                  onChange={handleChange}
                  className="border rounded w-full py-2 px-2"
                />
              </label>
              <label className="block">
                <strong>Country:</strong>
                <input
                  type="text"
                  name="country"
                  value={editFields.country || ''}
                  onChange={handleChange}
                  className="border rounded w-full py-2 px-2"
                />
              </label>
              <button
                type="button"
                onClick={handleSave}
                disabled={!isFormChanged}
                className="bg-primary text-white px-4 py-2 rounded-lg disabled:bg-gray-300"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <p>No user data available.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
