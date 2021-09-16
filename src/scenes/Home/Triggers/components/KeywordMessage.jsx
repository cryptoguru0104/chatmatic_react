import React, { Component, Fragment } from 'react';
import { Form, Input } from 'semantic-ui-react';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';

export default class Buttons extends Component {
    constructor(props) {
        super(props);
        let options = {
            keywords: [],
            keywordsOption: 'contains_any'
        };

        if (props.defaultOptions) {
            options = {
                ...options,
                ...props.defaultOptions
            };
        }

        this.state = {
            options
        };
    }

    componentDidMount = () => {
        this.updateOptions();
    };

    updateOptions = () => {
        const { options } = this.state;
        console.log('options', options);
        this.props.updateOptions(options);
    };

    handleKeywordsOption = keywordsOption => {
        this.setState(
            ({ options }) => ({
                options: { ...options, keywordsOption }
            }),
            () => this.updateOptions()
        );
    };

    handleKeywordChange = keywords => {
        this.setState(
            ({ options }) => ({
                options: { ...options, keywords }
            }),
            () => this.updateOptions()
        );
    };

    render() {
        const {
            options: { keywordsOption, keywords }
        } = this.state;
        return (
            <Fragment>
                {/* <h3 className="heading">Keyword Message</h3> */}

                <Form.Field className="keywordMessage">
                    <label className="no-padding">
                        Keywords <i>(press enter to add next)</i>
                    </label>
                    {/* <Input placeholder="Enter Keywords" type="text" /> */}
                    <TagsInput
                        value={keywords}
                        onChange={this.handleKeywordChange}
                    />

                    <Form.Group inline className="mt-4">
                        <Form.Radio
                            label="Contains Any This option would trigger your response if ANY of the words you list here are contained in the users message. You can list multiple words and if any of them appear in a message to your page, we will send the response you set.Individual words only"
                            value="contains_any"
                            checked={keywordsOption === 'contains_any'}
                            onChange={(e, { value }) =>
                                this.handleKeywordsOption(value)
                            }
                        />
                    </Form.Group>
                    <Form.Group inline>
                        <Form.Radio
                            label='Contains All This option would trigger your response if ALL of the words or phrases you list here are used. If you list "Hello" and "There"... your response will only be sent if the message sent to your page contains both "Hello" and "There". If someone types "Hello" nothing would be sent if you select this option.Individual words only'
                            value="contains_all"
                            checked={keywordsOption === 'contains_all'}
                            onChange={(e, { value }) =>
                                this.handleKeywordsOption(value)
                            }
                        />
                    </Form.Group>
                    <Form.Group inline>
                        <Form.Radio
                            label='Exact Match If you select this option your user will only receive a response if they type EXACTLY what you enter above. Capital letters do not matter, but if they word or phrase is sent to you exactly as you have it above, your response will send. If you use the phrase "Hello There" and someone types "Hello there Sam" your response will not send.'
                            value="exact_match"
                            checked={keywordsOption === 'exact_match'}
                            onChange={(e, { value }) =>
                                this.handleKeywordsOption(value)
                            }
                        />
                    </Form.Group>
                </Form.Field>
            </Fragment>
        );
    }
}
