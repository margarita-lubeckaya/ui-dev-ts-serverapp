import http, {IncomingMessage, ServerResponse} from "http";
import path from "path";
import fs from "fs/promises";
import url from "url";

async function requestListener(req: IncomingMessage, res: ServerResponse) {

    const parseUrl = url.parse(req.url || "")

    let data = ''
    try {
        const responsePath = parseUrl.pathname === '/' ? '/index' : parseUrl.pathname
        const filePath = path.join(__dirname, `static${responsePath}.html`)
        console.log('filePath', filePath)
        data = await fs.readFile(filePath, 'utf-8');
    } catch {
        const errorPath = path.join(__dirname, `static/404.html`)
        data = await fs.readFile(errorPath, 'utf-8');
    }

    res.writeHead(200, {
        "Content-Type": "text/html",
        "Content-Length": data.length,
    })
    res.write(data);
    res.end();

}


http.createServer(requestListener).listen('3080', () => {
    console.log('listen the 3080 port')
})