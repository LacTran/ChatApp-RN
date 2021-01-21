import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 60,
        marginRight: 15,
    },
    leftContainer: {
        flexDirection: 'row',
        flex: 1
    },
    container: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        padding: 10
    },
    username: {
        fontWeight: 'bold',
        fontSize: 16
    },
    lastMessage: {
        fontSize: 16,
        color: 'grey',
    },
    midContainer: {
        justifyContent: 'space-around',
    },
    time: {
        fontSize: 14,
        color: 'grey'
    }
})

export default styles;