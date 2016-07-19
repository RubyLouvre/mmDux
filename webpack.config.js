var webpack = require('webpack')

var path = require('path')
var node_modules = path.resolve(__dirname, 'node_modules')
var fs = require('fs')
var avalonPath = path.resolve(node_modules, 'avalon2/dist/avalon.js')
fs.readFile(avalonPath, 'utf8', function (e, text) {
    fs.writeFile(path.resolve(__dirname, './dist/avalon.js'), text)
})

function heredoc(fn) {
    return fn.toString().replace(/^[^\/]+\/\*!?\s?/, '').
            replace(/\*\/[^\/]+$/, '').trim().replace(/>\s*</g, '><')
}
var api = heredoc(function () {
    /*
    
     
     */
})

module.exports = {
    entry: {
        index: './src/index', //我们开发时的入口文件
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'mmDux.js',
        libraryTarget: 'umd',
        library: 'mmDux'
    }, //页面引用的文件
    plugins: [
        new webpack.BannerPlugin('mmDux by 司徒正美\n' + api)
    ],
    module: {
        loaders: [
            //http://react-china.org/t/webpack-extracttextplugin-autoprefixer/1922/4
            // https://github.com/b82/webpack-basic-starter/blob/master/webpack.config.js 
            {test: /\.html$/, loader: 'raw!html-minify'},
            {test: /\.(ttf|eot|svg|woff2?)((\?|#)[^\'\"]+)?$/, loader: 'file-loader?name=[name].[ext]'}

        ]
    },
   
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery', //加载$全局
            'window.avalon':'avalon2' //加载 avalon 全局 [******这里必须强制 window.avalon]
        }),
    ], 
    resolve: {
        alias: {
            'avalon':path.resolve(node_modules,'avalon2/dist/avalon.js')//这里就可以改成avalon.modern
        },
        
        extensions: ['.js', '', '.css']
    }
}

