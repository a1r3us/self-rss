const axios = require('axios');
const rss = require('rss');

const fetchUrl = 'https://api.fanbox.cc/post.listCreator?creatorId=example&limit=100';
const origin = 'https://www.fanbox.cc';
const siteUrl = 'https://example.fanbox.cc/'
const pageTitle = 'page title';

axios.defaults.headers.common["Origin"] = origin;

async function jsonGet() {
  try {
    const res = await axios.get(fetchUrl);
    // jsonを文字列化してparse
    const articleList = JSON.parse(JSON.stringify(res.data.body.items));
    return articleList;
  } catch (err) {
    console.error(err);
  }
}

async function makeRSS(articleList) {
  var feed = new rss({
    title: pageTitle,
    site_url: siteUrl
  })

  const itemList = await articleList;

  await itemList.forEach(item => {
    if (item['feeRequired']===0) {
      var description = item['excerpt'];
    } else {
      let memberOnly = 'この記事は月額'+item['feeRequired']+'円以上支援すると見ることができます。\n';
      var description = memberOnly+item['excerpt'];
    }
    if ('coverImageUrl' in item) {
      feed.item({
        title: item['title'],
        description: description,
        url: siteUrl + 'posts/' + item['id'],
        date: item['updatedDatetime'],
        enclosure: {
          'url': item['coverImageUrl'],
          'type': 'image/jpeg'
        }
      });
    } else {
      feed.item({
        title: item['title'],
        description: description,
        url: siteUrl + 'posts/' + item['id'],
        date: item['updatedDatetime']
      });
    }
  });
  var xml = await feed.xml({ indent: true });
  await console.log(xml);
  // res.set('Content-Type', 'application/rss+xml')
  // res.status(200).send(xml);
}
jsonGet().then(
  articleList => {
    makeRSS(articleList);
  });