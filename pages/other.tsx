import SampleComponent from "../components/SampleComponent";
import ViewStore from "../components/ViewStore";

import SignIn from '../components/buttons/SignIn';
import SignOut from '../components/buttons/SignOut';

export default function Other() {
  return <>
    <SampleComponent title={"Other Page"} linkTo="/" />
    <ViewStore />
    <div>
      <SignIn />
      <SignOut />
    </div>
  </>;
}
