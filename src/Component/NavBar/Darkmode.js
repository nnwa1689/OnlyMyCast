//react
import React, { useState } from 'react';
//redux
import { useSelector, useDispatch } from 'react-redux';
import { setMode } from '../../Reducer/action';
//mui
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';

const Darkmode = (props) => {

    const [isDarkmode, setButtonMode] = useState( useSelector(state => state.mode));
    const lightStyle = { background: '#f7f7f7' };
    const darkStyle = { background: 'rgb(24, 24, 24)', color: "white" };
    const dispatch = useDispatch();

    const handleMode = () => {
        if (isDarkmode === 'light') {
            setButtonMode('dark');
            dispatch(setMode('dark'));
        } else {
            setButtonMode('light');
            dispatch(setMode('light'));
        }
    }

    return(
        <Tooltip title={ isDarkmode === 'light' ? '黑暗模式' : '明亮模式' }>
        <Fab style={ isDarkmode === 'light' ? darkStyle : lightStyle } onClick={ handleMode }  size="small" edge="end" >
            { isDarkmode === 'light' ? <Brightness4Icon /> : <Brightness7Icon /> }
        </Fab>
      </Tooltip>
    );

}

export default Darkmode;