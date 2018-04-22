'use strict';

export default class GraphDefaults {
    static nodeTemplate() {
        return {
            size: 150,
            color: "#f3ffc2",
            shape: 'box',
            font: {
                face: 'monospace',
                align: 'left'
            }
        }
    };

    static edgeTemplate() {
        return {
            font: {align: 'top', multi: 'html'},
            arrows: 'to',
            physics: false,
            smooth: {
                'type': 'curvedCW',
            }
        }
    };

    static graphOptions() {
        const options = {
            physics: {
                enabled: false
            },
            layout: {
                improvedLayout: true,
                hierarchical: {
                    enabled: false,
                    direction: 'UD',
                    edgeMinimization: true,
                    levelSeparation: 300,
                    nodeSpacing: 400,
                    treeSpacing: 200,
                }
            },
            interaction: {
                hover: true,
                multiselect: true,
                selectConnectedEdges: true,
                hoverConnectedEdges: true,
                zoomView: true,
                tooltipDelay: 300
            },
            edges: {
                smooth: true,
                color: "#000000"
            },
            configure: {
                showButton: false
            }
        }
        options.configure.filter = (option, path) => {
            if (path.indexOf('layout') !== -1) {
                if (
                    (path.length == 1)
                    || (option == 'enabled')
                    || (option == 'levelSeparation')
                    || (option == 'treeSpacing')
                    || (option == 'nodeSpacing')
                    || (option == 'direction')
                    || (option == 'sortMethod')

                ) {
                    return true;
                } else {
                    return false;
                }
            }
            return false;
        }
        return options;
    };
}
