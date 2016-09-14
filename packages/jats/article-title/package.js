'use strict';

import ArticleTitle from './ArticleTitle'
import ArticleTitleConverter from './ArticleTitleConverter'
import ArticleTitleComponent from './ArticleTitleComponent'

export default {
  name: 'article-title',
  configure: function(config) {
    config.addNode(ArticleTitle);
    config.addConverter('jats', ArticleTitleConverter);
    config.addComponent(ArticleTitle.type, ArticleTitleComponent);
  }
}