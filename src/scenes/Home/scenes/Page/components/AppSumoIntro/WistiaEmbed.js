import React, { PropTypes } from "react";

const insertScriptHead = ({ name, src }) => {
    if (!document.querySelector(`#${name}`)) {
        const container = document.head || document.querySelector("head");
        const scriptElement = document.createElement("script");
        scriptElement.setAttribute("id", name);
        scriptElement.async = true;
        scriptElement.src = src;
        container.appendChild(scriptElement);
    }
};

const wistiaScriptsHandler = embedId => {
    const requiredScripts = [
        {
            name: "wistia-script",
            src: "https://fast.wistia.com/assets/external/E-v1.js"
        }
    ];
    requiredScripts.forEach(v =>
        insertScriptHead({
            name: v.name,
            src: v.src
        })
    );
};

class WistiaEmbed extends React.Component {
    constructor(props) {
        super(props);
        window._wq = window._wq || [];
        window._wq.push({
            id: this.props.embedId,
            onReady: video => {
                this.handle = video;
            }
        });
    }

    componentDidMount() {
        wistiaScriptsHandler(this.props.embedId, this.wrapper);
    }

    componentWillUnmount() {
        this.handle && this.handle.remove();
    }

    createWistiaEmbed(embedId) {
        return {
            __html: `<div class='wistia_responsive_padding'
            style="padding: 56.25% 0 0 0; position: relative;">
          <div class='wistia_responsive_wrapper'
            style="height: 100%; left: 0; position: absolute; top: 0; width: 100%;">
            <div class='wistia_embed wistia_async_${embedId} videoFoam=true autoPlay=true'
              style="height: 100%; width: 100%;">&nbsp;</div>
          </div>
        </div>`
        };
    }

    render() {
        return (
            <div>
                <div
                    className="wistia_responsive_padding"
                    style={{ padding: "56.25% 0 0 0", position: "relative" }}
                >
                    <div
                        className="wistia_responsive_wrapper"
                        style={{
                            height: "100%",
                            left: "0",
                            position: "absolute",
                            top: "0",
                            width: "100%"
                        }}
                    >
                        <div
                            className={`wistia_embed wistia_async_${this.props.embedId} videoFoam=true autoPlay=true`}
                            style={{ width: "100%", height: "100%" }}
                        >
                            &nbsp;
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // render() {
    //   return (
    //     <div
    //       ref={el => (this.wrapper = el)}
    //       dangerouslySetInnerHTML={this.createWistiaEmbed(this.props.embedId)} />
    //   )
    // }
}

export default WistiaEmbed;
