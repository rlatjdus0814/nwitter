import React from 'react';

const Auth = () => {
  return (
    <div>
      <form>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Paasword" required />
        <input type="submit" value="Log In" />
      </form>
      <div>
        <button>Contiune with Google</button>
        <button>Contiune with Github</button>
      </div>
    </div>
  )
}

export default Auth