import React, { Component } from 'react';
import { arrayOf, object } from 'prop-types';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
    },
});

const buildSceneConfig = (children = []) => {
    const config = {};

    children.forEach(child => {
        const { name, component } = child;
        config[name] = { key: name, component};
    });

    return config
}

export const Route = () => null

export class Navigator extends Component {
    constructor(props){
        super(props);
        this.state = {
            sceneConfig: {},
            stack: []
        }
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

    handlePop = () => {
        this.setState(prevState =>{
            const { stack} = prevState;
            if (stack.length > 1){
                return {
                    stack: stack.slice(0, stack.length - 1)
                }
            }

            return prevState;
        })
    }

    handlePush = sceneName => {
        this.setState(prevState => ({
            ...prevState,
            stack: [...prevState.stack, prevState.sceneConfig[sceneName]]
        }))
    }
    
    render() {
        <View style={styles.container}>
            {this.state.stack.map((scene, index) => {
                const CurrentScene = scene.component;
                return (
                    <CurrentScene 
                        key={scene.index}
                        navigator={{ push: this.handlePush, pop: this.handlePop }}
                    />
                );
            })}
        </View>
    }
}

Navigator.propTypes = {
    children: arrayOf(object)
}