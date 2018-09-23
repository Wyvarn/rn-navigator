import React, { Component } from 'react';
import { arrayOf, object, element, string, oneOfType, func } from 'prop-types';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
    },
    scene: {
        ...StyleSheet.absoluteFillObject,
        flex: 1
    }
});

const buildSceneConfig = (children = []) => {
    const config = {};

    children.forEach(child => {
        const { name, component } = child.props;
        config[name] = { key: name, component};
    });

    return config
}

export const Route = ({ name, component }) => { name, component }

export class Navigator extends Component {
    constructor(props){
        super(props);        
        const sceneConfig = buildSceneConfig(props.children);
        const initialSceneName = props.children[0].props.name;

        this.state = {
           sceneConfig,
           stack: [sceneConfig[initialSceneName]],
        };
    }

    _animatedValue = new Animated.Value(0);

    handlePop = () => {
        Animated.timing(this._animatedValue, {
            toValue: width,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            this._animatedValue.setValue(0);
            this.setState(prevState =>{
                const { stack} = prevState;
                if (stack.length > 1){
                    return {
                        stack: stack.slice(0, stack.length - 1)
                    }
                }
    
                return prevState;
            })    
        })
    }

    handlePush = sceneName => {
        this.setState(prevState => ({
            ...prevState,
            stack: [...prevState.stack, prevState.sceneConfig[sceneName]]
        }), () => {
            this._animatedValue.setValue(width);
            Animated.timing(this._animatedValue, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start()
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { children } = nextProps;
          
        const sceneConfig = buildSceneConfig(children);
        const initialSceneName = children[0].props.name;
        
        if(sceneConfig !== prevState.sceneConfig){
            return {
                ...prevState,
                sceneConfig,
                stack: [sceneConfig[initialSceneName]]
          }
        }
  
        return null
      }
  
    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.stack.map((scene, index) => {
                        const CurrentScene = scene.component;
                        const sceneStyles = [styles.scene];

                        if(index === this.state.stack.length - 1 && index > 0){
                            sceneStyles.push({
                                transform: [
                                    {
                                        translateX: this._animatedValue
                                    }
                                ]
                            })
                        }

                        return (
                            <Animated.View key={scene.key} style={sceneStyles}>
                                <CurrentScene 
                                    navigator={{ push: this.handlePush, pop: this.handlePop }}
                                />
                            </Animated.View>
                        );
                    })
                }
            </View>
        )
    }
}

Navigator.propTypes = {
    children: arrayOf(object)
}

Route.propTypes = {
    name: string,
    component: oneOfType([element, func]),
}