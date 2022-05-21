// export default {
//   async fetch(request, env) {
//     const a = await env.LINKS.get('key')
//     return new Response("Hello World! "  +  a);
//   },
// };

import { Router } from 'itty-router'


const addLink = async (request, env) => {
  const link = await request.json()
  await env.LINKS.put(request.params.key, link)
  return new Response('Added key successfully')
}

const getLinkByKey = async (request, env) => {
  const value = await env.LINKS.get(request.params.key)
  if (value)
    return new Response(value)
  else 
    return new Response('No link found with given key', { status: 404 })
}

const deleteLinkByKey = async (request, env) => {
  await env.LINKS.delete(request.params.key)
  return new Response('Deleted key successfully')
}

const getAllKeysAndLinks = async (request, env) => {
  const list = await env.LINKS.list()

  for (let key of list.keys){
    const link = await env.LINKS.get(key.name)
    key.link = link
  }
  return new Response(JSON.stringify(list.keys))
}

const getAllKeys = async (request, env) => {
  const list = await env.LINKS.list()
  return new Response(JSON.stringify(list.keys))
}

const checkPass = ({ params }) => {
  const isAuth = (params.password == 'pass032')
  return new Response(isAuth)
}

const router = Router();
router
  .post('/api/link/:key', addLink)
  .get('/api/link/:key', getLinkByKey)
  .delete('/api/link/:key', deleteLinkByKey)
  .get('/api/allkeysandlinks', getAllKeysAndLinks)
  .get('/api/allkeys', getAllKeys)
  .get('/api/auth/:password', checkPass)
  // .get('/api/getRidesByUser', getRidesByUser)
  // .get('/api/getkey', (req, env) => new Response(env.MONGODB_API_KEY))
  // .get('/api/posts', ({ params, query }) => new Response(JSON.stringify(query)))
  // .get('/api/post/:id', ({ params }) => new Response(params.id))
  // .get('/api/user/:id', (req) => new Response(req.params.id))
  .get('*', () => new Response('Not found', { status: 404 }))
  .options('*', () => new Response('Not found', { status: 404 }));
  
export default {
  fetch: (request, env) => router
                            .handle(request, env)
                            .then(res => {
                              const headers = {
                                'Access-Control-Allow-Origin': '*',
                                "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS, PATCH",
                                "Access-Control-Allow-Headers": "origin, content-type, accept, x-requested-with",
                                'Content-type': 'application/json',
                              }
                              let response = new Response(res.body, { headers })
                              return response
                            })
};
