var rootPath = '/home/sicpc/wwwroot/video/media/k2/';
require('dns').lookup(require('os').hostname(), function(err, add) {
  if (/^192\.168/.test(add)) {
    rootPath = '/Users/rickli/Documents/apps/sicpc/data/';
  }
});

module.exports = {
  getImagePath: function() {
    return rootPath;  
  }
};