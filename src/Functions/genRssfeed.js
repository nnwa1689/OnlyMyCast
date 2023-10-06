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
//markdown
import ReactMarkdown from 'react-markdown';


export default function genrssfeed(userId, userEmail, baseWwwUrl) {

    let channelName, intro, image, autor, rss, hashId, category, feedurl, preUrl;
        firebase.firestore().collection("channel").doc(userId).get()
        .then(
            (doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    if ( data.publicStatu === 'true' ) {
                        
                        channelName = data.name;
                        preUrl = data.preUrl === undefined ? "" : data.preUrl;
                        intro = data.intro + '<br/>----------<br/>本節目由 Onlymycast 強力驅動!';
                        image = (data.icon === undefined ? "" : "https://storage.googleapis.com/onlymycast.appspot.com/" + data.icon.split('/')[7].split('?')[0]);
                        category = ( data.category === undefined ? "" : data.category );

                        //podcast擁有者
                        firebase.firestore().collection("user").doc(data.uid).get()
                            .then(
                                (doc) => {
                                    const data = doc.data();
                                    autor = data.name;
                                    hashId = doc.id;
                                    feedurl = 'https://storage.googleapis.com/onlymycast.appspot.com/rss/' + userId + '/' + hashId;
                                    var feed = new RSS({
                                        title: channelName,
                                        description: intro,
                                        site_url: baseWwwUrl + 'podcast/' + userId,
                                        feed_url: feedurl,
                                        image_url: image,
                                        category: category,
                                        copyright: '&#169;' + autor,
                                        language: 'zh',
                                        generator: 'Onlymycast',
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
                                                {'itunes:email': userEmail}
                                            ]},
                                            {'itunes:image': {
                                            _attr: {
                                                href: image
                                            }
                                            }},
                                            {'itunes:category': [
                                                {_attr: {
                                                  text: category
                                                }},
                                            ]}
                                        ]
                                    });
                                    firebase.firestore().collection("podcast").doc(userId).collection('podcast').orderBy('updateTime', "desc").get()
                                    .then(async (e) => {
                                        if (e.docs.length === 0) {
                                            //pass
                                        } else {
                                            for (var doc of e.docs) {
                                                const qd = doc.data();
                                                const epintro = qd.intro + '<br/>----------<br/>本節目由 Onlymycast 強力驅動!';
                                                feed.item({
                                                    title:  qd.title,
                                                    description: epintro,
                                                    link: baseWwwUrl + 'podcastdetail/' + userId + '/' + doc.id, // link to the item
                                                    guid: doc.id, // optional - defaults to url
                                                    author: autor, // optional - defaults to feed author property
                                                    date: new Date(qd.updateTime.seconds * 1000).toUTCString(), // any format that js Date can parse.
                                                    enclosure: {url : preUrl + 'https://storage.googleapis.com/onlymycast.appspot.com/' + qd.fileRef, type:'audio/mpeg', length: '90000'}, // optional enclosure
                                                    custom_elements: [
                                                        {'itunes:author': autor},
                                                        {'itunes:summary': epintro},
                                                        {'itunes:episodeType': 'full'},
                                                        {'itunes:explicit': 'no'},
                                                        {'content:encoded': epintro},
                                                        {'googleplay:description': epintro},
                                                        {'itunes:image': {
                                                        _attr: {
                                                            href: image
                                                        }
                                                        }},
                                                        {'itunes:duration':parseInt(qd.duration.split(':')[0]) * 60 + parseInt(qd.duration.split(':')[1])}
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
                                    })
                                });
                    }
                }
            }
        );
}