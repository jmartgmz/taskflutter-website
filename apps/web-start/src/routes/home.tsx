import { Link, createFileRoute } from '@tanstack/react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useApiMutation, useCurrentUser } from '../integrations/api';
import { Header } from '../components/Header';

export const Route = createFileRoute('/home')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user: auth0User, isAuthenticated, isLoading } = useAuth0();
  const {
    data: backendUser,
    isAuthPending,
    showLoading,
    error,
  } = useCurrentUser();
  const [firstName, setFirstName] = useState(backendUser?.firstName || '');
  const [lastName, setLastName] = useState(backendUser?.lastName || '');
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

  // Check if user needs to update their name
  const needsNameUpdate =
    backendUser &&
    backendUser.firstName === 'User' &&
    backendUser.lastName === 'Name';

  if (isLoading || showLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-semibold text-gray-700">Loading...</h2>
          {isAuthPending && (
            <p className="text-gray-600 mt-2">Authenticating with server...</p>
          )}
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !auth0User) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">
            Not authenticated
          </h2>
          <p className="text-gray-600 mt-2">Please log in to continue.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Error</h3>
          <p className="text-red-600">{error.message}</p>
          <p className="text-red-600 mt-2">
            You may not have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome to Catching Butterflies! 🦋
          </h1>
          <p className="text-gray-600">
            {needsNameUpdate
              ? 'Please update your name to continue'
              : 'View your account information'}
          </p>
        </div>

        {/* Name Update Required Alert */}
        {needsNameUpdate && (
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded p-6 mb-6">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5"
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
              <div>
                <h3 className="text-lg font-bold text-yellow-800 mb-2">
                  Action Required: Update Your Name
                </h3>
                <p className="text-yellow-700">
                  Please update your first and last name below to access all
                  features of the application.
                </p>
              </div>
            </div>
          </div>
        )}

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
            </div>
          </div>
        </div>

        {/* Account Information */}
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Account Information
            </h3>
            <div className="space-y-5">
              {!isEditing ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={
                      `${backendUser.firstName || ''} ${backendUser.lastName || ''}`.trim() ||
                      'Not set'
                    }
                    readOnly
                    className="w-full px-4 py-3 border border-gray-200 rounded bg-gray-50 text-gray-700 cursor-not-allowed focus:outline-none"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter your first name"
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your last name"
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}
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
                      } catch (err) {
                        console.error('Failed to update user:', err);
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
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 transition-colors"
                >
                  Edit Name
                </button>
              )}
              {updateUserMutation.isSuccess && !isEditing && (
                <p className="text-sm text-green-600 font-medium">
                  Profile updated successfully!
                </p>
              )}
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
        )}

        {/* Quick Links */}
        {!needsNameUpdate ? (
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Quick Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/"
                className="flex items-center gap-4 p-5 bg-linear-to-br from-purple-50 to-pink-50 rounded border-2 border-purple-200 hover:border-purple-300 transition-all hover:shadow-md"
              >
                <div className="w-12 h-12 bg-purple-600 rounded flex items-center justify-center shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Go to Dashboard</p>
                  <p className="text-xs text-gray-600">
                    View your main dashboard
                  </p>
                </div>
              </Link>

              <Link
                to="/tasks"
                className="flex items-center gap-4 p-5 bg-linear-to-br from-blue-50 to-purple-50 rounded border-2 border-blue-200 hover:border-blue-300 transition-all hover:shadow-md"
              >
                <div className="w-12 h-12 bg-pink-600 rounded flex items-center justify-center shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">View Tasks</p>
                  <p className="text-xs text-gray-600">Manage your tasks</p>
                </div>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 backdrop-blur-sm rounded shadow-lg p-8 border-2 border-gray-300 mb-6 opacity-60">
            <h3 className="text-xl font-bold text-gray-500 mb-6 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Quick Links (Locked)
            </h3>
            <p className="text-gray-500 text-center py-4">
              Update your name above to unlock quick links
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
