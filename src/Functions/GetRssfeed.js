/**
 * RSS 轉跳到 GOOGLE
 * 不知道有沒有用
 */
export default function GetRssfeed (podcastUserId, uid) {
    window.document.location.href = 'https://storage.googleapis.com/onlymycast.appspot.com/rss/' + podcastUserId + '/' + uid;
    return true;
}