import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = ({
  showProfilePic = true,
}: {
  showProfilePic?: boolean;
}) => {
  const { logout, user } = useAuth0();

  const handleLogout = () => {
    // Logout and redirect to home page
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Log Out
      </button>
      {showProfilePic && user?.picture && (
        <img
          src={user.picture}
          alt={user.name || 'User'}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #ddd',
          }}
        />
      )}
    </div>
  );
};

export default LogoutButton;
