const CMS = require('./src/cms');

async function runDemo() {
  const cms = new CMS();

  const articles = [
    {
      title: '英語多読の始め方：初心者向け完全ガイド',
      content: '英語多読は、大量の英語テキストを読むことで...',
      author: '山田太郎',
      category: '多読入門'
    },
    {
      title: '英語多読で驚くほど伸びる5つの効果',
      content: '1. 語彙力の向上\n2. 読解スピードの向上\n3. ...',
      author: '佐藤花子',
      category: '多読の効果'
    },
    {
      title: '英語多読におすすめの教材10選',
      content: '1. Graded Readers\n2. 児童書\n3. ...',
      author: '鈴木一郎',
      category: '多読の教材'
    },
    {
      title: '英語多読のコツ：効果的な学習方法と注意点',
      content: '1. 自分のレベルに合った本を選ぶ\n2. 辞書を使わない\n3. ...',
      author: '高橋恵子',
      category: '多読のコツと方法'
    }
  ];

  for (const articleData of articles) {
    const article = cms.createArticle(articleData);
    console.log(`Article created: ${article.title}`);
    
    try {
      const filePath = await cms.generateWebPage(article.id);
      console.log(`Web page generated: ${filePath}`);
    } catch (error) {
      console.error('Error generating web page:', error);
    }
  }

  console.log('\nAll categories:');
  console.log(cms.getAllCategories());

  for (const category of cms.getAllCategories()) {
    console.log(`\nArticles in category "${category}":`);
    const categoryArticles = cms.getArticlesByCategory(category);
    categoryArticles.forEach(article => {
      console.log(`- ${article.title}`);
    });
  }
}

runDemo().catch(console.error);