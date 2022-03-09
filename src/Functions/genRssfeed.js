/*-------------RSS產生器-----------*/
/*
    author:hazuya
    此為客戶端測試版
    未來會部署為伺服器端 API
 */
/*--------------------------------*/
//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";
//rss
import RSS from "rss-generator";

export default function genrssfeed(userId) {

    let channelName, intro, image, autor, rss, hashId;
    const poweredby = '<br/>本節目由 <a href="https://onlymycast.notes-hz.com/">Onlymycast </a> 強力驅動！';
        firebase.firestore().collection("channel").doc(userId).get()
        .then(
            (doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    if ( data.publicStatu === 'true' ) {
                        
                        channelName = data.name;
                        intro = data.intro + poweredby;
                        image = (data.icon === undefined ? "" : "https://storage.googleapis.com/onlymycast.appspot.com/" + data.icon.split('/')[7].split('?')[0]);
                        
                        //podcast擁有者
                        firebase.firestore().collection("user").doc(data.uid).get()
                            .then(
                                (doc) => {
                                    const data = doc.data();
                                    autor = data.name;
                                    hashId = doc.id;
                                    var feed = new RSS({
                                        title: channelName,
                                        description: intro,
                                        site_url: 'https://onlymycast.notes-hz.com/webapp/podcast/' + userId,
                                        image_url: image,
                                        copyright: autor,
                                        language: 'zh',
                                        generator: 'onlymycast',
                                        custom_namespaces: {
                                            'itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
                                            'kkbox': 'https://podcast.kkbox.com/',
                                            'googleplay': 'http://www.google.com/schemas/play-podcasts/1.0',
                                            'psc': 'https://podlove.org/simple-chapters/'
                                          },
                                        custom_elements: [
                                            {'googleplay:author': autor},
                                            {'googleplay:description': intro},
                                            {'googleplay:image': image},
                                            {'itunes:author': autor},
                                            {'itunes:summary': intro},
                                            {'itunes:owner': [
                                                {'itunes:name': autor},
                                                {'itunes:email': ''}
                                            ]},
                                            {'itunes:image': {
                                            _attr: {
                                                href: image
                                            }
                                            }},
                                        ]
                                    });
                                    firebase.firestore().collection("podcast").doc(userId).collection('podcast').orderBy('updateTime', "desc").get()
                                    .then(async (e) => {
                                        if (e.docs.length === 0) {
                                            //pass
                                        } else {
                                            for (var doc of e.docs) {
                                                const qd = doc.data();
                                                feed.item({
                                                    title:  qd.title,
                                                    description: qd.intro + poweredby,
                                                    link: 'https://onlymycast.notes-hz.com/webapp/podcastdetail/' + userId + '/' + doc.id, // link to the item
                                                    guid: doc.id, // optional - defaults to url
                                                    author: autor, // optional - defaults to feed author property
                                                    pubDate: new Date(qd.updateTime.seconds * 1000).toUTCString(), // any format that js Date can parse.
                                                    enclosure: {url:'https://storage.googleapis.com/onlymycast.appspot.com/' + qd.fileRef, type:'audio/mpeg'}, // optional enclosure
                                                    custom_elements: [
                                                        {'itunes:author': autor},
                                                        {'itunes:summary': qd.intro},
                                                        {'googleplay:description': qd.intro},
                                                        {'itunes:image': {
                                                        _attr: {
                                                            href: image
                                                        }
                                                        }},
                                                        {'itunes:duration':qd.duration}
                                                    ]
                                                });
                                            }
                                        }
                                    }).then(() => {
                                        var storageRef = firebase.storage().ref().child('rss/' + userId + '/' + hashId);
                                        rss = feed.xml();
                                        storageRef.putString(rss).then(
                                            (snaphost) => {
                                                console.log('rss gen suc!');
                                            }
                                        )
                                    }
                                        )
                                }
                            );
                    }
                }
            }
        );
}