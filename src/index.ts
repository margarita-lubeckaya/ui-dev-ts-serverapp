import http, {IncomingMessage, ServerResponse} from "http";
import path from "path";
import fs from "fs/promises";
import url from "url";
import fetch from "node-fetch"

interface Joke {
    id: string
    joke: string
    status: number
}

async function requestListener(req: IncomingMessage, res: ServerResponse) {

    const parseUrl = url.parse(req.url || "")
    const responsePath = parseUrl.pathname === '/' ? '/index' : parseUrl.pathname

    let data = ''
    try {
        const filePath = path.join(__dirname, `static${responsePath}.html`)
        data = await fs.readFile(filePath, 'utf-8');
    } catch {
        const errorPath = path.join(__dirname, `static/404.html`)
        data = await fs.readFile(errorPath, 'utf-8');
    }

    if (responsePath === '/dad-joke') {

        const response = await fetch('https://icanhazdadjoke.com', {
            headers: {
                accept: "application/json",
                "user-agent": "NodeJS Server",
            }
        })

        const joke : Joke = await response.json()

        console.log(joke)
        data = data.replace(/{{joke}}/gm, joke.joke)
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