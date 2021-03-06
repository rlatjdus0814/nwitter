import React, {useState} from 'react';
import { authService} from '../fbase';
import { useHistory } from 'react-router-dom';

const Profile = ({userObj, refreshUser}) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.newDisplayName);

  const onLogOutClick = () => {
    authService.signOut()
    history.push("/")
  }

  const onChange = (event) => {
    const {
      target: {value},
    } = event;
    setNewDisplayName(value); 
  }

  const onSubmit = async(event) => {
    event.preventDefault();
    if(userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({displayName:newDisplayName});
      refreshUser();
    }
  };


  // const getMyNweets = async () => {
  //   const nweets = await dbService.collection("nweets").where("createId", "==", userObj.uid).orderBy("createAt", "asc").get();
  //   console.log(nweets.docs.map((doc) => doc.data()));
  // }

  // useEffect(() => {
  //   getMyNweets();
  // }, []);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Display name" onChange={onChange} value={newDisplayName} />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  )
}

export default Profile