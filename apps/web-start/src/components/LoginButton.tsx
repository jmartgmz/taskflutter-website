import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() =>
        loginWithRedirect({
          authorizationParams: {
            scope: 'openid profile email read:tasks',
          },
        })
      }
      style={{
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
      }}
    >
      Log In
    </button>
  );
};

export default LoginButton;
