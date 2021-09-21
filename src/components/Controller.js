import React, { useState, useEffect } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import MQTT from 'sp-react-native-mqtt';
import uuid from 'react-native-uuid';

// Icons
import Icon from 'react-native-vector-icons/AntDesign';

// Images
import { Images } from '../constants';

// Theme
import { SIZES } from '../constants';

const MQTT_SERVER = 'broker.emqx.io';
const MQTT_PORT = 1883;
const MQTT_CLIENT_ID = uuid.v4();
const MQTT_TOPIC = '/Sing/car';

const Controller = () => {
    // State
    const [client, setClient] = useState(null);

    // Use Effect
    useEffect(() => {
        if (client) return;
        initialMqtt(MQTT_SERVER, MQTT_PORT, MQTT_CLIENT_ID);

        return () => {
            if (!client) return;

            client.disconnect();
            setClient(null);
        };
    }, []);

    // Initial MQTT Connection
    const initialMqtt = async (uri, port, clientId) => {
        try {
            const client = await MQTT.createClient({
                uri: `mqtt://${uri}:${port}`,
                clientId
            });

            client.on('closed', () => {
                console.log('mqtt.event.closed');
            });

            client.on('error', (msg) => {
                console.log('mqtt.event.error', msg);
            });

            client.on('message', (msg) => {
                console.log('mqtt.event.message', msg);
            });

            client.on('connect', () => {
                console.log('connected');
                client.subscribe(MQTT_TOPIC, 0);
            });

            setClient(client);
            client.connect();
        } catch (error) {
            console.log(error);
        }
    };

    const pressHandlerPublish = (direction) => {
        client.publish(MQTT_TOPIC, direction, 0, false);
    };

    // Render Left Side
    const renderLeftSide = () => {
        return (
            <View style={styles.leftSide}>
                {/* Throttle Button */}
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPressIn={() => { pressHandlerPublish('Throttle') }}
                    onPressOut={() => { pressHandlerPublish('Stop') }}
                >
                    <Icon
                        name="upsquare"
                        size={80}
                        color="#FF5C67"
                    />
                </TouchableOpacity>

                {/* Reverse Button */}
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPressIn={() => { pressHandlerPublish('Reverse') }}
                    onPressOut={() => { pressHandlerPublish('Stop') }}
                >
                    <Icon
                        name="downsquare"
                        size={80}
                        color="#FF5C67"
                    />
                </TouchableOpacity>
            </View>
        );
    };

    // Render Right Size
    const renderRightSide = () => {
        return (
            <View style={styles.rightSide}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPressIn={() => { pressHandlerPublish('Left') }}
                    onPressOut={() => { pressHandlerPublish('Stop') }}
                >
                    <Icon
                        name="leftsquare"
                        size={80}
                        color="#FF5C67"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPressIn={() => { pressHandlerPublish('Right') }}
                    onPressOut={() => { pressHandlerPublish('Stop') }}
                >
                    <Icon
                        name="rightsquare"
                        size={80}
                        color="#FF5C67"
                    />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image
                source={Images.nezuko}
                style={styles.backgroundImage}
                blurRadius={5}
            />
            <View style={styles.content}>
                {renderLeftSide()}
                {renderRightSide()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        paddingBottom: 50
    },
    backgroundImage: {
        width: SIZES.width,
        height: SIZES.height,
        position: 'absolute',
        opacity: 0.6,
        zIndex: -1
    },
    rightSide: {
        flexDirection: 'row'
    }
});

export default Controller;