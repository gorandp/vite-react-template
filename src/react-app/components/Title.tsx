import React from "react";

interface Props {
    content: string;
}

export default class Title extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    };

    render() {
        return (
            <title>{this.props.content}</title>
        );
    };
}
