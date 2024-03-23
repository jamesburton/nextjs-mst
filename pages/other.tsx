import SampleComponent from "../components/SampleComponent";
import ViewStore from "../components/ViewStore";

export default function Other() {
  return <>
    <SampleComponent title={"Other Page"} linkTo="/" />
    <ViewStore />
  </>;
}
