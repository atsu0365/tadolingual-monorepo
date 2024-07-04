cat << EOF > src/index.js
const Article = require('./article');
const BlogPost = require('./blog');
const AffiliateLink = require('./affiliate');
const WebMedia = require('./webmedia');
const CMS = require('./cms');


module.exports = {
  Article,
  BlogPost,
  AffiliateLink,
  WebMedia,
  CMS
};
EOF