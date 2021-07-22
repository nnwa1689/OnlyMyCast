//react
import React, {useEffect} from 'react'
//ui
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import GroupIcon from '@material-ui/icons/Group';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
//firebase
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 275,
        marginTop: 100,
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    bottom: {
        marginBottom: 0,
    }
  }));


  const HelpCenter = (props) => {

    const classes = useStyles();
    useEffect(
        ()=>{
            window.scrollTo(0, 0);
        }
    )
    return(
        <Container maxWidth="md">
            <Card className={classes.root}>
                <CardContent>
                    <Typography variant="h5" component="span">
                        嗨)^o^(<br/>有什麼需要幫忙的嗎？                          
                    </Typography>
                </CardContent>
            </Card>
            <br/><br/>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="span">
                        <GroupIcon/>我是聽眾<br/>                            
                    </Typography>
                </CardContent>
            </Card>
            <br/>
            <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                    <Typography variant="h6">追蹤頻道</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="body2" align="left">
                        <Typography variant="body1">透過 ID 搜尋頻道</Typography>
                        頻道 ID 是頻道唯一的識別碼，可以使用右上角的搜尋來輸入 ID 並找到頻道，請注意頻道 ID 必須大小寫完全符合才能搜尋得到，我們還在著手改善搜尋問題。
                        <br/><br/><Divider/><br/>
                        <Typography variant="body1">透過 URL</Typography>
                        如果拿到一個頻道 URL ，可以直接進入頻道主頁後請求追蹤頻道。
                    </Typography>
                    </AccordionDetails>
            </Accordion>

            <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                    <Typography variant="h6">管理我追蹤的頻道</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="body2" align="left">
                        <Typography variant="body1">透過頻道首頁</Typography>
                        如果你改變心意，可以來到要取消追蹤的頻道首頁，按下頻道的取消追蹤即可。
                        <br/><br/><Divider/><br/>
                        <Typography variant="body1">透過個人設定</Typography>
                        右上角進入個人設定畫面，最後一個項目"追蹤管理"可以移除不想再追蹤的頻道。
                    </Typography>
                    </AccordionDetails>
            </Accordion>

            <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                    <Typography variant="h6">收聽節目</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="body2" align="left">
                        <Typography variant="body1">透過頻道首頁</Typography>
                        進入要收聽的頻道首頁，選定特定單集，按下右邊的播放按鈕即可播放
                        <br/><br/><Divider/><br/>
                        <Typography variant="body1">透過單集主頁</Typography>
                        如果已經進入單集主頁，可以直接播放紅色"播放單集"按鈕來開始播放。
                        <br/><br/><Divider/><br/>
                        <Typography variant="body1">無法播放</Typography>
                        如果無法播放，可以先至播放器嘗試按下暫停後，再按下播放鍵；如果情況沒有改善請嘗試播放其他單集，如果其他單集也無法播放請直接與我們聯絡！
                    </Typography>
                    </AccordionDetails>
            </Accordion>


            <br/><br/>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="span">
                        <KeyboardVoiceIcon/>我是Podcaster<br/>                            
                    </Typography>
                </CardContent>
            </Card>
            <br/>
            <div className={classes.bottom}>
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                    <Typography variant="h6">建立並編輯頻道</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="body2" align="left">
                        <Typography variant="body1">頻道ID</Typography>
                        頻道 ID 是頻道唯一的識別碼，設定後就不可以變更，有區分大小寫。
                        <br/><br/><Divider/><br/>
                        <Typography variant="body1">頻道名稱以及頻道封面 </Typography>
                        頻道名稱沒有字數限制，也可以於創立頻道後變更。頻道封面建議使用 figma 或是 canva 製作。 https://www.figma.com/ <br/> https://www.canva.com/zh_tw/
                        <br/><br/><Divider/><br/>
                        <Typography variant="body1">頻道簡介</Typography>
                        頻道簡介使用 markdown 編輯。如果需要使用其他語法可以參考：https://markdown.tw/
                    </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography variant="h6">如何錄製與後製我的節目？</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="body2" align="left">
                        <Typography variant="body1">設備</Typography>
                        只要最基本的麥克風以及電腦或手機就能開始錄製你的節目。
                        <br/><br/><Divider/><br/>
                        <Typography variant="body1">單人錄製</Typography>
                        你可以使用手機或電腦內建的錄音機錄音，如果你使用 Mac 或是 iPhone，我們建議你使用 garageband 來錄製並後製你的節目。
                        <br/><br/><Divider/><br/>
                        <Typography variant="body1">多人錄製</Typography>
                        多人我們建議可以使用 Skype 或是 GoogleMeet 等多人會議平台錄製。
                        <br/><br/><Divider/><br/>
                        <Typography variant="body1">後製</Typography>
                        如果你使用 Mac 或是 iPhone，我們建議你使用 garageband 來錄製並後製你的節目。
                        如果你使用 Windows ，可以使用 Audacity 來後製你的節目。
                        <br/><br/><Divider/><br/>
                        <Typography variant="body1">GarageBand教學</Typography>
                        如有需要，我們提供iOS以及MacOS上GarageBand的基本教學：https://www.notes-hz.com/post/228
                    </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography variant="h6">上傳檔案格式限制</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="body2" align="left">
                    <Typography variant="body1">檔案格式</Typography>
                        目前我們接受 MP3、audio/MP4 以及 M4A 三種檔案格式，如果上傳非此三種的檔案格式可能會導致上傳或播放失敗。
                        <br/><br/><Divider/><br/>
                        <Typography variant="body1">大小及位元速率</Typography>
                        針對檔案大小及長度目前我們沒有限制，但我們建議以 192kbps 的位元速率輸出檔案。
                        <br/><br/><Divider/><br/>
                        <Typography variant="body1">GarageBand</Typography>
                        為使播放器時間長度正常，輸出必須選擇 CBR固定位元速率格式，在 GarageBand 預設就是 CBR 不必設定。 在 GarageBand 當中可以輸出 MP3 以及 M4A（iPhone）格式。
                        <br/><br/><Divider/><br/>
                        <Typography variant="body1">Audacity</Typography>
                        為使播放器時間長度正常，輸出必須選擇 CBR固定位元速率格式，在 Audacity 預設就是 CBR 不必設定。Audacity 可以輸出 MP3 以及 M4A 格式。
                        
                    </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography variant="h6">上傳並發佈單集</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="body2" align="left">
                        <Typography variant="body1">選擇檔案並設定節目標題和簡介</Typography>
                        選擇檔案之後，下一步設定單集標題以及單集簡介，再下一步之後按下完成就會開始上傳。請注意，目前檔案無法在上傳後更改。
                        <br/><br/><Divider/><br/>
                        <Typography variant="body1">Markdown</Typography>
                        單集介紹使用 Markdown 編輯，如果要使用其他語法可以參考：https://markdown.tw/
                        <br/><br/><Divider/><br/>
                        <Typography variant="body1">草稿</Typography>
                        可以將單集名稱以及簡介儲存為草稿，直到完成上傳單集後草稿才會被刪除。
                    </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography variant="h6">編輯已發佈單集</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="body2" align="left">
                        <Typography variant="body1">編輯單集標題和簡介</Typography>
                        在進入單集管理頁面後，點選鉛筆即可更改單集的標題以及簡介。
                        <br/><br/><Divider/><br/>
                        <Typography variant="body1">檔案更換</Typography>
                        很抱歉，目前無法更換音檔，如需更換必須重新發佈新的單集。
                    </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography variant="h6">分享頻道</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="body2" align="left">
                        <Typography variant="body1">以 ID 分享</Typography>
                        在進入頻道設定頁面，可以複製電台 ID 分享給你的朋友。
                        <br/><br/><Divider/><br/>
                        <Typography variant="body1">以網址分享</Typography>
                        在進入頻道設定頁面後，可以複製電台 URL 直接分享給朋友。
                    </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography variant="h6">審核追蹤者</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="body2" align="left">
                        <Typography variant="body1">審核新的追蹤者</Typography>
                        進入追蹤請求中，可審查新來的追蹤者，並允許或拒絕追蹤。
                        <br/><br/><Divider/><br/>
                        <Typography variant="body1">移除追蹤者</Typography>
                        進入追蹤管理，可以移除已經被允許的追蹤者，被移除者必須重新請求追蹤才能繼續收聽頻道。
                    </Typography>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography variant="h6">音樂及版權問題</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography variant="body2" align="left">
                        <Typography variant="body1">有版權音樂</Typography>
                        目前針對版權我們不做任何審查，但如有版權所有者提出申訴，我們將會介入審查，或是移除該單集，最嚴重可能必須關閉頻道。
                        <br/><br/><Divider/><br/>
                        <Typography variant="body1">無版權音樂</Typography>
                        採用無版權音樂需注意是否要求標註創作者。
                    </Typography>
                    </AccordionDetails>
                </Accordion>
            </div>
        </Container>
    )
}
export default HelpCenter;