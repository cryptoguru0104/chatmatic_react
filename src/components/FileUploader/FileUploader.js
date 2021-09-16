import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { toastr } from 'react-redux-toastr';
import { Line } from 'rc-progress';
import ImageLoader from 'react-loading-image';

import { Button } from 'components';

const fileMaxSize = 26214400; //25mb limit

const fileContentStyle = {
    objectFit: 'cover',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18
};

class FileUploader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            file: props.file,
            fileUploadPercent: null,
            stepUid: null,
            itemIndex: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleOnDrop = this.handleOnDrop.bind(this);
        this.handleClearToDefault = this.handleClearToDefault.bind(this);
    }

    componentWillMount() {
        window.addEventListener('fileUpload', event => {
            if (
                this.props.stepUid === event.detail.stepUid &&
                this.props.itemIndex === event.detail.itemIndex
            ) {
                if (event.detail.percent < 100) {
                    this.setState({
                        fileUploadPercent: event.detail.percent,
                        stepUid: event.detail.stepUid,
                        itemIndex: event.detail.itemIndex
                    });
                } else {
                    setTimeout(() => {
                        this.setState({
                            fileUploadPercent: null,
                            stepUid: null,
                            itemIndex: null
                        });
                    }, 1500);
                }
            }
        });
    }

    componentWillUnmount() {
        window.removeEventListener('fileUpload', {});
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.file !== this.props.file) {
            this.setState({ file: nextProps.file });
        }
    }

    /**
     * Called when <input> changed
     * @param event
     */
    handleChange(event) {
        this.setState({
            file: URL.createObjectURL(event.target.files[0])
        });
    }

    /**
     * Very files before upload
     *
     * @param files
     */
    verifyFile(files) {
        const acceptedFileTypesArray =
            this.props.type === 'image'
                ? [
                      'image/x-png',
                      'image/png',
                      'image/jpeg',
                      'image/jpg',
                      'image/gif'
                  ]
                : this.props.type === 'audio'
                ? [
                      'audio/wav',
                      'audio/mp3',
                      'audio/mpeg',
                      'audio/mp4',
                      'audio/wma'
                  ]
                : [
                      'video/avi',
                      'video/flv',
                      'video/wmv',
                      'video/mov',
                      'video/mp4',
                      'video/quicktime'
                  ];

        if (files && files.length > 0) {
            const currentFile = files[0];
            const currentFileType = currentFile.type;
            const currentFileSize = currentFile.size;

            if (currentFileSize > fileMaxSize) {
                toastr.error(
                    'Error',
                    `This file is not allowed. ${currentFileSize} bytes is too large`
                );
                return false;
            }
            if (!acceptedFileTypesArray.includes(currentFileType)) {
                toastr.error(
                    'Error',
                    `This file of type '${currentFileType}' is not allowed. Only ${this.props.type}s are allowed`
                );
                return false;
            }

            return true;
        }
    }

    getBase64 = file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    /**
     * handle OnDrop of Dropzone component
     * @param files
     * @param rejectedFiles
     */
    handleOnDrop(files, rejectedFiles) {
        if (rejectedFiles && rejectedFiles.length > 0) {
            this.verifyFile(rejectedFiles);
        }

        if (files && files.length > 0) {
            const isVerified = this.verifyFile(files);
            if (isVerified) {
                // fileBase64Data
                const url = URL.createObjectURL(files[0]);

                this.setState({
                    file: url
                });

                // Call handleOnLoad props function (ex: to fire reducer functions in parent components that use this component)
                if (this.props.handleOnLoad) {
                    this.getBase64(files[0]).then(data => {
                        this.props.handleOnLoad(data);
                    });
                }
            }
        }
    }

    /**
     * Reset to default
     * @param event
     */
    handleClearToDefault(event) {
        if (event) event.preventDefault();
        this.setState({
            file: null
        });

        // Call handleClearToDefault prop function if function provided
        if (this.props.handleClearToDefault) {
            this.props.handleClearToDefault();
        }
    }

    render() {
        let style = this.props.style;

        const resetBtnStyle = {
            position: 'absolute',
            right: '-1.0rem',
            top: '-0.5rem'
        };

        const acceptedFileTypes =
            this.props.type === 'image'
                ? 'image/*'
                : this.props.type === 'audio'
                ? 'audio/*'
                : 'video/*';

        const renderContent = () => {
            if (
                this.props.stepUid === this.state.stepUid &&
                this.props.itemIndex === this.state.itemIndex &&
                !!this.state.fileUploadPercent
            ) {
                return (
                    <div className="d-flex flex-column px-5 h-100 justify-content-center align-items-center">
                        <h5 className="mt-2 text-center">
                            {this.state.fileUploadPercent}%
                        </h5>
                        <Line
                            percent={this.state.fileUploadPercent}
                            strokeWidth={2}
                            strokeColor="blue"
                        />
                    </div>
                );
            }
            if (!!this.state.file) {
                if (this.props.type === 'image') {
                    return (
                        <ImageLoader
                            src={this.state.file}
                            className="w-100 h-100"
                            style={fileContentStyle}
                            loading={() => (
                                <div className="d-flex justify-content-center">
                                    Loading...
                                </div>
                            )}
                            error={() => <div>Error</div>}
                        />
                    );
                } else if (this.props.type === 'video') {
                    return (
                        <video
                            className="w-100"
                            style={fileContentStyle}
                            controls
                            key={this.state.file}
                        >
                            <source src={this.state.file} />
                        </video>
                    );
                } else {
                    return (
                        <audio
                            controls
                            className="w-100 h-100"
                            style={fileContentStyle}
                            key={this.state.file}
                        >
                            <source src={this.state.file} />
                        </audio>
                    );
                }
            } else if (!!this.props.renderContent) {
                return this.props.renderContent;
            } else {
                return (
                    <Button
                        tag="a"
                        color="link"
                        onClick={this.handleClearToDefault}
                        style={resetBtnStyle}
                    >
                        <i className="fa fa-times ml-auto" />
                    </Button>
                );
            }
        };

        return (
            <Dropzone
                onDrop={this.handleOnDrop}
                accept={acceptedFileTypes}
                className={this.props.className}
                style={style}
            >
                {renderContent()}
            </Dropzone>
        );
    }
}

FileUploader.propTypes = {
    handleOnLoad: PropTypes.func,
    handleClearToDefault: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
    file: PropTypes.string,
    renderContent: PropTypes.any,
    type: PropTypes.string,
    stepUid: PropTypes.any,
    itemIndex: PropTypes.any
};

export default FileUploader;
