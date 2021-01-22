import { StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 5
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
        alignSelf: 'flex-end'
    }
})

export default styles;