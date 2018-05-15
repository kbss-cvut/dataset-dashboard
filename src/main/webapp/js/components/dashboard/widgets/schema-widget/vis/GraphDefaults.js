'use strict';

export default class GraphDefaults {
    static nodeTemplate() {
        return {
            size: 150,
            color: {
                background : "#ffffcc",
                border: "#f49842",
                hover : {
                    background: "#ffffcc",
                    border: "#f48241"
                },
                highlight : {
                    background: "#f48241",
                    border: "#f4c741"
                }
            },
            shape: 'box',
            borderWidthSelected : 3,
            labelHighlightBold: false,
            font: {
                face: 'FontAwesome',
                align: 'left',
                multi: 'html'
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
                improvedLayout: false,
                hierarchical: {
                    enabled: true,
                    direction: 'UD',
                    edgeMinimization: true,
                    levelSeparation: 200,
                    nodeSpacing: 200,
                    treeSpacing: 200,
                }
            },
            interaction: {
                hover: true,
                multiselect: true,
                navigationButtons: true,
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
                enabled : true,
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
