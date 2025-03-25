import Fs from 'fs'

const REQ_COUNT = 10

const image = Fs.readFileSync('./image', 'utf-8')
const startingTime = Date.now()

const promises = []

const controller = new AbortController()

for (let i = 0; i < REQ_COUNT; i++) {
    let v = i

    promises.push(
        fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            body: JSON.stringify({
                model: 'llava',
                prompt: 'What is in this picture ?',
                images: [image],
                max_tokens: 150,
                stream: false
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller.signal,
        }).then(async res => {
            console.log('REQUEST', v, 'FINSIHED', res.status, res.statusText)

            try {
                console.log(await res.json())
            } catch (err) {
                console.log(err)
            }
        })
    )
}

await Promise.all(promises)

const diff = Date.now() - startingTime

console.log(`Finsihed after ${diff / 1000 / 60}m`)

