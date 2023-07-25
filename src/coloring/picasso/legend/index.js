import tap from "./event-tap";
import component from "./visual";

export default function legend(componentConfig, config) {
  const components = [];
  const interactions = [];
  const c = component(componentConfig, config);

  components.push(c);

  if (c && c.type === "legend-cat") {
    interactions.push(tap(componentConfig));
  }

  return {
    interactions,
    components,
  };
}
