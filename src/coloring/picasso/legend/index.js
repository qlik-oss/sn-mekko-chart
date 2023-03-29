import component from './visual';
import tap from './event-tap';

export default function legend(componentConfig, config) {
  const components = [];
  const interactions = [];
  const c = component(componentConfig, config);

  components.push(c);

  if (c && c.type === 'legend-cat') {
    interactions.push(tap(componentConfig));
  }

  return {
    interactions,
    components,
  };
}
