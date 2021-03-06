import { DynamicText } from "../../DynamicText";

function Research() {
  return (
    <DynamicText>
      When I was in university I originally planned on going into the field of{" "}
      <em>machine learning</em>
      . My focus has since shifted towards design, but I am still very
      interested in the usage of machine learning, particularly for artistic
      pursuits.
      <br />
      <br />
      Here are the links to the two papers I worked on if you are interested:
      <br />
      <br />-{" "}
      <a href="https://arxiv.org/abs/2006.12463">
        Slimming Neural Networks using Adaptive Connectivity Scores
      </a>
      <br />
      <br />-{" "}
      <a href="https://arxiv.org/abs/2006.12617">
        Adaptive County Level COVID-19 Forecast Models: Analysis and Improvement
      </a>
    </DynamicText>
  );
}

export { Research };
