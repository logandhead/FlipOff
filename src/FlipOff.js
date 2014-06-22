(function () {
    var FlipOff = function () {
        var flipCn, flipOff, imgLoader;
        flipCn = function (elem, index) {
            this.elem = $(elem);
            this.index = index;
            return this;
        };
        imgLoader = (function () {
            var load;
            load = function (src, html, callback) {
                var image;
                image = new Image(300, 300);
                image.src = src;
                image.onload = function () {
                    if (html && (callback !== null)) {
                        callback(html);
                    }
                };
            };
            return load;
        })();
        flipOff = function (opts) {
            var addTile, blocks, colCount, getTiles, init, options, positionTile, reLayout, setContainerHeight, setupBlocks, tileCount, tiles, windowWidth;
            if (opts.container === null) {
                throw new Error("You need to add a container");
            }
            options = $.extend({
                container: null,
                width: 300,
                margin: 20,
                cont_width: 960
            }, opts);
            tiles = [];
            blocks = [];
            colCount = 0;
            windowWidth = 0;
            addTile = function (opt) {
                var t, tile;
                tile = opt.html;
                t = new flipCn(tile, tiles.length);
                $(tile).addClass("tile");
                tiles.push(t);
                if (opt.img === null) {
                    positionTile(t);
                }
                else {
                    imgLoader(opt.img, t, positionTile);
                }
            },
				getWidth = function () {
				    var width = $(window).width();
				    if (opts.mediaQueries === null) {
				        return options.width;
				    }
				    else {
				        var w = options.width;
				        for (var media in opts.mediaQueries) {
				            var m = opts.mediaQueries[media];
				            if (m.window_min <= width && m.window_max >= width) {
				                w = m.width;
				                return m.width;
				            }
				        }
				        return w;

				    }
				};
            positionTile = function (t) {
                var img, index, leftPos, min, tWidth;
                tWidth = typeof (options.width) === "string" ?
                    (parseInt(options.width) / 100).toFixed(2) * $(options.container).width() : options.width;
                min = Array.min(blocks);
                index = $.inArray(min, blocks);

                leftPos = options.margin + (index * (tWidth + options.margin));
                leftPos = leftPos + (($(window).width() - (tWidth * colCount)) / 2) - ((options.margin * (colCount)) / colCount);
                $(t.elem).css({
                    left: leftPos + "px",
                    top: min + "px"
                });
                $(options.container).append(t.elem);
                $(t.elem).css({
                    opacity: 1
                });
                img = $(t.elem).find($(".tile_body img"))[0];
                $(t.elem).height($(img).height() + "px").width(tWidth + "px");
                $(t.elem).addClass("tiletest");
                $(img).animate({
                    opacity: 1
                }, 800);
                blocks[index] = min + $(t.elem).outerHeight() + options.margin;
                setContainerHeight();
            },
				setContainerHeight = function () {
				    $(options.container).height(Array.max(blocks) + "px");
				},
				getTiles = function () {
				    return tiles;
				},
				tileCount = function () {
				    return tiles.length;
				},
				setupBlocks = function () {
				    var cw, i, ww;
				    blocks = [];
				    cw = $(options.container).width() + options.margin;
				    ww = $(window).width();
				    options.width = getWidth();
				    windowWidth = (ww <= cw ? ww : cw);
				    colCount = Math.floor(windowWidth / (options.width + options.margin));
				    i = 0;
				    while (i < colCount) {
				        blocks.push(options.margin);
				        i++;
				    }
				},
				reLayout = function () {
				    var i;
				    setupBlocks();
				    i = 0;
				    while (i < tiles.length) {
				        positionTile(tiles[i]);
				        i++;
				    }
				},
				Array.min = function (array) {
				    return Math.min.apply(Math, array);
				},
				Array.max = function (array) {
				    return Math.max.apply(Math, array);
				},
				init = function () {
				    setupBlocks();
				};
            init();
            return {
                add: addTile,
                layout: reLayout,
                getTiles: getTiles
            };
        };
        return flipOff;
    };
})();