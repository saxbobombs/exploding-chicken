import Point from "../abstract/point";

export default class Utils {
    /**
     * generate a random number between min and max
     *
     * @param min
     * @param max
     */
    static getRandom = function (min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /**
     * Returns a function, that, as long as it continues to be invoked, will not
     * be triggered. The function will be called after it stops being called for
     * N milliseconds. If `immediate` is passed, trigger the function on the
     * leading edge, instead of the trailing.
     *
     * source: https://stackoverflow.com/questions/2854407/javascript-jquery-window-resize-how-to-fire-after-the-resize-is-completed
     */
    static debounce = function (func: any, wait: any = undefined, immediate: any = undefined) {
        let timeout: any;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    static getStraightPathToPoint(startPoint: Point, endPoint: Point) {
        const path: Point[] = [];

        // bresenham's line algorithm
        let x0 = startPoint.x,
            y0 = startPoint.y,
            x1 = endPoint.x,
            y1 = endPoint.y,
            dx = Math.abs(x1 - x0),
            sx = x0 < x1 ? 1 : -1,
            dy = -1 * Math.abs(y1 - y0),
            sy = y0 < y1 ? 1 : -1,
            err = dx + dy;

        const t = true;

        while(t){
            if (x0 == x1 && y0 == y1){
                break;
            }

            let e2 = 2 * err;

            if (e2 >= dy){
                err += dy;
                x0 += sx;
            }

            if(e2 <= dx) {
                err += dx;
                y0 += sy;
            }

            path.push(new Point(x0, y0));
        }

        return path;
    }
}
