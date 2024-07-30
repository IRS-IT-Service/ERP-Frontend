import React from 'react';

const Testing3 = () => {
  const getGoogleOAuthUrl = () => {
    const url = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
      redirect_uri: '',
      client_id: '',
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
    };
    
    const qs = new URLSearchParams(options).toString();
    
    return `${url}?${qs}`;
  };

  const handleLogin = () => {
    const authUrl = getGoogleOAuthUrl();
    window.location.href = authUrl; 
  };

  return (
    <div>
      <h2>Login with Google</h2>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Testing3;
