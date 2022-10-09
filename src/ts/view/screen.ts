import AbstractView from './abstractView';
import Chicken from './chicken';
import Utils from './../utils/utils';

export default class Screen extends AbstractView {
    canvas: HTMLCanvasElement;
    context: any;
    chickens: Array<Chicken> = [];

    screenDestEl: HTMLElement;
    options: any;

    constructor(pScreenDest: HTMLElement, pOptions: any) {
        super();

        var _me = this;

        _me.options = pOptions;

        _me.canvas = document.createElement('canvas');
        _me.canvas.width = pScreenDest.clientWidth;
        _me.canvas.height = pScreenDest.clientHeight;

        _me.context = _me.canvas.getContext('2d');

        _me.canvas.addEventListener('mousedown', (e) => _me.hunt(e));

        _me.screenDestEl = pScreenDest;

        _me.screenDestEl.appendChild(_me.get());

        window.addEventListener('resize', Utils.debounce(function () {
            _me.canvas.width = _me.screenDestEl.clientWidth;
            _me.canvas.height = _me.screenDestEl.clientHeight;
        }));
    }

    /**
     * clear screen for next draw
     */
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * insert things/chicken to screen
     *
     * @param pChickenCfgToInsert
     */
    insert(pChicken: Chicken) {
        var _me = this;

        _me.chickens.push(pChicken);

        pChicken.on('explosionEnd', function(){
            _me.fireEvent('chickenExploded');
        });
    }

    tick() {
        const _me = this,
            _chickensToRemove: Array<number> = [];

        for (let _i = 0; _i < _me.chickens.length; _i++) {
            const _chicken = _me.chickens[_i];
            _chicken.tick();
            const _chickenCfg = _chicken.get();

            if (_chickenCfg !== false) {
                // chicken path
                if(_me.options.showChickenPath){
                    if(_chicken.path.length > 0){
                        _me.context.beginPath();
                        _me.context.moveTo(_chicken.path[0].x + 15, _chicken.path[0].y + 15);
                        for (let _x = 0; _x < _chicken.path.length; _x++) {
                            _me.context.lineTo(_chicken.path[_x].x + 15, _chicken.path[_x].y + 15);
                        }
                        for (let _y = _chicken.path.length - 1; _y > 0; _y--) {
                            _me.context.lineTo(_chicken.path[_y].x + 15, _chicken.path[_y].y + 15);
                        }
                        _me.context.lineTo(_chicken.path[0].x + 15, _chicken.path[0].y + 15);
                        _me.context.closePath();

                        _me.context.strokeStyle = '#777';
                        _me.context.stroke();
                    }
                }

                // chicken
                _me.context.drawImage(
                    _chickenCfg.img,
                    _chickenCfg.x,
                    _chickenCfg.y);
            } else {
                _chickensToRemove.push(_i);
            }
        }

        _me.chickens = _me.chickens.filter(function (value, index) {
            return _chickensToRemove.indexOf(index) == -1;
        });
    }

    /**
     *
     */
    getBorders(): any {
        return {
            top: 0,
            left: 0,
            bottom: this.canvas.height,
            right: this.canvas.width
        }
    }

    get(): HTMLCanvasElement {
        return this.canvas;
    }

    hunt(pEvent: any) {
        const _posX = pEvent.pageX,
            _posY = pEvent.pageY;

        for (let _i = 0; _i < this.chickens.length; _i++) {
            const _chicken = this.chickens[_i],
                _chickenCfg = _chicken.get();
            if (!_chickenCfg) {
                continue;
            }
            let _horizontalMatch = false,
                _verticalMatch = false;

            if (_chickenCfg.x < _posX && _chickenCfg.x + _chickenCfg.width > _posX) {
                _horizontalMatch = true;
            }

            if (_chickenCfg.y < _posY && _chickenCfg.y + _chickenCfg.height > _posY) {
                _verticalMatch = true;
            }

            if (_horizontalMatch && _verticalMatch && !_chicken.isExploding()) {
                _chicken.explode();
                break;
            }
        }
    }
}
