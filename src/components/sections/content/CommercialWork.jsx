import { DynamicText } from "../../DynamicText";

function CommercialWork() {
  return (
    <DynamicText>
      I'm available for freelance/contract work or also permanent positions at
      the moment. Feel free to contact me at{" "}
      <a href="mailto:dawsinb@gmail.com">dawsinb@gmail.com</a> if you are
      interested, or if you have any questions.
      <br />
      <br />
      Primarily, I am most experienced with web or game development but am
      always open to any interesting opportunities. For web development I can do
      both more traditional sites, or fancy gpu accelerated ones like this one.
      <br />
      <br />
      If you would like to some some examples of my work{" "}
      <button onClick={() => console.log("clicky")}>click here</button>
    </DynamicText>
  );
}

export { CommercialWork };
