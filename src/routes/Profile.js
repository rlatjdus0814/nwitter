import React from 'react';
import { authService } from '../fbase';
import { useHistory } from 'react-router-dom';

const Profile = () => {
  const histoy = useHistory();

  const onLogOutClick = () => {
    authService.signOut();
    histoy.push("/");
  };

  return(
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  )
}

export default Profile