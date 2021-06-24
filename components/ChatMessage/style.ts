import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 5,
        width: 6 * Dimensions.get('window').width / 8,
        maxWidth: '100%',
        minWidth: 4 * Dimensions.get('window').width / 8,
        alignSelf: 'flex-end'
    },
    messageBox: {
        padding: 10
    },
    name: {
        color: Colors.light.tint,
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5
    },
    message: {
    },
    time: {
        color: 'grey',
        alignSelf: 'flex-end',
        marginTop: 5
    },
    imageStyle: {
        width: Dimensions.get('window').width / 2 + 10,
        height: 100,
    }
})

export default styles;