# onlymycast - 建立自己的私人 podcast

本專案是業餘專案，不過嘗試以一個產品設計的思維進行。

# 維護指南

本專案使用 firebase 來建立， 嘗試 serverless 的架構設計方式，固無 server 端 api，關於資料結構，共分成 firestore database 以及 realtime database。

## firestore 資料結構

### channel -> { channel UserID }

	icon：頻道圖示
	intro：頻道介紹
	name：頻道名稱
	uid：建立者userUid
	updateTime：最後更新日期
	userId：頻道ＩＤ


### fans -> { channel UserID }

	{ 粉絲UserUID } : 粉絲userUid


### podcast -> { channel UserID } -> podcast -> { podcastID }
	
	duration : 單集長度
	fileRef : 單集firestore file 參考路徑
	intro:單集介紹
	title:單集名稱
	uid:發布者userUid
	updateTime:單集發布日期
	url:單集實體url

### podcast -> { channel UserID } -> castdarft -> { podcastID }
	
	duration : 單集長度
	fileRef : 單集firestore file 參考路徑
	intro:單集介紹
	title:單集名稱
	uid:發布者userUid
	updateTime:草稿儲存日期
	url:單集實體url


### podcast -> { channel UserID } -> podcast -> { podcastID } -> playedlist

	{ 收聽者 usrUid } : 收聽者 userUid


### subscribe -> { userUid }

	{ 訂閱頻道UserId } : 訂閱日期


### user -> { userUID }

	avatar : 使用者頭像
	name : 使用者名稱
	userId : 使用者建立頻道之ID


## RealTime Database 資料結構

-subcheck->{ channel UserID }->{ 追蹤者UserUID: 追蹤者UserUID }

-subreq->{ 追蹤者UserUID  } -> { 被追蹤頻道userID : 被追蹤頻道的UserID }

# 程式編譯事項

## FirebaseConfig
設定檔案有分成dev環境以及產品環境，目前透過修改檔案名稱切換渠道。

## package.json

注意"homepage": "/webapp/", 這串，測試環境改成 "."，產品環境為 webapp


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
