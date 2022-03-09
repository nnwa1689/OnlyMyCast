/*-------------RSS消滅器-----------*/
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

export default function delrssfeed(userId) {

    let hashId;
        firebase.firestore().collection("channel").doc(userId).get()
        .then(
            (doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    //podcast擁有者
                    firebase.firestore().collection("user").doc(data.uid).get()
                        .then(
                            (doc) => {
                                hashId = doc.id;
                                var storageRef = firebase.storage().ref().child('rss/' + userId + '/' + hashId);
                                storageRef.delete().then(() => {
                                    // File deleted successfully
                                  }).catch((error) => {
                                    // Uh-oh, an error occurred!
                                  });
                            }
                        );
                }
            }
        );
}