# self-rss
RSS Feedが実装されていないWebページの更新を監視するために、
セルフホストでRSSを配信できるようにしました。

今のところpixiv fanbox用のコードだけです

## 使い方
- Cloud FunctionsなりAWS Lambdaなりのnodejsが動くサーバーレス関数に置く
- RSSリーダーにサーバーレス関数のURLを登録する
