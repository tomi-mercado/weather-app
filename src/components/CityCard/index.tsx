import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

import styles from './styles';

interface CityCardsProps {
    name: string;
    // TODO: type this
    icon: any;
    max: number;
    min: number;
    humidity: number;
}

const useStyles = makeStyles(styles);

const WeatherProperty = ({ name, value }: { name: string; value: number; }) => <Typography variant="subtitle1"><b>{name}:</b> {value}°</Typography>

function CityCard({
    name,
    icon,
    max,
    min,
    humidity,
}: CityCardsProps) {

    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <div>
                <Typography variant="h3">{name}</Typography>
                <WeatherProperty name="Max" value={max}/>
                <WeatherProperty name="Min" value={min}/>
                <WeatherProperty name="Humidity" value={humidity}/>
            </div>
            <div>
                <img className={classes.image} src={icon} alt="weather description"/>
            </div>
        </Card>
    )
}

export default CityCard;