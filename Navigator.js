import React, { Component } from 'react';
import { arrayOf, object } from 'prop-types';

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

        const sceneConfig = buildSceneConfig(props.children);
        const initialSceneName = props.children[0].props.name;

        this.state = {
            sceneConfig,
            stack: [sceneConfig[initialSceneName]]
        }
    }
    
    render() {
        const CurrentScene = this.state.stack[0].component;
        return <CurrentScene />;
    }
}

Navigator.propTypes = {
    children: arrayOf(object)
}