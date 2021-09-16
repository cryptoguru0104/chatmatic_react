import React, { useEffect, useState } from "react";
import { Accordion, Menu, Icon, List, Divider, Card } from "semantic-ui-react";
import { getAppSumoInfo } from "scenes/Home/scenes/Settings/scenes/Billing/services/api";
import { licenseTierList } from "scenes/Appsumo/Login/index";
import "scenes/Appsumo/Login/style.scss";

const AppSumoLicenseInfo = () => {
    const [activeStatus, setActiveStatus] = useState([0, 0]);
    const [planInfo, setPlanInfo] = useState({});
    const [tier, setTier] = useState(undefined);

    useEffect(() => {
        const getInfo = async () => {
            try {
                const res = await getAppSumoInfo();
                console.log("info back", res.data);
                setPlanInfo(res.data);
            } catch (err) {
                console.log("err", err);
            }
        };
        getInfo();
    }, []);

    useEffect(() => {
        !!planInfo &&
            !!planInfo.plan_id &&
            console.log(planInfo.plan_id, licenseTierList);
        !!planInfo &&
            !!planInfo.plan_id &&
            setTier(licenseTierList[planInfo.plan_id]);
    }, [planInfo]);

    const handleAccordionChange = (e, options) => {
        const { index } = options;
        setActiveStatus(activeStatus => [
            ...activeStatus.map((a, i) => (i == index ? (a ? 0 : 1) : a))
        ]);
    };

    return (
        <div className=" appsumo-scene">
            <div className="appsumo-login">
                <div className="left-panel">
                    <h1 className="scene-title">Chatmatic plan</h1>
                    <Divider />
                    <h1 className="category">Plans and Features</h1>
                    <Accordion>
                        <Menu.Item>
                            <Accordion.Title
                                active={activeStatus[0] === 0}
                                index={0}
                                onClick={handleAccordionChange}
                            >
                                Deal Terms
                                <Icon
                                    name={
                                        "angle " +
                                        (activeStatus[0] === 0
                                            ? "down"
                                            : "right")
                                    }
                                />
                            </Accordion.Title>
                            <Accordion.Content active={activeStatus[0] === 0}>
                                <List className="plan-features">
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>
                                            Lifetime access to Chatmatic
                                            Unlimited Subscriber Plan
                                        </p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>
                                            No codes, no staking - just choose
                                            the plan that's right for you
                                        </p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>
                                            You must activate your license
                                            within 60 days of purchase
                                        </p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>
                                            All future Unlimited Subscriber Plan
                                            updates
                                        </p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>
                                            Ability to upgrade/downgrade between
                                            5 license tiers
                                        </p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>GDPR compliant</p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>
                                            60-day money-back guarantee, no
                                            matter the reason
                                        </p>
                                    </List.Item>
                                </List>
                            </Accordion.Content>
                        </Menu.Item>
                        <Menu.Item>
                            <Accordion.Title
                                active={activeStatus[1] === 0}
                                index={1}
                                onClick={handleAccordionChange}
                            >
                                Features included in All Plans
                                <Icon
                                    name={
                                        "angle " +
                                        (activeStatus[1] === 0
                                            ? "down"
                                            : "right")
                                    }
                                />
                            </Accordion.Title>
                            <Accordion.Content active={activeStatus[1] === 0}>
                                <List className="plan-features">
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>
                                            Unlimited users (must log in through
                                            Facebook)
                                        </p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>Unlimited subscribers</p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>Unlimited campaigns</p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>
                                            Full messenger automation capability
                                        </p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>
                                            Lead generation/ nurturing
                                            functionality
                                        </p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>Drag and drop campaign builder</p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>
                                            Quickly create m. me links, chat
                                            widgets, messenger buttons, post
                                            comment entry points, welcome
                                            messages, auto-responses
                                        </p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>
                                            Zapier app and Webhook integrations
                                        </p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>
                                            Email and phone number
                                            pre-population
                                        </p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>
                                            Tag and user attributes allow users
                                            to save data about subscribers
                                        </p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>Messenger broadcasting</p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>
                                            SMS capabilities built into drag and
                                            drop builder
                                        </p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>Live chat with subscribers</p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>
                                            Messenger persistent menu
                                            customization
                                        </p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>
                                            Build, sell, and transfer workflows
                                            as templates
                                        </p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>
                                            Built-in messenger sequence
                                            marketplace
                                        </p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>SMS broadcasting</p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>
                                            Shopify integration with sales
                                            tracking and automated card and
                                            carousel creation
                                        </p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>
                                            Email integrations directly from
                                            chatmatic (allowing users to
                                            integrate with their autoresponders)
                                        </p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>
                                            Enhanced statistics for deeper
                                            knowledge of what's taking place in
                                            your sequence to better optimize
                                        </p>
                                    </List.Item>
                                </List>
                            </Accordion.Content>
                        </Menu.Item>
                    </Accordion>
                </div>
                {!!tier && (
                    <div className="right-panel">
                        <Card className="tier-card">
                            <Card.Content
                                className="tier-name"
                                header={tier.name}
                            />
                            <Card.Content className="price-content">
                                <span className="description">
                                    One time Purchase of
                                </span>
                                <span className="price">${tier.price}</span>
                            </Card.Content>
                            <Card.Content className="feature-content">
                                <List className="plan-features">
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>All features above included</p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>
                                            {tier.fanCount} fan/Facebook pages
                                        </p>
                                    </List.Item>
                                    <List.Item>
                                        <Icon name="check" />
                                        <p>{tier.templateCount} templates</p>
                                    </List.Item>
                                </List>
                            </Card.Content>
                            <Card.Content className="feature-content">
                                <List className="plan-features">
                                    <List.Item>
                                        <p>
                                            <b>{planInfo.used_licenses}</b>{" "}
                                            License(s) Used
                                        </p>
                                    </List.Item>
                                    <List.Item>
                                        <p>
                                            <b>{planInfo.cloned_templates}</b>{" "}
                                            Cloned Template(s)
                                        </p>
                                    </List.Item>
                                </List>
                            </Card.Content>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppSumoLicenseInfo;
