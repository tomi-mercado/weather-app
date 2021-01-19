import { Theme } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';

const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        marginTop: '2rem',
    },
    aclaration: {
        marginTop: '2rem',
        fontSize: '12px',
    }
})

export default styles;
