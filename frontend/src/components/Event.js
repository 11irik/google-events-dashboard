import React from "react";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/styles';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Divider from '@material-ui/core/Divider';

import GavelIcon from '@material-ui/icons/Gavel';
import Rotate90DegreesCcwIcon from '@material-ui/icons/Rotate90DegreesCcw';

import CheckIcon from '@material-ui/icons/Check';
import PrintIcon from '@material-ui/icons/Print';

const styles = theme => ({
    firstButton: {
        backgroundColor: 'black',
        '&:hover': {
            backgroundColor: 'gray',
        },
        color: 'white'
    },
    secondButton: {
        backgroundColor: '#142584',
        '&:hover': {
            backgroundColor: 'gray',
        },
        color: 'white'
    },
    iconButton: {
        '&:hover': {
            backgroundColor: 'gray',
        },
        color: 'white'
    },
    primary:{
        fontSize:'450%',
        textAlign: 'center',
        color: 'white'
    },
    secondary:{
        fontSize:'350%',
        textAlign: 'center',
        color: 'white'
    },
    expiredPrimary:{
        fontSize:'450%',
        textAlign: 'center',
        color: 'red'
    }
});

const MONTH_LIST = [ "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря" ];
const DAY_LIST = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];


//FIXME
const HOST = process.env.REACT_APP_HOST;
const API_PRINT = process.env.REACT_APP_PRINT_API;

class Event extends React.Component {

    constructor(props) {
        super(props);
    }

    getMonth(date) {
        return (MONTH_LIST[date.getMonth()]);
    }

    getDate(date) {
        return (date.getDate());
    }

    getDay(date) {
        return (DAY_LIST[date.getDay()]);
    }

    getDayString(date) {
        return this.getDate(date) + ' ' + this.getMonth(date) + ', ' + this.getDay(date);
    }

    printRequest(event) {
        let url = new URL(HOST + API_PRINT);
        fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(event)
        })
            .then(
                res => console.log(res),
                err => console.log(err),
            )
    }

    //fixme DO NOT REDIRECT AND GENERATE ID FOR NOEVENT
    render() {
        const { classes } = this.props;
        let color;

        if (this.props.colorChange) {
            color = classes.secondButton;
        } else {
            color = classes.firstButton;
        }

        let font;
        if (new Date(this.props.event.end.dateTime) < new Date()) {
            font = classes.expiredPrimary
        } else {
            font = classes.primary
        }

        let StatusIcon
        if (this.props.event.location) {
            if (this.props.event.location.split(' ')[1] === 'queue') {
                StatusIcon = <GavelIcon/>
            } else {
                StatusIcon = <Rotate90DegreesCcwIcon/>
            }
        }


        return (
            <ListItem classes={{button: color}} button component='a' target="_blank" href={this.props.event.htmlLink}>
                <ListItemText classes={{primary:font, secondary:classes.secondary}} primary={this.props.event.summary} secondary={this.getDayString(new Date(this.props.event.end.dateTime))}/>
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" className={classes.iconButton} onClick={() => this.props.onExtend(this.props.event)}>
                        <AccessTimeIcon />
                    </IconButton>
                    <Divider/>
                    <IconButton edge="end" aria-label="delete" className={classes.iconButton} onClick={() => this.props.onFinish(this.props.event)}>
                        <CheckIcon />
                    </IconButton>
                    <Divider/>
                    <IconButton edge="end" aria-label="delete" className={classes.iconButton} onClick={() => this.props.onStatus(this.props.event)}>
                        {StatusIcon}
                    </IconButton>
                    <Divider/>
                    <IconButton edge="end" aria-label="delete" className={classes.iconButton} onClick={() => this.printRequest(this.props.event)}>
                        <PrintIcon />
                    </IconButton>
                </ListItemSecondaryAction>

            </ListItem>
        );
    }
}

export default withStyles(styles)(Event);