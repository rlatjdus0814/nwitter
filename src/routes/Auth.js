import React, { useState } from 'react';

const Auth = () => {
  const [email, setEmail] = useState("");
  const [passowrd, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);

  const onChange = (event) => {
    const {target: {name, value},} = event;

    if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
  }

  const onSubmit = (event) => {
    event.preventDefault();
    if (newAccount) {
      // create newAccount
    }
    else { 
      //log in 
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input name="email" type="email" placeholder="Email" required value="email" onChange={onChange} />
        <input name="password"  type="password" placeholder="Paasword" required value="password" onChange={onChange} />
        <input type="submit" value="{newAccount ? 'Create Account' : 'Log In' " />
      </form>
      <div>
        <button>Contiune with Google</button>
        <button>Contiune with Github</button>
      </div>
    </div>
  )
}

export default Auth