/**
 * Rehype plugin: puts an embedded Google Map at the end of each section whose
 * heading starts with the name of one of the listing's `locations` (frontmatter).
 * Locations with no matching heading are listed under "On the map" at the end,
 * so renaming a heading moves its map rather than losing it.
 *
 * Uses the keyless `output=embed` URL — needs `frame-src https://www.google.com`
 * in the CSP (public/_headers).
 */

// `embed` may be the bare link or the whole <iframe> snippet Google gives you
const embedUrl = ({ query, embed }) =>
  embed
    ? (embed.match(/src="([^"]+)"/)?.[1] ?? embed).trim()
    : `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`;

const isHeading = (node) => node.type === 'element' && /^h[1-6]$/.test(node.tagName);

const textOf = (node) =>
  node.type === 'text' ? node.value : (node.children ?? []).map(textOf).join('');

const el = (tagName, properties, children = []) => ({ type: 'element', tagName, properties, children });

const mapFigure = (location, withCaption) =>
  el('figure', { className: ['location-map'] }, [
    el('iframe', {
      src: embedUrl(location),
      title: `Map: ${location.name}`,
      loading: 'lazy',
      referrerPolicy: 'no-referrer-when-downgrade',
    }),
    ...(withCaption ? [el('figcaption', {}, [{ type: 'text', value: location.name }])] : []),
  ]);

export default function rehypeLocationMaps() {
  return (tree, file) => {
    const locations = file.data.astro?.frontmatter?.locations;
    if (!Array.isArray(locations) || locations.length === 0) return;

    const unplaced = [...locations];
    const insertions = []; // [index, node] — applied back to front so indexes stay valid
    const children = tree.children;

    children.forEach((node, i) => {
      if (!isHeading(node)) return;
      const heading = textOf(node).trim().toLowerCase();
      const match = unplaced.findIndex((loc) => heading.startsWith(loc.name.trim().toLowerCase()));
      if (match === -1) return;

      const [location] = unplaced.splice(match, 1);
      const nextHeading = children.findIndex((n, j) => j > i && isHeading(n));
      insertions.push([nextHeading === -1 ? children.length : nextHeading, mapFigure(location, false)]);
    });

    insertions.reverse().forEach(([index, node]) => children.splice(index, 0, node));

    if (unplaced.length > 0) {
      children.push(
        el('h2', { id: 'on-the-map' }, [{ type: 'text', value: 'On the map' }]),
        ...unplaced.map((location) => mapFigure(location, true)),
      );
    }
  };
}
