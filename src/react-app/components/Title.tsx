import React from "react";

export default class Title extends React.Component {
    constructor(props: { content: string }) {
        super(props);
    };

    render() {
        return (
            <title>{this.props.content}</title>
        );
    };
}
