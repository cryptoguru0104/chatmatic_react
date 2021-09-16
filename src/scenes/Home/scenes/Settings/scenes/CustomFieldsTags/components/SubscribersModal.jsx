import React, { Component } from 'react';
import { Table, Modal, Image } from 'semantic-ui-react';
import LazyLoad from 'react-lazy-load';

import subscriberImg from 'assets/images/subscriber.png';

export default class SubscribersModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { open, close, subscribers } = this.props;
    console.log('subscribers', subscribers);
    return (
      <Modal
        closeIcon
        onClose={close}
        className="subscribers-modal"
        // onOpen={() => setOpen(true)}
        dimmer="blurring"
        open={open}
        size="small"
      >
        <Modal.Header>Subscribers List</Modal.Header>
        <Modal.Content image>
          <Table singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Profile Picture</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {subscribers && subscribers.map(s => (
                <Table.Row>
                  <Table.Cell>
                    <LazyLoad height={35} width={51} offset={700}>
                      <Image
                        src={s.profilePicUrl || subscriberImg}
                        alt=""
                        className="mr-3 subscriber-photo"
                        circular
                      />
                    </LazyLoad>
                  </Table.Cell>
                  <Table.Cell>{s.names}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Modal.Content>
      </Modal>
    )
  }
} 