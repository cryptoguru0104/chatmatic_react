import tinycolor from "tinycolor2";

const primary = "#3350EE";
const secondary = "#FF5C93";
const warning = "#FFC260";
const success = "#3CD4A0";
const info = "#9013FE";

const titleColor = "#15205B";

const lightenRate = 7.5;
const darkenRate = 15;

export default {
    palette: {
        primary: {
            main: primary,
            light: tinycolor(primary)
                .lighten(lightenRate)
                .toHexString(),
            dark: tinycolor(primary)
                .darken(darkenRate)
                .toHexString()
        },
        secondary: {
            main: titleColor,
            light: primary,
            dark: titleColor,
            contrastText: "#fff"
        },
        warning: {
            main: warning,
            light: tinycolor(warning)
                .lighten(lightenRate)
                .toHexString(),
            dark: tinycolor(warning)
                .darken(darkenRate)
                .toHexString()
        },
        success: {
            main: success,
            light: tinycolor(success)
                .lighten(lightenRate)
                .toHexString(),
            dark: tinycolor(success)
                .darken(darkenRate)
                .toHexString()
        },
        info: {
            main: info,
            light: tinycolor(info)
                .lighten(lightenRate)
                .toHexString(),
            dark: tinycolor(info)
                .darken(darkenRate)
                .toHexString()
        },
        inherit: {
            main: "inherit",
            light: tinycolor("inherit")
                .lighten("inherit")
                .toHexString(),
            dark: tinycolor("inherit")
                .darken("inherit")
                .toHexString()
        },
        text: {
            primary: "#4A4A4A",
            secondary: "#6E6E6E",
            hint: "#B9B9B9"
        },
        background: {
            default: "#F6F7FF",
            light: "#F3F5FF"
        }
    },
    typography: {
        fontFamily: "DM Sans",
        htmlFontSize: 16,
        fontSize: 14,
        h1: {
            fontSize: "24px",
            color: "#15205B",
            fontWeight: 500
        },
        h2: {
            fontSize: "22px",
            color: "#15205B",
            fontWeight: 500
        },
        h3: {
            fontSize: "18px",
            color: "#15205B",
            fontWeight: 500
        },
        h4: {
            fontSize: "17px",
            color: "#15205B",
            fontWeight: 500
        },
        h5: {
            fontSize: "20px",
            color: "#15205B",
            fontWeight: 500
        },
        h6: {
            fontSize: "1.142rem"
        },
        body: {
            color: "#6b6f87"
        }
    },
    customShadows: {
        widget:
            "0px 4px 24px rgba(0, 0, 0, 0.02);",
        widgetDark:
            "0px 3px 18px 0px #4558A3B3, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A",
        widgetWide:
            "0px 12px 33px 0px #E8EAFC, 0 3px 3px -2px #B2B2B21A, 0 1px 8px 0 #9A9A9A1A"
    }
};
