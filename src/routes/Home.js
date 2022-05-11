import React, {useState, useEffect} from 'react';
import { dbService } from '../fbase';

const Home = () => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);

  const getNweets = async () => {
    const dbNweets = await dbService.collection("nweets").get();
    dbNweets.forEach((document) => {
      const nweetObject = {...document.data(), id: document.id};
      setNweets((prev) => [nweetObject, ...prev])
    });
  };

  useEffect(() => {
    getNweets();
  }, []);

  console.log(nweets);

  const onSubmit = async(event) => {
    event.preventDefault();
    await dbService.collection("nweets").add({
      text: nweet,
      createAt: Date.now(),
    });
    setNweet("");
  }

  const onChange = (event) => {
    event.preventDefault();
    const {
      target: {value},
    } =event;
    setNweet(value);
  };

  return (
    <form onSubmit = {onSubmit}>
      <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
      <input type="submit" value="Nweet" />
    </form>

  )
};

export default Home