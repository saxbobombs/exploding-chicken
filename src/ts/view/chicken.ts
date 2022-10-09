import Utils from '../utils/utils';
import Screen from './screen';
import AbstractView from './abstractView';

import chickenPngSrc from './../../assets/images/chicken2.png';
import Point from '../abstract/point';

export default class chicken extends AbstractView {
    sprite: HTMLImageElement = new Image();

    helperCanvas: HTMLCanvasElement = document.createElement('canvas');
    helperContext: any;

    sprites = {
        right: [
            [66, 22],
            [98, 22],
            [130, 24],
            [162, 24]
        ],
        left: [
            [64, 90],
            [96, 89],
            [128, 88],
            [160, 88]
        ],

        explosion: [
            [240, 22],
            [205, 22],
            [23, 87],
            [23, 56],
            [23, 20]
        ]
    };

    currentSpritePos: number;

    path: Array<any> = [];

    currentPathX: number;
    currentPathY: number;
    directionX: number;
    directionY: number;

    screen: Screen;

    exploding: boolean = false;

    constructor(pConfig: any) {
        super();
        this.helperCanvas.width = pConfig.width;
        this.helperCanvas.height = pConfig.height;
        this.screen = pConfig.screen;

        this.helperContext = this.helperCanvas.getContext('2d');


        this.currentSpritePos = 0;
        const _borders = this.screen.getBorders();
        this.currentPathX = Utils.getRandom(0, _borders.right - this.helperCanvas.width);
        this.currentPathY = Utils.getRandom(0, _borders.bottom - this.helperCanvas.height);

        this.sprite.src = chickenPngSrc;

        this._drawChicken();
    }

    /**
     * generate the route
     */
    _createPath() {
        let _posStartX = this.currentPathX,
            _posStartY = this.currentPathY;
        
        let startPoint: Point = null;
        let endPoint: Point = null;
        let path: Point[] = [];

        for(let _i = 0; _i < Utils.getRandom(1,4); _i++) {
            if(!endPoint) {
                startPoint = new Point(_posStartX, _posStartY);
            } else {
                startPoint = endPoint;
            }

            endPoint = new Point(Utils.getRandom(0,1000), Utils.getRandom(0,1000));

            path = path.concat(Utils.getStraightPathToPoint(startPoint, endPoint));
        }
        
        this.path = path;

        this.fireEvent('pathCreated', this.path);
    }

    /**
     * get next path step
     *
     * check if the step is possible
     *
     * @return {step}
     */
    _getPath() {
        const _borders = this.screen.getBorders();

        if (this.path.length == 0) {
            this._createPath();
        }

        let _nextStep = this.path.shift();

        // TODO: enhance collision detection
        let _forceX: any = false,
            _forceY: any = false;

        if (_nextStep.x < _borders.left) {
            _forceX = Utils.getRandom(0, 1);
        }
        if (_nextStep.x + this.helperCanvas.width > _borders.right) {
            _forceX = Utils.getRandom(-1, 0);
        }

        if (_nextStep.y < _borders.top) {
            _forceY = Utils.getRandom(0, 1);
        }
        if (_nextStep.y + this.helperCanvas.height > _borders.bottom) {
            _forceY = Utils.getRandom(-1, 0);
        }

        if (_forceX !== false || _forceY !== false) {
            this.path = [];
            this._createPath();
            _nextStep = this.path.shift();
        }

        return _nextStep;
    }

    /**
     * frame step
     */
    tick() {
        super.tick();

        let _draw = false;

        if(this.isExploding()){
            if (this._tickCounter % 3 == 0) {
                _draw = true;
                this.currentSpritePos++;
            }

            if (this.currentSpritePos >= 5) {
                this.currentSpritePos = 0;
            }
        }else{
            if (this._tickCounter % 10 == 0) {
                _draw = true;
                this.currentSpritePos++;
            }

            if (this.currentSpritePos >= 4) {
                this.currentSpritePos = 0;
            }
        }

        if (_draw) {
            this._drawChicken();
        }
    }

    /**
     * draw the chicken to the helper
     */
    _drawChicken() {
        var _sprite: any;

        if (this.directionX >= 0) {
            _sprite = this.sprites.right[this.currentSpritePos];
        } else {
            _sprite = this.sprites.left[this.currentSpritePos];
        }
        if (this.exploding) {
            _sprite = this.sprites.explosion[this.currentSpritePos];
        }

        this.helperContext.clearRect(0, 0, this.helperCanvas.width, this.helperCanvas.height);
        this.helperContext.drawImage(this.sprite, _sprite[0] * -1, _sprite[1] * -1);
    }

    explode() {
        this.currentSpritePos = -1;
        this.exploding = true;
        this.path = [];
        this.fireEvent('explosionStart', this.getId());
    }

    isExploding() {
        return this.exploding;
    }

    get() {
        let _path: any = [];

        if (!this.isExploding()) {
            _path = this._getPath();
            this.currentPathX = _path.x;
            this.currentPathY = _path.y;
        }

        if (this.isExploding() && this.currentSpritePos == 4) {
            this.fireEvent('explosionEnd');
            return false;
        }

        return {
            img: this.helperCanvas,
            x: this.currentPathX,
            y: this.currentPathY,
            width: this.helperCanvas.width,
            height: this.helperCanvas.height,

        }
    }
};
