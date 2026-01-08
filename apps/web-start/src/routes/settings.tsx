import { Link, createFileRoute } from '@tanstack/react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import LogoutButton from '../components/LogoutButton';
import { useApiMutation, useCurrentUser } from '../integrations/api';
import { Header } from '../components/Header';

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  const {
    user: auth0User,
    isAuthenticated,
    isLoading: auth0Loading,
  } = useAuth0();
  const { data: backendUser, showLoading } = useCurrentUser();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Initialize form values when backendUser loads
  useState(() => {
    if (backendUser) {
      setFirstName(backendUser.firstName || '');
      setLastName(backendUser.lastName || '');
    }
  });

  const updateUserMutation = useApiMutation<
    { firstName: string; lastName: string },
    unknown
  >({
    endpoint: () => ({ path: '/users/me', method: 'PATCH' }),
    invalidateKeys: [['current-user']],
  });

  if (auth0Loading || showLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !auth0User) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">
            Please log in to view settings
          </h2>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 mt-4 inline-block"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header userPicture={auth0User.picture} userName={auth0User.name} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Overview Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded shadow-lg p-8 border border-purple-100 mb-6">
          <div className="flex items-center gap-6">
            {auth0User.picture ? (
              <img
                src={auth0User.picture}
                alt={auth0User.name || 'User'}
                className="w-24 h-24 rounded-full object-cover border-4 border-purple-200 shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-4 border-purple-200 shadow-lg">
                <span className="text-4xl text-white font-bold">
                  {auth0User.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {auth0User.name || 'User'}
              </h2>
              <p className="text-gray-600">{auth0User.email}</p>
              {auth0User.email_verified && (
                <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified Account
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded shadow-lg p-8 border border-purple-100 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Account Information
          </h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={auth0User.name || 'Not provided'}
                readOnly
                className="w-full px-4 py-3 border border-gray-200 rounded bg-gray-50 text-gray-700 cursor-not-allowed focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={auth0User.email || 'Not provided'}
                readOnly
                className="w-full px-4 py-3 border border-gray-200 rounded bg-gray-50 text-gray-700 cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Edit Profile Information */}
        {backendUser && (
          <div className="bg-white/80 backdrop-blur-sm rounded shadow-lg p-8 border border-purple-100 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Profile Information
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setIsEditing(true);
                  }}
                  placeholder="Enter your first name"
                  className="w-full px-4 py-3 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setIsEditing(true);
                  }}
                  placeholder="Enter your last name"
                  className="w-full px-4 py-3 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              {isEditing && (
                <div className="flex gap-4 pt-2">
                  <button
                    onClick={async () => {
                      try {
                        await updateUserMutation.mutateAsync({
                          firstName,
                          lastName,
                        });
                        setIsEditing(false);
                      } catch (error) {
                        console.error('Failed to update user:', error);
                        alert('Failed to update profile. Please try again.');
                      }
                    }}
                    disabled={updateUserMutation.isPending}
                    className="px-6 py-3 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateUserMutation.isPending
                      ? 'Saving...'
                      : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setFirstName(backendUser.firstName || '');
                      setLastName(backendUser.lastName || '');
                      setIsEditing(false);
                    }}
                    disabled={updateUserMutation.isPending}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              )}
              {updateUserMutation.isSuccess && !isEditing && (
                <p className="text-sm text-green-600 font-medium">
                  Profile updated successfully!
                </p>
              )}
            </div>
          </div>
        )}

        {/* Game Stats */}
        {backendUser && (
          <div className="bg-white/80 backdrop-blur-sm rounded shadow-lg p-8 border border-purple-100 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Butterfly Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-linear-to-br from-purple-50 to-pink-50 rounded border-2 border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Total Points
                  </span>
                  <svg
                    className="w-5 h-5 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-purple-600">
                  {backendUser.userPoints || 0}
                </p>
              </div>
              <div className="p-5 bg-linear-to-br from-blue-50 to-purple-50 rounded border-2 border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    User ID
                  </span>
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-xs font-mono text-blue-600 truncate">
                  {backendUser.id}
                </p>
              </div>
            </div>
            {backendUser.firstName || backendUser.lastName ? (
              <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded">
                <p className="text-sm text-purple-900">
                  <strong>Profile Name:</strong> {backendUser.firstName}{' '}
                  {backendUser.lastName}
                </p>
              </div>
            ) : null}
          </div>
        )}

        {/* Danger Zone */}
        <div className="bg-white/80 backdrop-blur-sm rounded shadow-lg p-8 border-2 border-red-200 mb-6">
          <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Account Actions
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Manage your session and account access
          </p>
          <LogoutButton showProfilePic={false} />
        </div>
      </div>
    </div>
  );
}
