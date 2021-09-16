import React,{useState} from 'react'
import YoutubeIcon from "../assets/images/icon-youtube.svg";
import ModalVideo from 'react-modal-video'

export default function VideoCard(props) {
    const [isOpen, setOpen] = useState(false)
    const containerStyle = {
        position: "relative",
        width: "100%",
        paddingTop: "56.25%"
    };
    const textStyle = {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        // backgroundColor: "#ECF0F3",
        borderRadius: 10
    };
    const buttonStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        border: "none",
        cursor: "pointer",
        outline: "none",
        background: "transparent",
    };
    const modalWrapperStyle = {
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0
    }
    const modalContentStyle = {
        width: '100%',
        height: '100%',
        position: 'relative',
        zIndex: 2
    }
    return (
        <div style={containerStyle}>
                <div style={textStyle}>
                    <button style={buttonStyle} onClick={() => setOpen(true)}>
                        <img src={YoutubeIcon} />
                    </button>
                    {/**/}
                    <img className="w-100" style={{objectFit:'cover', height: '100%'}} src={props.coverImage ? props.coverImage : `https://img.youtube.com/vi/${props.videoId}/default.jpg`}/>
                </div>
            
			        <ModalVideo channel='youtube' autoplay isOpen={isOpen} videoId={props.videoId} onClose={() => setOpen(false)} />
        </div>
    );
}
