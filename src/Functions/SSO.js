/*-------------SSO第三方登入-----------*/
/*
    author:hazuya
 */
/*--------------------------------*/
//firebase
import firebase from "firebase/app";
import "firebase/auth";

export const isWithSSO =  async(user) => {
    //確認 user 資料已被建立
    
    return new Promise((resolve, reject) => {
        if (user.providerData[0].providerId === "google.com") {
            resolve(true);
        }
    })
}

export const createUserInfoWithSSO = async(user) => {

    return new Promise((resolve, reject) => {

        firebase.firestore().collection("user").doc(user.uid).set(
            {
                name: user.displayName,
                userId : "",
                avatar : user.photoURL,
            }
            ).then(() => {
                resolve(true);
            }).catch((e) => reject(e))
    })

}

export async function GoogleSigning() {
    const providerGoogle = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(providerGoogle)
    .then((result) => {
        // The signed-in user info.
        var user = result.user;
    }).catch(
      (e) => {

      }
    )
}