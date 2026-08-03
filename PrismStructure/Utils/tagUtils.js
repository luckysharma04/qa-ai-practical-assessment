const { TAGS } = require('../Config/constants');

/**
 * Build a describe title with Playwright grep tags.
 * @param {string} name Human-readable suite name
 * @param {string[]} tags e.g. [TAGS.smoke, TAGS.ui]
 */
function tagTitle(name, tags) {
  return [name, ...tags].join(' ');
}

module.exports = { tagTitle, TAGS };
