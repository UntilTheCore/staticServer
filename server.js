var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if(!port){
    console.log('请指定端口号\n')
    process.exit(1)
}

var server = http.createServer(function(request, response){
    var parsedUrl = url.parse(request.url, true)
    var pathWithQuery = request.url
    var queryString = ''
    if(pathWithQuery.indexOf('?') >= 0){ queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
    var path = parsedUrl.pathname
    var query = parsedUrl.query
    var method = request.method


    console.log('有请求过来啦！路径（带查询参数）为：' + pathWithQuery)

    path = path === '/' ? 'index.html' : path
    let index = path.lastIndexOf('.')
    let suffix = path.substring(index)
    console.log(suffix);
    const fileTypeTable = {
        '.html' : 'text/html',
        '.css' : 'text/css',
        '.js' : 'text/javascript',
        '.png' : 'image/png',
        '.jpg' : 'image/jpeg'
    }
    const fileType = fileTypeTable[suffix] || 'text/html'
    try {
        response.statusCode = 200
        response.setHeader('Content-Type', `${fileType};charset=utf-8`)
        let string = fs.readFileSync(`public/${path}`)
        response.write(string)
        response.end()
    }catch (e) {
        response.statusCode = 404
        response.setHeader('Content-Type', 'text/html;charset=uft8')
        // 增加一个meta避免返回的数据是中文时乱码。
        response.write('<meta charset="utf-8">')
        response.write('<h1>访问的路径不存在!</h1>')
        response.end()
    }
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请打开 http://localhost:' + port)
