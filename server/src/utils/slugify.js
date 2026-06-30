function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Generate a unique slug from a title, given a list of existing properties
// (or any objects with a `.slug` field). Appends -2, -3, ... until unique.
// `excludeId` lets an update skip comparing against its own record.
function generateUniqueSlug(title, existingItems, excludeId) {
  const base = slugify(title);
  let slug = base;
  let counter = 2;

  const others = excludeId
    ? existingItems.filter((item) => item._id !== excludeId)
    : existingItems;

  while (others.some((item) => item.slug === slug)) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}

module.exports = { slugify, generateUniqueSlug };
