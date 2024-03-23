import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
// import Link from "next/link";
import { IStore, useStore } from "../store";
// import Clock from "./Clock";
import { getSnapshot } from "mobx-state-tree";

interface IOwnProps {
  store?: IStore;
  // title: string;
  // linkTo: string;
}

const ViewStore: React.FC<IOwnProps> = observer(({store}) => {
  // const { lastUpdate, light, start, stop } = useStore(store);
  const storeSnapshot = getSnapshot(useStore(store));

  /*
  useEffect(() => {
    start();
    return () => {
      stop();
    };
  }, [start, stop]);
  */

  return (
    <div>
      <h3>View Store</h3>
      <pre>{JSON.stringify(storeSnapshot, undefined, 2)}</pre>
    </div>
  );
});

export default ViewStore;