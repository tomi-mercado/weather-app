import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';

const styles = (theme: Theme) => createStyles({
    root: {
        width: '40%',
        padding: '1.5rem',
        textAlign: 'center',
        [theme.breakpoints.down('md')]: {
            width: '80%',
        }
    },
    weatherInfoWrapper: {
        marginTop: '1.5rem',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    image: {
        width: '4rem',
        height: '4rem',
    },
})

export default styles;
