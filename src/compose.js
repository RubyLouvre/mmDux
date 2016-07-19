module.exports = function compose() {
    var fns = avalon.slice(arguments)


    if (fns.length === 0) {
        return function (arg) {
            return arg
        }
    } else {
        var _ret = function () {
            var last = fns[fns.length - 1]
            var rest = fns.slice(0, -1)
            return {
                v: function () {
                    return reduceRight(rest, function (composed, f) {
                        return f(composed)
                    }, last.apply(undefined, arguments))
                }
            }
        }()

        if (typeof _ret === "object")
            return _ret.v
    }
}

function reduceRight(ary, callback /*, initialValue*/) {
    if (ary.reduceRight) {
        return ary.reduceRight.apply(ary, avalon.slice(arguments,1))
    }
    if ('function' !== typeof callback) {
        throw new TypeError(callback + ' is not a function')
    }
    var t = Object(ary), len = t.length >>> 0, k = len - 1, value
    if (arguments.length >= 3) {
        value = arguments[2]
    } else {
        while (k >= 0 && !(k in t)) {
            k--
        }
        if (k < 0) {
            throw new TypeError('Reduce of empty array with no initial value')
        }
        value = t[k--]
    }
    for (; k >= 0; k--) {
        if (k in t) {
            value = callback(value, t[k], k, t)
        }
    }
    return value
}
