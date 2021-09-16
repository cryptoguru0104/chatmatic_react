import React, { Component } from 'react';
import $ from 'jquery';
import imagesLoaded from 'imagesloaded';
import _ from 'lodash';

import { Card, SequenceMenu } from './';
import { refresh } from 'aos';

export default class DragBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            element: null,
            data: this.props.data,
            trnsXMove: 0,
            trnsYMove: 0,
            scale: this.props.scale,
            isCardActionStep: false,
            id: null
        };
        this.trnsXMove = 0;
        this.trnsYMove = 0;
        this.pos1 = 0;
        this.pos2 = 0;
        this.isFindScale = true;
        this.closedBuilder = false;
    }

    componentDidMount = () => {
        this.handleAutoSave();
        this.loadImages();
        this.resetSvgSize();
        this.setBoradHeightWidthScale();
    };

    UNSAFE_componentWillReceiveProps = nextProps => {
        const { newItem, scale, autoArrange, data, isRefresh } = nextProps;
        const {
            newItem: addItemToWorkFlow,
            scale: oldScale,
            autoArrange: oldAutoArrange,
            data: oldData
        } = this.props;
        if (addItemToWorkFlow !== newItem) {
            this.handleNewItem(newItem);
        }
        if (scale !== oldScale) {
            this.setBoradHeightWidth(scale);
            // this.handleBoardScale(scale);
        }
        if (autoArrange && autoArrange !== oldAutoArrange) {
            this.setState({ data }, () => this.handleAutoArrange());
        }
        if (data !== oldData && !autoArrange) {
            this.setState({ data }, () => {
                this.createSvgs();
                this.loadImages();
            });
        }
        if (isRefresh) {
            this.props.refresh();
        }
    };

    loadImages = () => {
        const self = this;
        imagesLoaded(document.querySelector('#drag-borad'), function (instance) {
            if (document.querySelector('#drag-borad')) {
                if (!self.props.hasPosition) {
                    self.props.handleAutoArrange();
                } else {
                    self.createSvgs();
                }
                self.resetSvgSize()
            }
        });
    };

    //#region handle board height width scale
    setBoradHeightWidthScale = () => {
        const { height, width, maxTopId, minLeft, minTop, scale: blockScale } = this.getBoradHeightWidthScale();
        const heightElement = document.getElementById(maxTopId);
        if (heightElement) {
            const scale = blockScale < 1 ? blockScale : 1;
            const { offsetHeight, offsetWidth } = document.getElementById('drag-block');
            const trnsXMove = 0 - (Math.round((width / 2) - ((width / 2) * scale)) + Math.round(minLeft * scale)) + 50 + Math.round((offsetWidth - (width * scale)) / 2);
            const trnsYMove = 0 - (Math.round((height / 2) - ((height / 2) * scale)) + Math.round(minTop * scale)) + 50 + Math.round((offsetHeight - (height * scale)) / 2);
            this.setState({ trnsXMove, trnsYMove, scale }, () => {
                this.props.findAndSetScale(scale);
            });
        }
    };

    setBoradHeightWidth = (scale) => {
        const { height, width, maxTopId, minLeft, minTop, scale: blockScale } = this.getBoradHeightWidthScale();
        const heightElement = document.getElementById(maxTopId);
        if (heightElement) {
            const { offsetHeight, offsetWidth } = document.getElementById('drag-block');
            this.setState({ scale }, () => {
                this.handleBoardScale(scale, height, width);
            });
        }
    };

    getBoradHeightWidthScale = () => {
        const { data } = this.state;
        const leftData = _.sortBy(data, [o => o.left]);
        const topData = _.sortBy(data, [o => o.top]);

        let minLeft = leftData[0].left;
        let maxLeft = leftData[leftData.length - 1].left;
        let maxLeftId = leftData[leftData.length - 1].id;
        let minTop = topData[0].top;
        let maxTop = 0;
        let maxTopId = 0;

        data.map(s => {
            const top = document.getElementById(s.id).offsetHeight + s.top;
            if (top > maxTop) {
                maxTop = top;
                maxTopId = s.id;
            }
        });
        const heightElement = document.getElementById(maxTopId);
        const dragBlock = document.getElementById('drag-block');
        if (heightElement) {
            const maxHeight = (maxTop + (minTop < 0 ? Math.abs(minTop) : 0)) + 50;
            let maxWidth =
                heightElement.offsetWidth +
                maxLeft +
                (minLeft < 0 ? Math.abs(minLeft) : 0);
            if (maxLeftId !== maxTopId) {
                maxWidth =
                    document.getElementById(maxLeftId).offsetWidth +
                    maxLeft +
                    (minLeft < 0 ? Math.abs(minLeft) : 0);
            }
            // add padding of 50 at bottom
            maxWidth += 50;

            // find scale
            const heightScale = Number(
                (dragBlock.offsetHeight / maxHeight).toFixed(4)
            );
            const widthScale = Number(
                (dragBlock.offsetWidth / maxWidth).toFixed(4)
            );
            let scale =
                (widthScale < heightScale ? widthScale : heightScale);
            return ({
                height: maxHeight,
                width: maxWidth,
                scale,
                maxTopId,
                minLeft,
                minTop
            });
        }
        return ({});
    };
    //#endregion

    handleBoardScale = (scale, height = null, width = null) => {
        const { trnsXMove, trnsYMove } = this.state;
        const board = document.getElementById('drag-borad');
        board.style.transition = 'all .5s linear';
        if (height) {
            // board.style.border = '1px solid #000';
            board.style.height = `${height}px`;
            board.style.width = `${width}px`;
        }
        board.style.transform = `translate(${trnsXMove}px, ${trnsYMove}px) scale(${scale})`;
        setTimeout(() => {
            board.style.transition = 'none';
        }, 550);
        this.setState({
            scale
        });
    };

    handleNewItem = newItem => {
        const { data } = this.state;
        data.push(newItem);
        const id = newItem.parents[0];
        // console.log('parentId =>', id);
        let elementId = id;
        let isBtn = false;
        if (id.includes('btn')) {
            const idArr = id.split('_');
            elementId = idArr[idArr.length - 1];
            isBtn = true;
        }
        if (isBtn) {
            const index = data.findIndex(d => elementId === d.id);
            const parentItem = data[index];
            const item = { actionId: id, child: newItem.id };
            if (parentItem.actions && parentItem.actions.length) {
                const ind = parentItem.actions.findIndex(
                    a => a.actionId === id
                );
                if (ind !== -1) {
                    parentItem.actions[ind].child = newItem.id;
                } else {
                    parentItem.actions.push(item);
                }
            } else {
                parentItem['actions'] = [item];
            }
            data[index] = parentItem;
        } else {
            const index = data.findIndex(d => elementId === d.id);
            const parentItem = data[index];
            parentItem.children.push(newItem.id);
            parentItem.hasChild = true;
            data[index] = parentItem;
        }

        this.setState(
            {
                data
            },
            () => {
                this.createSvgs();
            }
        );
    };

    createSvgs = () => {
        const { data } = this.state;
        data.forEach(d => {
            this.handleSvgDrag(d.id);
        });
    };

    //#region handle translate move
    handleTranslate = e => {
        e.stopPropagation();
        const trnsX = e.clientX;
        const trnsY = e.clientY;
        this.setState({
            trnsX,
            trnsY
        });
        document.addEventListener('mousemove', this.handleTranslateDrag);
        document.addEventListener('mouseup', this.handleTranslateEnd);
        this.closedBuilder = false;
    };

    handleTranslateDrag = e => {
        let { trnsX, trnsY, trnsXMove: X, trnsYMove: Y, scale } = this.state;
        let trnsXMove = e.clientX - trnsX + X;
        let trnsYMove = e.clientY - trnsY + Y;
        const board = document.getElementById('drag-borad');
        board.style.transform = `translate(${trnsXMove}px, ${trnsYMove}px) scale(${scale})`;
        this.trnsXMove = trnsXMove;
        this.trnsYMove = trnsYMove;
        if (!this.closedBuilder) {
            this.closedBuilder = true;
            this.props.updateEngageInfo({
                showBuilderAsideMenu: false
            });
        }
    };

    handleTranslateEnd = e => {
        document.removeEventListener('mousemove', this.handleTranslateDrag);
        document.removeEventListener('mouseup', this.handleTranslateEnd);
        this.setState({
            trnsXMove: this.trnsXMove,
            trnsYMove: this.trnsYMove
        });
    };
    //#endregion

    //#region handle drag object
    handleMouseDown = (e, id) => {
        e.stopPropagation();
        if (this.props.stats) {
            return false;
        }
        const element = document.getElementById(id);
        e = e || window.event;
        const pos3 = e.clientX;
        const pos4 = e.clientY;
        this.setState({
            pos3,
            pos4,
            element
        });
        this.pos1 = pos3;
        this.pos2 = pos4;
        this.onMouseDownOn = Date.now();
        document.addEventListener('mousemove', this.handleDragDiv);
        document.addEventListener('mouseup', this.handleDragEnd);
        this.closedBuilder = false;
        // element.style.cursor = 'grabbing';
    };

    // handleClick = (e, id) => {
    //     this.props.updateEngageInfo({
    //         activeStep: id,
    //         showBuilderAsideMenu: true
    //     });
    // };

    handleDragDiv = e => {
        e = e || window.event;
        e.preventDefault();
        let { pos3, pos4, element, scale } = this.state;
        let pos1 = pos3 - e.clientX;
        let pos2 = pos4 - e.clientY;
        pos1 /= scale;
        pos2 /= scale;
        pos3 = e.clientX;
        pos4 = e.clientY;
        this.setState({ pos3, pos4 });
        element.style.top = `${element.offsetTop - pos2}px`;
        element.style.left = `${element.offsetLeft - pos1}px`;
        this.handleSvgDrag(element.id);
        if (!this.closedBuilder) {
            this.closedBuilder = true;
            this.props.updateEngageInfo({
                // activeStep: "",
                showBuilderAsideMenu: false
            });
        }
    };

    handleDragEnd = e => {
        const { element, data } = this.state;
        // const el = data.find(s => s.id == element.id);
        if (
            this.onMouseDownOn &&
            Date.now() - this.onMouseDownOn < 300
            // && el.stepType !== 'delay'
        ) {
            this.props.updateEngageInfo({
                activeStep: element.id,
                showBuilderAsideMenu: true
            });
        }
        // element.style.cursor = 'grab';
        document.removeEventListener('mousemove', this.handleDragDiv);
        document.removeEventListener('mouseup', this.handleDragEnd);
        this.updateElementPosition();
        // setTimeout(() => this.resetSvgSize(), 500)
        this.resetSvgSize()
    };
    //#endregion

    resetSvgSize = () => {
        // console.log('resetSvgSize')
        const classList = document.querySelectorAll('.mysvg');
        classList.forEach((a, i) => {
            // console.log('a =>', a.id);
            a.style.height = '50px';
            a.style.width = '50px';
        });
    }

    updateElementPosition = () => {
        const { element } = this.state;
        const { data } = this.state;
        const elementIndex = data.findIndex(d => d.id === element.id);
        if (elementIndex !== -1) {
            const top = element.offsetTop;
            const left = element.offsetLeft;
            data[elementIndex] = { ...data[elementIndex], top, left };
            this.setState({ data });
        }
    };

    //#region draw svg
    handleSvgDrag = elementId => {
        const { data } = this.state;
        const element = document.getElementById(elementId);
        const elementData = data.find(d => d.id === elementId);
        // console.log('209 => elementId', elementId);
        // console.log('210 => element', element);
        const parentIds =
            elementData.parents && elementData.parents.length
                ? elementData.parents
                : [];
        const actions = elementData.actions ? elementData.actions : [];
        parentIds.forEach(parentId =>
            this.handleChildSvg(parentId, element.id)
        );
        actions.forEach(action => {
            if (action.child) {
                this.handleChildSvg(action.actionId, action.child);
            }
        });
        const childrenIds =
            elementData.children && elementData.children.length
                ? elementData.children
                : [];
        childrenIds.forEach(childId =>
            this.handleChildSvg(element.id, childId)
        );
    };

    handleChildSvg = (id, childId) => {
        let elementId = id;
        let isBtn = false;
        if (id.includes('btn')) {
            const idArr = id.split('_');
            elementId = idArr[idArr.length - 1];
            isBtn = true;
        }
        const svgId = `${id}-${childId}`;
        const element = document.getElementById(elementId);
        const parent = element;
        // console.log('child =>', childId);
        const child = document.getElementById(childId);
        const parentTop = parent.offsetTop;
        const parentLeft = parent.offsetLeft;
        const parentWidth = parent.offsetWidth;
        const parentHeight = parent.offsetHeight;
        const childTop = child.offsetTop;
        const childLeft = child.offsetLeft;
        const childHeight = child.offsetHeight;

        this._drawSVG(
            isBtn,
            parentTop,
            parentLeft,
            parentWidth,
            parentHeight,
            childTop,
            childLeft,
            childHeight,
            svgId,
            id
        );
    };

    _drawSVG = (
        isBtn,
        parentTop,
        parentLeft,
        parentWidth,
        parentHeight,
        childTop,
        childLeft,
        childHeight,
        svgId,
        id
    ) => {
        const svg = document.getElementById(svgId);

        let svgNewTop = parentTop < childTop ? parentTop : childTop;
        let svgNewLeft =
            parentLeft + parentWidth < childLeft
                ? parentLeft + parentWidth - 10
                : childLeft - 10;
        let svgNewHeight =
            parentTop < childTop
                ? childTop - parentTop + childHeight
                : parentTop - childTop + parentHeight;
        let svgNewWidth =
            parentLeft + parentWidth < childLeft
                ? childLeft - parentLeft - parentWidth + 20
                : parentLeft + parentWidth - childLeft + 20;

        if (isBtn && !id.includes('btn-cr')) {
            svgNewLeft =
                parentLeft + parentWidth < childLeft
                    ? svgNewLeft - 30
                    : childLeft - 10;
            svgNewWidth =
                parentLeft + parentWidth < childLeft
                    ? svgNewWidth + 30
                    : svgNewWidth - 30;
        }

        // const offsetHeight = parentTop < childTop ? childHeight : parentHeight;
        let x1 = parentLeft + parentWidth < childLeft ? svgNewWidth - 8 : 10;
        let y1 = parentTop < childTop ? svgNewHeight - childHeight + 50 : 50;

        let x4 = parentLeft + parentWidth < childLeft ? 2 : svgNewWidth - 18;
        let y4 = parentTop < childTop ? 50 : svgNewHeight - parentHeight + 50;

        if (isBtn) {
            // console.log('isBtn', id);
            const btn = document.getElementById(id);
            if (btn) {
                y4 =
                    parentTop < childTop
                        ? btn.offsetTop + (btn.offsetHeight / 2)
                        : svgNewHeight -
                        parentHeight +
                        (btn.offsetTop + (btn.offsetHeight / 2));
                // console.log('btn.offsetHeight', btn.offsetHeight, y4);
            }
        }

        let dx = Math.abs(x4 - x1) * 0.675;

        let x2 = x1 - dx;
        let x3 = x4 + dx;

        // svg.style.border = `1px solid red`;
        svg.style.height = `${svgNewHeight}px`;
        svg.style.width = `${svgNewWidth}px`;
        // svg.style.height = `${10}px`;
        // svg.style.width = `${10}px`;
        svg.style.top = `${svgNewTop}px`;
        svg.style.left = `${svgNewLeft}px`;

        const data = `M${x1} ${y1} C ${x2} ${y1} ${x3} ${y4} ${x4} ${y4}`;
        // console.log('d =>', x1);
        document.getElementById(`path-${svgId}`).setAttribute('d', data);
        document
            .getElementById(`circle-${svgId}`)
            .setAttribute('transform', `matrix(1,0,0,1,${x4 + 5},${y4})`);
        document
            .getElementById(`rect-${svgId}`)
            .setAttribute('transform', `matrix(1,0,0,1,${x1 - 11}, ${y1 - 8})`);
        document
            .getElementById(`circle-2-${svgId}`)
            .setAttribute(
                'transform',
                `matrix(1,0,0,1,${x1 > 20 ? x1 / 2 : (x1 + x4) / 2}, ${y4 +
                (y1 - y4) / 2})`
            );
        document
            .getElementById(`rect-2-${svgId}`)
            .setAttribute(
                'transform',
                `matrix(1,0,0,1,${(x1 > 20 ? x1 / 2 : (x1 + x4) / 2) -
                4}, ${y4 + (y1 - y4) / 2})`
            );
    };

    handleAutoArrange = () => {
        const { data } = this.state;
        const classList = document.querySelectorAll('.trans');
        classList.forEach((a, i) => {
            classList[i].style.transition = 'all .5s linear';
        });

        data.forEach((d, i) => {
            if (d.parents && d.parents.length) {
                d.parents.forEach(parentId =>
                    this.repositionSVG(parentId, d.id)
                );
            }
        });

        setTimeout(() => {
            classList.forEach((a, i) => {
                classList[i].style.transition = 'none';
            });
            this.handleAutoSave();
        }, 500);
    };

    repositionSVG = (id, childId) => {
        const { data } = this.state;
        let elementId = id;
        let isBtn = false;
        if (id.includes('btn')) {
            const idArr = id.split('_');
            elementId = idArr[idArr.length - 1];
            isBtn = true;
        }
        const parentData = data.find(d => d.id === elementId);
        const childData = data.find(d => d.id === childId);
        const svgId = `${id}-${childId}`;
        const element = document.getElementById(elementId);
        const svg = document.getElementById(svgId);
        const parent = element;
        const child = document.getElementById(childId);
        const parentTop = parentData.top;
        const parentLeft = parentData.left;
        const parentWidth = parent.offsetWidth;
        const parentHeight = parent.offsetHeight;
        const childTop = childData.top;
        const childLeft = childData.left;
        const childHeight = child.offsetHeight;

        this._drawSVG(
            isBtn,
            parentTop,
            parentLeft,
            parentWidth,
            parentHeight,
            childTop,
            childLeft,
            childHeight,
            svgId,
            id
        );
    };
    //#endregion

    //#region drag connection & linking
    handleDeleteLink = (id, parentId) => () => {
        const { data } = this.state;
        let elementId = parentId;
        let isBtn = false;
        if (parentId.includes('btn')) {
            const idArr = parentId.split('_');
            elementId = idArr[idArr.length - 1];
            isBtn = true;
        }
        const index = data.findIndex(d => d.id === id);
        data[index].parents = data[index].parents.filter(d => d !== parentId);
        const parentIndex = data.findIndex(d => d.id === elementId);
        if (isBtn) {
            const actions = data[parentIndex].actions;
            data[parentIndex].actions[
                actions.findIndex(a => a.actionId === parentId)
            ].child = null;
        } else {
            data[parentIndex].children = data[parentIndex].children.filter(
                d => d !== id
            );
            data[parentIndex].hasChild = data[index].parents.length > 0;
        }

        this.setState({ data }, () => {
            this.handleAutoSave();
        });
        this.props.updateNextStep(parentId, null);
    };

    handleAddLink = (id, parentId) => {
        const { data } = this.state;
        let elementId = parentId;
        let isBtn = false;
        if (parentId.includes('btn')) {
            const idArr = parentId.split('_');
            elementId = idArr[idArr.length - 1];
            isBtn = true;
        }

        if (isBtn) {
            const parentIndex = data.findIndex(d => d.id === elementId);
            const index = data.findIndex(d => d.id === id);
            data[index].parents = data[index].parents || [];
            data[index].parents = [...data[index].parents, parentId];
            const actionIndex = data[parentIndex].actions
                ? data[parentIndex].actions.findIndex(
                    a => a.actionId === parentId
                )
                : -1;
            if (actionIndex !== -1) {
                data[parentIndex].actions[actionIndex] = {
                    ...data[parentIndex].actions[actionIndex],
                    actionId: parentId,
                    child: id
                };
            } else {
                data[parentIndex].actions = [{ actionId: parentId, child: id }];
            }
        } else {
            const parentIndex = data.findIndex(d => d.id === parentId);
            const index = data.findIndex(d => d.id === id);
            data[index].parents = data[index].parents || [];
            data[index].parents = [...data[index].parents, parentId];
            data[parentIndex].children = [...data[parentIndex].children, id];
            data[parentIndex].hasChild = true;
        }

        this.setState({ data }, () => {
            this.createSvgs();
            this.handleAutoSave();
        });
        this.props.updateNextStep(parentId, id);
    };

    handleDragConn = (e, elementId) => {
        e.stopPropagation();
        const element = document.getElementById(elementId);
        const pos3 = e.clientX;
        const pos4 = e.clientY;
        const menuBlock = document.getElementById('menu-items-block');
        menuBlock.classList.remove('show');
        menuBlock.classList.add('hide');
        this.setState({
            pos3,
            pos4,
            element,
            id: elementId
        });
        document.addEventListener('mousemove', this.handleOnDragConn);
        document.addEventListener('mouseup', this.handleDragConnEnd);
    };

    handleOnDragConn = e => {
        e.preventDefault();
        let { pos3, pos4, id, scale } = this.state;
        let elementId = id;
        let isBtn = false;
        let btn;
        if (id.includes('btn')) {
            const idArr = id.split('_');
            elementId = idArr[idArr.length - 1];
            isBtn = true;
            btn = document.getElementById(id);
        }

        const element = document.getElementById(elementId);

        let moveX = e.clientX - pos3;
        let moveY = e.clientY - pos4;
        moveX /= scale;
        moveY /= scale;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // console.log(moveX, moveY);
        const parentTop = element.offsetTop;
        const parentLeft = element.offsetLeft;
        const parentWidth = element.offsetWidth;

        let svgLeft = parentLeft + parentWidth;
        const svgHeight = moveY > 0 ? moveY : Math.abs(moveY);
        let svgTop =
            moveY > 0 ? parentTop + 50 : parentTop - Math.abs(moveY) + 50;
        // console.log('svgTop =>', svgHeight)

        if (isBtn) {
            svgLeft = svgLeft - 50;
            svgTop =
                moveY > 0
                    ? parentTop + btn.offsetTop + (btn.offsetHeight / 2 + 2)
                    : parentTop -
                    Math.abs(moveY) +
                    btn.offsetTop +
                    (btn.offsetHeight / 2 + 2);
        }

        const dragConn = document.getElementById('my-drag-conn');
        dragConn.style.display = 'block';
        // dragConn.style.border = '1px solid red';
        dragConn.style.position = 'absolute';
        dragConn.style.top = `${svgTop}px`;
        dragConn.style.left = `${svgLeft}px`;
        dragConn.style.width = `${moveX}px`;
        dragConn.style.height = `${svgHeight}px`;

        let x1 = moveX;
        let y1 = moveY > 0 ? moveY : 0;
        let x4 = 2;
        let y4 = moveY > 0 ? 3 : svgHeight + 3;
        let dx = Math.abs(x4 - x1) * 0.675;
        let x2 = x1 - dx;
        let x3 = x4 + dx;

        if (isBtn) {
            // const btn = document.getElementById(id);
            y4 = moveY > 0 ? 0 : svgHeight;
        }
        // console.log('svgHeight =>',y4, svgHeight);
        const d = `M${x1} ${y1} C ${x2} ${y1} ${x3} ${y4} ${x4} ${y4}`;
        document.getElementById(`my-drag-conn-path`).setAttribute('d', d);
        document
            .getElementById('my-drag-conn-rect')
            .setAttribute('transform', `matrix(1,0,0,1,${x1 - 11}, ${y1 - 8})`);
    };

    handleDragConnEnd = e => {
        const { id: eId } = this.state;
        let elementId = eId;
        let isBtn = false;
        let btn;
        if (eId.includes('btn')) {
            const idArr = eId.split('_');
            elementId = idArr[idArr.length - 1];
            isBtn = true;
            btn = document.getElementById(eId);
        }
        const element = document.getElementById(elementId);

        const id =
            $(e.target)
                .closest('.mydiv')
                .attr('id') || null;

        document.removeEventListener('mousemove', this.handleOnDragConn);
        document.removeEventListener('mouseup', this.handleDragConnEnd);
        if (id && id !== elementId) {
            this.handleAddLink(id, eId);
        }
        const dragConn = document.getElementById('my-drag-conn');
        dragConn.style.display = 'none';

        e.preventDefault();
        let { pos3, pos4, scale } = this.state;

        let moveX = e.clientX - pos3;
        let moveY = e.clientY - pos4;
        moveX /= scale;
        moveY /= scale;
        pos3 = e.clientX;
        pos4 = e.clientY;
        const parentTop = element.offsetTop;
        const parentLeft = element.offsetLeft;
        const parentWidth = element.offsetWidth;
        let menuTop = parentTop + moveY;
        let menuLeft = parentLeft + parentWidth + moveX;
        if (isBtn) {
            menuTop += btn.offsetTop;
        }

        if (!id || id === elementId) {
            const menu = document.getElementById('menu-new-item');
            const menuBlock = document.getElementById('menu-items-block');
            menuBlock.classList.remove('hide');
            menuBlock.classList.add('show');
            menu.style.top = `${menuTop - 120}px`;
            menu.style.left = `${menuLeft + 100}px`;
        }
    };

    handleAutoSave = () => {
        this.props.handleAutoSave(this.state.data);
        const menuBlock = document.getElementById('menu-items-block');
        menuBlock.classList.remove('show');
        menuBlock.classList.add('hide');
    };

    handleDelete = id => {
        this.props.deleteStep(id);
    };
    //#endregion

    handleChildBtnClick = (e, btnId, elementId) => {
        e.stopPropagation();
        const element = document.getElementById(elementId);
        const pos3 = e.clientX;
        const pos4 = e.clientY;
        const menuBlock = document.getElementById('menu-items-block');
        menuBlock.classList.remove('show');
        menuBlock.classList.add('hide');
        this.setState({
            pos3,
            pos4,
            element,
            id: btnId
        });
        this.setupSequenceMenu(false);
        document.addEventListener('mousemove', this.handleOnDragConn);
        document.addEventListener('mouseup', this.handleDragConnEnd);
    };

    closeMenu = () => {
        const menuBlock = document.getElementById('menu-items-block');
        menuBlock.classList.remove('show');
        menuBlock.classList.add('hide');
    };

    //#region Steps Functionality
    onStepAdded = nextStepUid => {
        this.props.updateNextStep(this.state.id, nextStepUid);
    };
    setupSequenceMenu = (isCardActionStep = false) => {
        this.setState({ isCardActionStep });
    };
    //#endregion

    render() {
        const { id } = this.state;
        const { data } = this.props;
        const jsx = [];
        const svgJsx = [];
        if (data && data.length) {
            data.forEach((d, i) => {
                jsx.push(
                    <Card
                        key={i}
                        data={d}
                        handleResize={() => alert(d.id)}
                        isPrimary={i === 0}
                        // handleClick={e => this.handleClick(e, d.id)}
                        handleMouseDown={e => this.handleMouseDown(e, d.id)}
                        handleDragConn={(e, isCardActionStep = false) => {
                            this.handleDragConn(e, d.id);
                            this.setupSequenceMenu(isCardActionStep);
                        }}
                        handleDelete={() => this.handleDelete(d.id)}
                        handleChildBtnClick={this.handleChildBtnClick}
                        // hasChild={d.hasChild}
                        // isEmpty={d.isEmpty}
                        style={{
                            top: d.top,
                            left: d.left
                        }}
                    />
                );
                if (d.parents && d.parents.length) {
                    d.parents.forEach(parentId => {
                        const svgId = `${parentId}-${d.id}`;
                        svgJsx.push(
                            <div key={svgId} className="mysvg trans" id={svgId}>
                                <svg className="trans">
                                    <path
                                        id={`path-${svgId}`}
                                        className="path trans"
                                        d=""
                                    />
                                    <circle
                                        id={`circle-${svgId}`}
                                        className="handle trans"
                                        cx="0"
                                        cy="0"
                                        r="8"
                                        transform=""
                                    />
                                    <rect
                                        id={`rect-${svgId}`}
                                        width="16px"
                                        height="16px"
                                        className="handle trans"
                                        transform=""
                                    />
                                    <circle
                                        onClick={this.handleDeleteLink(
                                            d.id,
                                            parentId
                                        )}
                                        id={`circle-2-${svgId}`}
                                        className="handle-2 trans"
                                        cx="0"
                                        cy="0"
                                        r="8"
                                        transform=""
                                    />
                                    <rect
                                        onClick={this.handleDeleteLink(
                                            d.id,
                                            parentId
                                        )}
                                        id={`rect-2-${svgId}`}
                                        width="8px"
                                        height="1px"
                                        className="handle-3 trans"
                                        transform=""
                                    />
                                </svg>
                            </div>
                        );
                    });
                }
            });
        }
        return (
            <div
                id="drag-block"
                onMouseDown={this.handleTranslate}
                style={{ width: '100%', height: '100%' }}
            >
                <div
                    className={`drag-borad ${
                        this.props.stats ? 'stats-borad' : ''
                        }`}
                    id="drag-borad"
                    onMouseUp={this.handleAutoSave}
                >
                    <div id="menu-new-item" className="blockForMenu">
                        <SequenceMenu
                            id={id}
                            closeMenu={this.closeMenu}
                            isCardActionStep={this.state.isCardActionStep}
                            onStepAdded={this.onStepAdded}
                        />
                    </div>
                    <div style={{ display: 'none' }} id="my-drag-conn">
                        <svg className="">
                            <path
                                id="my-drag-conn-path"
                                className="path"
                                d=""
                            />
                            <rect
                                id="my-drag-conn-rect"
                                width="16px"
                                height="16px"
                                className="handle"
                                transform=""
                            />
                        </svg>
                    </div>
                    {jsx}
                    {svgJsx}
                </div>
            </div>
        );
    }
}
