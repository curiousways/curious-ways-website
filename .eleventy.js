module.exports = (config) => {
  // Set directories to pass through to the dist folder
  // config.addPassthroughCopy('./src/images/');
  config.addPassthroughCopy('./src/fonts/');
  config.addPassthroughCopy('./src/video/');
  config.addPassthroughCopy('./src/js/');

  // Transforms
  const htmlMinTransform = require('./src/transforms/html-min-transform.js');
  
  // Create a helpful production flag
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Only minify HTML if we are in production because it slows builds _right_ down
  if (isProduction) {
    config.addTransform('htmlmin', htmlMinTransform);
  }

  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  config.setUseGitIgnore(false);

  const sortByDisplayOrder = require('./src/utils/sort-by-display-order.js');

  // Returns work items, sorted by display order
  config.addCollection('work', collection => {
    return sortByDisplayOrder(collection.getFilteredByGlob('./src/work/*.md'));
  });
  
  // Returns work items, sorted by display order then filtered by featured
  config.addCollection('featuredWork', collection => {
    return sortByDisplayOrder(collection.getFilteredByGlob('./src/work/*.md')).filter(
      x => x.data.featured
    );
  });

  // Returns a list of people ordered by filename
  config.addCollection('people', collection => {
    return collection.getFilteredByGlob('./src/people/*.md').sort((a, b) => {
      return Number(a.fileSlug) > Number(b.fileSlug) ? 1 : -1;
    });
  });

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
