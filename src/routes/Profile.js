import React, {useEffect} from 'react';
import { authService, dbService } from '../fbase';
import { useHistory } from 'react-router-dom';

const Profile = ({userObj}) => {
  const history = useHistory()

  const onLogOutClick = () => {
    authService.signOut()
    history.push("/")
  }

  const getMyNweets = async () => {
    const nweets = await dbService.collection("nweets").where("createId", "==", userObj.uid).orderBy("createAt", "asc").get();
    console.log(nweets.docs.map((doc) => doc.data()));
  }

  useEffect(() => {
    getMyNweets();
  }, []);

  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  )
}

export default Profile