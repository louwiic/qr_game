import React from 'react'
import { ActivityIndicator, Avatar, TextInput } from 'react-native-paper';


export default AvatarComponent = ({ ...avatarProps }) => {

    return (
        <Avatar.Image
            onLayout={() => {
                console.log('Avatar is mount')
            }}
            onLoadEnd={() => {
                console.log('load done')
            }}
            {...avatarProps}
        />
    )
}