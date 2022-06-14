import React, {useState, useEffect} from 'react';
import { dbService} from '../fbase';
import Nweet from '../components/Nweets';
import NweetsFactory from '../components/NweetFactory';

const Home = ({userObj}) => {
  const [nweets, setNweets] = useState([]);
  const [nweet, setNweet] = useState({});
  const [attachment, setAttachment] = useState("");

  /*const getNweets = async () => {
    const dbNweets = await dbService.collection("nweets").get();
    dbNweets.forEach((document) => {
      const nweetObject = {...document.data(), id: document.id};
      setNweets((prev) => [nweetObject, ...prev])
    });
  };*/

  useEffect(() => {
    //getNweets();
    dbService.collection("nweets").onSnapshot((snapshot) => {
      const newArray = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));
      setNweets(newArray);
    });
  }, []);

  console.log(nweets);

  
  return (
    <>
      <NweetsFactory userObj={userObj} />
      <div>
        {nweets.map((nweet) => (
          <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
        ))}
      </div>
    </>
  )
};

export default Home