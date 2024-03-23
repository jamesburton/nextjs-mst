import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
// import Link from "next/link";
import { IStore, useStore } from "../../store";
import { login } from '../../authConfig';

interface IOwnProps {
    store?: IStore;
}

const SignIn: React.FC<IOwnProps> = observer((props) => {
    const store = useStore(props.store);

  return (
    <button onClick={() => store.auth.signIn()}>Sign In</button>
    // <button onClick={() => login()}>Sign In</button>
  );
});

export default SignIn;